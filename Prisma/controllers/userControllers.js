import prisma from "../DB/db.config.js";

export const createUser = async (req, res) => {
    const { name, email, password } = req.body;

    const findUser = await prisma.user.findUnique({
        where: {
            email: email
        }
    })

    if (findUser) {
        return res.json({ status: 400, message: "User already exists" })
    }

    const newUser = await prisma.user.create({
        data: {
            name: name,
            email: email,
            password: password
        }
    })

    return res.json({ status: 200, data: newUser, msg: "User created successfully!" })
}

export const updateUserDetails = async (req, res) => {
    const userId = req.params.id;
    const { name, email, password } = req.body;

    const updatedUser = await prisma.user.update({
        where: {
            id: Number(userId)
        },
        data: {
            name, email, password
        }
    })

    return res.json({ status: 200, data: updatedUser, msg: "User Details Updated Successfully!" })
}

export const fetchAllUsers = async (req, res) => {
    const allUsers = await prisma.user.findMany({
        select: {
            _count: {
                select: {
                    post: true
                }
            }
        }
    });

    return res.json({ status: 200, data: allUsers })
}