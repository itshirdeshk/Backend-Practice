import { Router } from "express";
import { createPost, fetchAllPosts, searchPost, updatePostDetails } from "../controllers/postController.js";
const router = Router();

router.post("/", createPost)
router.get("/", fetchAllPosts)
router.get("/search", searchPost)
router.put("/:id", updatePostDetails)

export default router;