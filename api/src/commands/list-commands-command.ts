import { SlashCommandBuilder } from 'discord.js';
import { Command, CommandHandlerArgs } from '../types/discord-bot';

const command: Command = {
    properties: new SlashCommandBuilder()
        .setName('listcommands')
        .setDescription('List all available commands'),

    handler: async ({ interaction, discordBot }: CommandHandlerArgs) => {
        let result = '';

        for (const command of discordBot.commands.values()) {
            result += `**${command.properties.name}**: ${command.properties.description}\n`;
        }

        await interaction.followUp({ content: result });
    },
};

export default command;
