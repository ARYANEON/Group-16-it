import { userRepo } from "@/database/repo";
import { createToken } from "@/helper/jwt";
import { verifyPassword } from "@/helper/password";
import { CreateAndLoginUserBody } from "@/helper/schema";
import { AuthRequest, authReq } from "@/middleware/auth.middleware";
import { Router } from "express";

const router = Router();
router.post("/createUser", async (req, res) => {
  try {
    const data = CreateAndLoginUserBody.safeParse(req.body);
    if (data.error) {
      return res.status(405).json(data.error.errors);
    }
    const newUser = userRepo.create({
      ...data.data,
    });
    const sUser = await userRepo.save(newUser);
    res.cookie("token", createToken({ id: sUser.id }));
    return res.json(sUser);
  } catch (e) {
    return res.status(500).json(e);
  }
});
router.post("/LoginUsers", async (req, res) => {
  try {
    const data = CreateAndLoginUserBody.safeParse(req.body);
    if (data.error) {
      return res.status(405).json(data.error.errors);
    }
    const usersData = await userRepo.findOne({
      where: {
        email: data.data.email,
      },
    });
    if (!usersData) {
      return res.status(404).json({
        message: "user not found",
      });
    }
    if (!(await verifyPassword(data.data.password, usersData.password))) {
      return res.status(401).json({
        message: "incorrect password",
      });
    }
    res.cookie("token", createToken({ id: usersData.id }));
    return res.json(usersData);
  } catch (e) {
    return res.status(500).json(e);
  }
});
router.delete("/delete-users", authReq, async (req: AuthRequest, res) => {
  try {
    await userRepo.delete({ id: req.userData.id });
    return res.send("Done");
  } catch (e) {
    return res.status(500).json({
      message: e,
    });
  }
});
export default router;
