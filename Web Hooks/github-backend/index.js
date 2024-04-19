const express = require("express");
const app = express();
const axios = require("axios");

app.use(express.json());

const webhooks = {
    COMMIT: [],
    PUSH: [],
    MERGE: [],
};

app.post("/api/webhooks", (req, res) => {
    const { payloadUrl, secret, eventTypes } = req.body;

    eventTypes.forEach((eventType) => {
        webhooks[eventType].push({ payloadUrl, secret });
    });

    return res.sendStatus(201);
});

app.post("/api/event-emulate", (req, res) => {
    const { type, data } = req.body;

    // Business logic goes here

    // Event trigger (Call webhook)
    setTimeout(async () => {
        // Async
        const webhookList = webhooks[type];
        for (let i = 0; i < webhookList.length; i++) {
            const { payloadUrl, secret } = webhookList[i];
            await axios.post(payloadUrl, data, {
                headers: {
                    "x-secret": secret,
                },
            });
        }
    }, 0);

    return res.sendStatus(200);
});

app.get("/db", (req, res) => {
    return res.json(webhooks);
});

const port = process.env.PORT || 5600;
app.listen(port, function () {
    console.log(`Server listening on PORT: ${port}`);
});
