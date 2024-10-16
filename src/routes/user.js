import { Router } from "express";
import { login, signUp } from "../controllers/Auth.js";
import { auth, isStudent, isAdmin } from "../middlewares/routeProtector.js";
const router = Router();

router
  .post("/login", login)
  .post("/signup", signUp)
  .get("/student", auth, isStudent, (req, res) => {
    res.json({
      success: true,
      message: "Welcome to protected route of students",
    });
  })
  .get("/admin", auth, isAdmin, (req, res) => {
    res.json({
      success: true,
      message: "Welcome to protected route of admin",
    });
  })
  .get("/test", auth, (req, res) => {
    res.json({
      success: true,
      message: "Welcome to protected route of TESTS",
    });
  })
export default router;
