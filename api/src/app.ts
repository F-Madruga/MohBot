import env, { NodeEnv } from './env';
import discordBot from './discord-bot';
import commands from './commands';
import logger from './tools/logger';

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
