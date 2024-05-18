import prisma from "../DB/db.config.js";

export const createPost = async (req, res) => {
    const { user_id, title, description } = req.body;

    const newPost = await prisma.post.create({
        data: {
            user_id: Number(user_id),
            title,
            description
        }
    })

    return res.json({ status: 200, data: newPost, msg: "Post created successfully!" })
}

export const updatePostDetails = async (req, res) => {
    const postId = req.params.id;
    const { title, description } = req.body;

    const updatedPost = await prisma.post.update({
        where: {
            id: Number(postId)
        },
        data: {
            title, description
        }
    })

    return res.json({ status: 200, data: updatedPost, msg: "Post Details Updated Successfully!" })
}

export const fetchAllPosts = async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    if (page <= 0) page = 1;
    if (limit <= 0 || limit > 100) limit = 10

    const skip = (page - 1) * limit;

    const allPosts = await prisma.post.findMany({
        skip: skip,
        take: limit,
        include: {
            comment: {
                include: {
                    user: {
                        select: {
                            name: true
                        }
                    }
                }
            }
        },
        orderBy: {
            id: "desc"
        },
        // where: {
        //     // comment_count: {
        //     //     gt: 0
        //     // }
        //     OR: [
        //         {
        //             title: {
        //                 startsWith: "Next"
        //             }
        //         }, {
        //             title: {
        //                 endsWith: "Blog"
        //             }
        //         }
        //     ]
        // }
    });

    const totalPosts = await prisma.post.count();
    const totalPages = Math.ceil(totalPosts / limit);

    return res.json({
        status: 200, data: allPosts, meta: {
            totalPages, currentPage: page, limit
        }
    })
}

export const searchPost = async (req, res) => {
    const query = req.query.q;
    const posts = await prisma.post.findMany({
        where: {
            description: {
                search: query
            }
        }
    })

    return res.json({ status: 200, data: posts })
}