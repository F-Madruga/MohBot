import { SlashCommandBuilder } from 'discord.js';
import { Command, CommandHandlerArgs } from '../../types/command';
import * as musicManager from '../../managers/music-manager';

const command: Command = {
    properties: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Plays next music'),

    handler: async ({ interaction, config }: CommandHandlerArgs) => {
        return musicManager.skip({ interaction, config });
    },
};

export default command;
