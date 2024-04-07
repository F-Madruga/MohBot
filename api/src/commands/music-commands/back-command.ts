import { SlashCommandBuilder } from 'discord.js';
import { Command, CommandHandlerArgs } from '../../types/command';
import * as musicManager from '../../managers/music-manager';

const command: Command = {
    properties: new SlashCommandBuilder()
        .setName('back')
        .setDescription('Plays previous music'),

    handler: async ({ interaction, config }: CommandHandlerArgs) => {
        return musicManager.back({ interaction, config });
    },
};

export default command;
