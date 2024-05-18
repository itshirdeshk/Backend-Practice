import { Router } from "express";
import { createComment, fetchAllComments, updateCommentDetails } from "../controllers/commentController.js";
const router = Router();

router.post("/", createComment)
router.get("/", fetchAllComments)
router.put("/:id", updateCommentDetails)

export default router;