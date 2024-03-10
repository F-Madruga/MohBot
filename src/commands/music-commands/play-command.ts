import { SlashCommandBuilder } from 'discord.js';
import { CommandHandlerArgs } from '../../types/command';

export default {
    properties: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play music in your voice chat')
        .addStringOption((option) =>
            option
                .setName('query')
                .setDescription(
                    'Link or name of the music/playlist you want to play',
                )
                .setRequired(true),
        ),
    handler,
};

async function handler({ interaction }: CommandHandlerArgs): Promise<void> {
    await interaction.reply({ content: 'ok' });
}
