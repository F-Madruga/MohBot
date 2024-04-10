import { SlashCommandBuilder } from 'discord.js';
import { Command, CommandHandlerArgs } from '../../types/discord-bot';
import * as musicManager from '../../managers/music-manager';

const command: Command = {
    properties: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stops music currently playing'),

    handler: async ({ interaction, discordBot }: CommandHandlerArgs) => {
        return musicManager.stop({ interaction, discordBot });
    },
};

export default command;
