import pino from 'pino';
import env from '../env';

const logger = pino({
    name: 'MohBot',
    level: env.LOGGER_LEVEL,
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true,
        },
    },
});

export default logger;
