import { SlashCommandBuilder } from 'discord.js';
import { CommandHandlerArgs } from '../types/command';

export default {
    properties: new SlashCommandBuilder()
        .setName('listcommands')
        .setDescription('List all available commands'),
    handler,
};

async function handler({
    interaction,
    commands,
}: CommandHandlerArgs): Promise<void> {
    let result = '';

    for (let command of commands.values()) {
        result += `**${command.properties.name}**: ${command.properties.description}\n`;
    }

    await interaction.reply({ content: result });
}
