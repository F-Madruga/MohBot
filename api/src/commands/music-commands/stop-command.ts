import { SlashCommandBuilder } from 'discord.js';
import { Command, CommandHandlerArgs } from '../../types/command';
import * as musicManager from '../../managers/music-manager';

const command: Command = {
    properties: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stops music currently playing'),

    handler: async ({ interaction, config }: CommandHandlerArgs) => {
        return musicManager.stop({ interaction, config });
    },
};

export default command;
