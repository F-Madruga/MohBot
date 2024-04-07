import pino from 'pino';
import env from '../env';
import { BOT_NAME } from '../constants';

const logger = pino({
    name: BOT_NAME,
    level: env.LOGGER_LEVEL,
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true,
        },
    },
});

export default logger;
