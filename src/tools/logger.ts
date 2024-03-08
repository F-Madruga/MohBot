import pino from 'pino';
import { Type } from '@sinclair/typebox';
import env from '../env';

export enum LogLevel {
    ERROR = 'error',
    WARN = 'warn',
    INFO = 'info',
    DEBUG = 'debug',
    FATAL = 'fatal',
    TRACE = 'trace',
}

export const LogLevelSchema = Type.Enum(LogLevel);

export const logger = pino({
    name: 'MohBot',
    level: env.LOGGER_LEVEL,
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true,
        },
    },
});
