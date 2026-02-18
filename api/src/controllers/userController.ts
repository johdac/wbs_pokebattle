import { User } from "#models";
import type { RequestHandler } from "express";

export const userGetAll: RequestHandler = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

export const userCreate: RequestHandler = async (req, res) => {
  const data = await User.create(req.body);
  const { password, ...safeUser } = data.toObject();
  res.json(safeUser);
};
