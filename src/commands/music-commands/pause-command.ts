import { SlashCommandBuilder } from 'discord.js';
import { Command, CommandHandlerArgs } from '../../types/command';
import * as musicManager from '../../managers/music-manager';

const command: Command = {
    properties: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pause music currently playing'),

    handler: async ({ interaction, config }: CommandHandlerArgs) => {
        return musicManager.pause({ interaction, config });
    },
};

export default command;
