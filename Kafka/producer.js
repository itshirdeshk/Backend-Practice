const { kafka } = require("./client")
const readline = require("readline")

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

async function init() {
    const producer = kafka.producer();
    console.log("Connecting Producer");

    await producer.connect();
    console.log("Connected Producer Successfully!");

    rl.setPrompt("> ")
    rl.prompt();

    rl.on('line', async function (line) {
        const [riderName, loc] = line.split(" ");


        await producer.send({
            topic: "rider-updates",
            messages: [
                {
                    partition: loc.toLowerCase() === "north" ? 0 : 1,
                    key: "location-update", value: JSON.stringify({
                        name: riderName, loc
                    })
                }
            ]
        });
    }).on("close", async () => {
        await producer.disconnect();
    })
}

init();