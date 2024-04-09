import { LogLevel } from './env';
import { makeError } from './types/error';

export const ERR_ENTITY_NOT_FOUND = makeError('ERR_ENTITY_NOT_FOUND', {
    message: 'Entity not found',
    status: 404,
    level: LogLevel.INFO,
});

export const ERR_ENTITY_ALREADY_EXIST = makeError('ERR_ENTITY_ALREADY_EXIST', {
    message: 'Entity already exist',
    status: 409,
    level: LogLevel.INFO,
});