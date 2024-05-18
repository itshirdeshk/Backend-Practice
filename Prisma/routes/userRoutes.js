import { Router } from "express";
import { createUser, fetchAllUsers, updateUserDetails } from "../controllers/userControllers.js";
const router = Router();

router.post("/", createUser)
router.get("/", fetchAllUsers)
router.put("/:id", updateUserDetails)

export default router;