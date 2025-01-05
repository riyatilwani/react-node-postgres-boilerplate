import { Request, Response } from "express";
import userService from "../services/user.service";

const getUser = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any).id;
    const user = await userService.findUserById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json({ user: userService.getUserSafe(user) });
  } catch (error: any) {
    console.error("Error fetching user:", error.message);
    return res.status(500).json({ error: "Server error", message: error.message });
  }
};

export default {
  getUser,
};
