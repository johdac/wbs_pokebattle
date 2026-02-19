import type { RequestHandler } from "express";
import { ACCESS_JWT_SECRET, REFRESH_TOKEN_TTL, SALT_ROUNDS } from "#config";
import { User, RefreshToken } from "#models";
import bcrypt from "bcrypt";
import { createTokens } from "#utils";
import jwt from "jsonwebtoken";

export const register: RequestHandler = async (req, res) => {
  const { username, email, password } = req.body;
  const emailExists = await User.exists({ email });
  if (emailExists)
    throw new Error("The email is already registered", {
      cause: { status: 409 },
    });
  const usernameExists = await User.exists({ username });
  if (usernameExists)
    throw new Error("Username is already taken, choose another one!", {
      cause: { status: 409 },
    });

  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    email,
    password: hashedPassword,
    username,
  });

  const [refreshToken, accessToken] = await createTokens(user);

  res
    .status(201)
    .json({ message: `${username} Registered!`, accessToken, refreshToken });
};

export const login: RequestHandler = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");
  console.log("Request body:", req.body);
  console.log("Email:", email);
  console.log("Password:", password);
  if (!user)
    throw new Error("Incorrect credentials", { cause: { status: 401 } });

  const match = await bcrypt.compare(password, user.password);

  if (!match)
    throw new Error("Incorrect credentials", { cause: { status: 401 } });
  await RefreshToken.deleteMany({ userId: user._id });
  // generate refresh and access tokens
  const [refreshToken, accessToken] = await createTokens(user);

  res.json({
    message: "Welcome back! Ready for battle?",
    refreshToken,
    accessToken,
  });
};

export const refresh: RequestHandler = async (req, res) => {
  const { refreshToken } = req.body;
  const storedToken = await RefreshToken.findOne({ token: refreshToken });
  if (!storedToken)
    throw new Error("Please sign in again", { cause: { status: 403 } });
  await RefreshToken.findByIdAndDelete(storedToken._id);
  const user = await User.findById(storedToken.userId);
  if (!user)
    throw new Error("User account not found!", { cause: { status: 403 } });
  const [newRefreshToken, newAccessToken] = await createTokens(user);
  res.json({
    message: "Refreshed",
    refreshToken: newRefreshToken,
    accessToken: newAccessToken,
  });
};

export const logout: RequestHandler = async (req, res) => {
  const { refreshToken } = req.body;
  await RefreshToken.deleteOne({ token: refreshToken });
  res.json({ message: "You are signed out successfully! " });
};

export const me: RequestHandler = async (req, res, next) => {
  const authHeader = req.header("authorization");
  console.log("authHeader:", authHeader);
  const accessToken = authHeader && authHeader.split(" ")[1];
  if (!accessToken) throw Error("Please sign in", { cause: { status: 401 } });

  try {
    const decoded = jwt.verify(
      accessToken,
      ACCESS_JWT_SECRET,
    ) as jwt.JwtPayload;
    console.log(decoded);

    if (!decoded.sub)
      throw new Error("Invalid or expired access token", {
        cause: { status: 401 },
      });

    const user = await User.findById(decoded.sub);

    if (!user) throw new Error("User not found", { cause: { status: 404 } });

    res.json({ user });
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      next(
        new Error("Expired access token", {
          cause: { status: 401, code: "ACCESS_TOKEN_EXPIRED" },
        }),
      );
    } else {
      next(new Error("Invalid access token.", { cause: { status: 401 } }));
    }
  }
};
