import prisma from "../DB/db.config.js";

export const createComment = async (req, res) => {
    const { user_id, post_id, comment } = req.body;

    await prisma.post.update({
        where: {
            id: Number(post_id)
        },
        data: {
            comment_count: {
                increment: 1
            }
        }
    })

    const newPost = await prisma.comment.create({
        data: {
            user_id: Number(user_id),
            post_id: Number(post_id),
            comment
        }
    })

    return res.json({ status: 200, data: newPost, msg: "Comment created successfully!" })
}

export const updateCommentDetails = async (req, res) => {
    const commentId = req.params.id;
    const { comment } = req.body;

    const updatedPost = await prisma.comment.update({
        where: {
            id: Number(commentId)
        },
        data: {
            comment
        }
    })

    return res.json({ status: 200, data: updatedPost, msg: "Comment Details Updated Successfully!" })
}

export const fetchAllComments = async (req, res) => {
    const allComments = await prisma.comment.findMany({});

    return res.json({ status: 200, data: allComments })
}