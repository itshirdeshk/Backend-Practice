const express = require("express");

const app = express();
app.use(express.json());

const messages = [];

const authMiddleare = (req, res, next) => {
    const headers = req.headers;
    const secretHeader = headers["x-secret"];
    if (secretHeader !== process.env.WEBHOOK_SECRET) {
        return res.sendStatus(401);
    }
    next();
};

app.post("/git-info", authMiddleare, (req, res) => {
    const data = req.body;
    messages.push(data);
    return res.sendStatus(200);
});

app.get("/", (req, res) => {
    return res.json(messages);
});

const port = process.env.PORT || 5601;

app.listen(port, () => {
    console.log(`Listening on PORT: ${port}`);
});
