import { SlashCommandBuilder } from 'discord.js';
import { Command, CommandHandlerArgs } from '../types/command';

const command: Command = {
    properties: new SlashCommandBuilder()
        .setName('healthcheck')
        .setDescription('Replies ok if the bot is healthy'),

    handler: async ({ interaction }: CommandHandlerArgs) => {
        await interaction.followUp({ content: 'ok' });
    },
};

export default command;
