const client = require("../client");

async function init() {
    await client.set("name:4", "Nodejs")
    const result = await client.get("name:4");
    console.log("Result ->", result);
}

init();