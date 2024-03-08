import { Type } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';

export enum NodeEnv {
    TEST = 'test',
    DEV = 'dev',
    PROD = 'prod',
}

export const NodeEnvSchema = Type.Enum(NodeEnv);

export enum LogLevel {
    ERROR = 'error',
    WARN = 'warn',
    INFO = 'info',
    DEBUG = 'debug',
    FATAL = 'fatal',
    TRACE = 'trace',
}

export const LogLevelSchema = Type.Enum(LogLevel);

export const envSchema = Type.Object({
    NODE_ENV: NodeEnvSchema,
    LOGGER_LEVEL: LogLevelSchema,
    DISCORD_TOKEN: Type.String(),
    CLIENT_ID: Type.String(),
    GUILD_ID: Type.String(),
});

export default Value.Decode(envSchema, {
    NODE_ENV: process.env.NODE_ENV,
    LOGGER_LEVEL: process.env.LOGGER_LEVEL,
    DISCORD_TOKEN: process.env.DISCORD_TOKEN,
    CLIENT_ID: process.env.CLIENT_ID,
    GUILD_ID: process.env.GUILD_ID,
});
