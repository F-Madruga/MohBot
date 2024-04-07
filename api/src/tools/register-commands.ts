import { REST, Routes } from 'discord.js';
import logger from './logger';
import { Command } from '../types/command';

export default async function registerCommands(
    commands: Command[],
    discordToken: string,
    discordClientId: string,
) {
    const rest = new REST({ version: '10' }).setToken(discordToken);

    try {
        logger.info('Registering commands...');

        await rest.put(Routes.applicationCommands(discordClientId), {
            body: commands.map((command: Command) =>
                command.properties.toJSON(),
            ),
        });

        logger.info('Successfully register commands');
    } catch (error) {
        logger.error(error);
    }
}
