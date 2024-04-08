import { LogLevel } from '../env';

export class ServerError extends Error implements NodeJS.ErrnoException {
    protected static readonly code: string;

    public level: LogLevel;
    public code?: string;
    public status?: number;
    public isServerError?: boolean;

    constructor(
        err?: string | ServerError | NodeJS.ErrnoException,
        { level, code, status, message }: ErrorOptions = {},
    ) {
        if (err instanceof Error) {
            super(message || err.message);
            code = code || err.code;
            if ('level' in err) {
                level = level || err.level;
            }
        } else {
            super(err || message);
        }

        Object.defineProperty(this, 'name', {
            value: code
                ? `${this.constructor.name} [${code}]`
                : this.constructor.name,
            enumerable: false,
        });

        this.level = level || LogLevel.ERROR;
        this.status = status;
        this.code = code;

        Error.captureStackTrace(this, this.constructor);

        if (err instanceof Error) {
            this.stack = `${this.stack}\n  Original error: ${err.stack}`;
        }

        Object.defineProperty(this, 'isServerError', {
            value:
                typeof err === 'string' ||
                (err instanceof Error && isServerError(err as Error)) ||
                err === undefined,
            enumerable: false,
            configurable: false,
            writable: false,
        });
    }

    public static constructorOf(err: any): boolean {
        return this.code === err?.code && this.name === err?.constructor?.name;
    }
}

export function isServerError(v: Error): v is ServerError {
    return (
        v.constructor.name === ServerError.name &&
        (v as ServerError).isServerError === true
    );
}

interface ErrorOptions {
    level?: LogLevel;
    code?: string;
    status?: number;
    message?: string;
}

const OriginalServerError = ServerError;
export function makeError(
    code: string,
    defaultOptions: Omit<ErrorOptions, 'code'> = {},
): typeof ServerError {
    return class ServerError extends OriginalServerError {
        protected static readonly code = code;
        constructor(
            err?: string | ServerError | NodeJS.ErrnoException,
            options: ErrorOptions = {},
        ) {
            const overrides: ErrorOptions = {
                code,
            };

            const combinedOptions = Object.assign(
                {},
                defaultOptions,
                options,
                overrides,
            );

            super(err, combinedOptions);
        }
    };
}
