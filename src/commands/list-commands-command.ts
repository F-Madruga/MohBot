import { SlashCommandBuilder } from 'discord.js';
import { Command, CommandHandlerArgs } from '../types/command';

const command: Command = {
    properties: new SlashCommandBuilder()
        .setName('listcommands')
        .setDescription('List all available commands'),

    handler: async ({ interaction, commands }: CommandHandlerArgs) => {
        let result = '';

        for (let command of commands.values()) {
            result += `**${command.properties.name}**: ${command.properties.description}\n`;
        }

        await interaction.reply({ content: result });
    },
};

export default command;
