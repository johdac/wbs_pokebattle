import { Score } from "#models";
import type { RequestHandler } from "express";

export const scoreGetAll: RequestHandler = async (req, res) => {
  const scores = await Score.find()
    .populate("userId", "username")
    .sort({ score: -1 });
  res.json(scores);
};

export const scoreCreate: RequestHandler = async (req, res) => {
  const data = await Score.create(req.body);
  res.json(data);
};
