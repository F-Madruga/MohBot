import { REST, Routes } from 'discord.js';
import logger from './logger';

export default async function registerCommands(
    commands: any,
    discordToken: string,
    discordClientId: string,
) {
    const rest = new REST({ version: '10' }).setToken(discordToken);

    try {
        logger.info('Registering commands...');

        await rest.put(Routes.applicationCommands(discordClientId), {
            body: commands,
        });

        logger.info('Successfully register commands');
    } catch (error) {
        throw new Error('Failed to register commands', error);
    }
}
