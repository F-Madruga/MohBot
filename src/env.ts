import { Type } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';

const envSchema = Type.Object({
    NODE_ENV: Type.Union([
        Type.Literal('test'),
        Type.Literal('dev'),
        Type.Literal('prod'),
    ]),
    LOGGER_LEVEL: Type.Union([
        Type.Literal('fatal'),
        Type.Literal('error'),
        Type.Literal('warn'),
        Type.Literal('info'),
        Type.Literal('debug'),
        Type.Literal('trace'),
    ]),
});

export default Value.Decode(envSchema, {
    NODE_ENV: process.env.NODE_ENV,
    LOGGER_LEVEL: process.env.LOGGER_LEVEL,
});
