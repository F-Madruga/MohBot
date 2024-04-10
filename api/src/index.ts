import { bot } from './app';

bot.listen().catch((error: Error) => {
    bot.log.error(`UNEXPECTED ERROR\n${JSON.stringify(error, null, 2)}`);
    process.exit(1);
});
