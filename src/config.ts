import { ConsumerGlobalConfig } from "node-rdkafka";

export const RDKAFKA_CONFIG: ConsumerGlobalConfig = {
    "metadata.broker.list": "localhost:9092",
};
