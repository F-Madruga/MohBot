import env, { NodeEnv } from './env';
import commands from './commands';
import logger from './tools/logger';
import { discordBot } from './types/discord-bot';

export const bot = discordBot({
    config: {
        token: env.DISCORD_TOKEN,
        clientId: env.DISCORD_CLIENT_ID,
        guildId: env.DISCORD_GUILD_ID,
    },
    commands,
    log: logger,
    deployCommands: env.NODE_ENV === NodeEnv.PROD,
});
