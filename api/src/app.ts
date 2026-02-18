import "#db";
import express from "express";
import { errorHandler } from "#middleware";
import { userRoutes } from "#routes";
import cors from "cors";

const app = express();
const port = process.env.API_PORT;

app.use(cors({ origin: "*" }));
app.use(express.json());

app.route("/").get((req, res) => {
  res.json("Hello World");
});
app.use("/users", userRoutes);
app.use("*splat", (req, res) => {
  throw new Error("Not found", { cause: { status: 404 } });
});

app.use(errorHandler);
app.listen(port, () =>
  console.log(`Server is running on port http://localhost:${port}`),
);
