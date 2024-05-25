const { Kafka } = require("kafkajs")

exports.kafka = new Kafka({
    brokers: ['172.19.16.1:9092'],
    clientId: "my-app"
})
