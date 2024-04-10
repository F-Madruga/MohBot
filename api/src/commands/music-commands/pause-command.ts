import { SlashCommandBuilder } from 'discord.js';
import { Command, CommandHandlerArgs } from '../../types/discord-bot';
import * as musicManager from '../../managers/music-manager';

const command: Command = {
    properties: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pause music currently playing'),

    handler: async ({ interaction, discordBot }: CommandHandlerArgs) => {
        return musicManager.pause({ interaction, discordBot });
    },
};

export default command;
