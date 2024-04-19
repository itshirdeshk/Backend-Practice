const express = require("express");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const { USERS } = require("./users");
const { TODOS } = require("./todos");

async function startServer() {
    const app = express();
    const server = new ApolloServer({
        typeDefs: `
            type User{
                id: ID!,
                name: String!,
                username: String!,
                email: String!,
                phone: String!,
                website: String!
            }

            type Todo{
                id: ID!
                title: String!
                completed: Boolean,
                user: User
            }

            type Query {
                getTodos: [Todo],
                getAllUsers: [User],
                getUser(id: ID!): User
            }
        `,
        resolvers: {
            Todo: {
                user: async (todo) => {
                    return USERS.find((e) => e.id === todo.id);
                },
            },
            Query: {
                getTodos: () => {
                    return TODOS;
                },
                getAllUsers: () => {
                    return USERS;
                },
                getUser: async (parent, { id }) => {
                    return USERS.find((e) => e.id === id);
                },
            },
        },
    });

    app.use(bodyParser.json());
    app.use(cors());

    await server.start();

    app.use("/graphql", expressMiddleware(server));

    app.listen(8000, () => console.log("Server started at PORT: 8000"));
}

startServer();
