import { SlashCommandBuilder } from 'discord.js';
import { Command, CommandHandlerArgs } from '../../types/command';
import * as musicManager from '../../managers/music-manager';

const command: Command = {
    properties: new SlashCommandBuilder()
        .setName('listmusics')
        .setDescription('List all musics in queue'),

    handler: async ({ interaction, config }: CommandHandlerArgs) => {
        return musicManager.listQueue({ interaction, config });
    },
};

export default command;
