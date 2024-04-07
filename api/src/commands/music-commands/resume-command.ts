import { SlashCommandBuilder } from 'discord.js';
import { Command, CommandHandlerArgs } from '../../types/command';
import * as musicManager from '../../managers/music-manager';

const command: Command = {
    properties: new SlashCommandBuilder()
        .setName('resume')
        .setDescription('Resumes music currently playing'),

    handler: async ({ interaction, config }: CommandHandlerArgs) => {
        return musicManager.resume({ interaction, config });
    },
};

export default command;
