import Kafka from "node-rdkafka";
import { RDKAFKA_CONFIG } from "./config";
import { getVmStats } from "./vm_stats";

async function sendStats(producer: Kafka.Producer) {
    console.log("Reading.");
    const vmStats = await getVmStats();

    console.log("Sending.");
    vmStats.forEach(({ metric, count }) => {
        producer.produce(
            'vm_stats',
            null,
            Buffer.from(JSON.stringify(
                { metric, count, }
            )),
        );
    });
};

const producer = new Kafka.Producer(
    RDKAFKA_CONFIG,
);

producer.connect();
producer
    .on('ready', () => {
        setInterval(() => sendStats(producer), 100);
    })
    .on('event.error', console.error)
    .setPollInterval(500);
