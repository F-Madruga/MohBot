import { SlashCommandBuilder } from 'discord.js';
import { CommandHandlerArgs } from '../types/command';

export default {
    properties: new SlashCommandBuilder()
        .setName('healthcheck')
        .setDescription('Replies ok if the bot is healthy'),
    handler,
};

async function handler({ interaction }: CommandHandlerArgs): Promise<void> {
    await interaction.reply({ content: 'ok' });
}
