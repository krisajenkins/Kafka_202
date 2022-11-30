import Kafka from 'node-rdkafka';
import { RDKAFKA_CONFIG } from './config';

const consumer = new Kafka.KafkaConsumer(
    {
        ...RDKAFKA_CONFIG,
    },
    {
        'auto.offset.reset': 'earliest',
    },

);

let n = 0;

consumer
    .on('ready', () => {
        consumer.subscribe(['vm_stats']);
        consumer.consume();
    })
    .on('data', (message) => {
        n++;
        if (message.offset % 1000 === 0) {
            console.log(`${n} ${message.partition}/${message.offset} ${message.key} / ${message.value}`);
        }
    })
    .on('event.log', (e) => console.log(e.message));

const shutdown = (signal: string) => {
    console.warn('SHUTDOWN', signal);
    consumer.disconnect();
};

process.on('SIGHUP', shutdown);
process.on('SIGINT', shutdown);
process.on('SIGQUIT', shutdown);
process.on('SIGUSR2', shutdown);

consumer.connect()
