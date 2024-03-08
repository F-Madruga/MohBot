import env from './env';
import logger from './tools/logger';
import registerCommands from './tools/register-commands';

async function main() {
    await registerCommands([], env.DISCORD_TOKEN, env.DISCORD_CLIENT_ID);
}

main().catch((error) => {
    logger.error(error);
});
