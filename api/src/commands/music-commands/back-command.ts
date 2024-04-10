import { SlashCommandBuilder } from 'discord.js';
import { Command, CommandHandlerArgs } from '../../types/discord-bot';
import * as musicManager from '../../managers/music-manager';

const command: Command = {
    properties: new SlashCommandBuilder()
        .setName('back')
        .setDescription('Plays previous music'),

    handler: async ({ interaction, discordBot }: CommandHandlerArgs) => {
        return musicManager.back({ interaction, discordBot });
    },
};

export default command;
