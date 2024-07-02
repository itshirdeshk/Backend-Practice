const express = require("express")
const client = require("prom-client") // Metric Collection
const reponseTime = require("response-time")
const { doSomeHeavyTask } = require("./utils")

const app = express();
const PORT = process.env.PORT || 8000;

const { createLogger } = require("winston");
const LokiTransport = require("winston-loki");
const options = {
    transports: [
        new LokiTransport({
            host: "http://127.0.0.1:3100"
        })
    ]
};
const logger = createLogger(options);

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ register: client.register })

const reqResTime = new client.Histogram({
    name: "http_express_req_res_time",
    help: "This tells how much time is taken by req and res",
    labelNames: ["method", "route", "status_code"],
    buckets: [1, 50, 100, 200, 400, 500, 800, 1000, 2000]
});

app.use(reponseTime((req, res, time) => {
    reqResTime.labels({
        method: req.method,
        route: req.url,
        status_code: res.statusCode
    }).observe(time);
}))

app.get("/", (req, res) => {
    logger.info("Request came on / Route")
    return res.json({ message: `Hello from express server...` })
})

app.get("/slow", async (req, res) => {
    try {
        logger.info("Request came on /slow Route")
        const timeTaken = await doSomeHeavyTask();
        return res.json({
            status: "success",
            message: `Heavy task completed in ${timeTaken}ms`
        })
    } catch (error) {
        logger.error(error.message)
        return res.status(500).json({ status: "Error", message: "Internal Server error" })
    }
})

app.get("/metrics", async (req, res) => {
    res.setHeader("Content-Type", client.register.contentType);
    const metrics = await client.register.metrics();
    res.send(metrics);
})

app.listen(PORT, () => {
    console.log(`Express server started at PORT ${PORT}`);
})