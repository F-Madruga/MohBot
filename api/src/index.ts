import { bot } from './app';

bot.listen().catch((error: Error) => {
    bot.log.error(error);
    process.exit(1);
});
