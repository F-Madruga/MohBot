import { SlashCommandBuilder } from 'discord.js';
import { Command, CommandHandlerArgs } from '../../types/discord-bot';
import * as musicManager from '../../managers/music-manager';

const command: Command = {
    properties: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Plays next music'),

    handler: async ({ interaction, discordBot }: CommandHandlerArgs) => {
        return musicManager.skip({ interaction, discordBot });
    },
};

export default command;
