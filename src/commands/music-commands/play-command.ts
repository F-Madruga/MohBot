import { SlashCommandBuilder } from 'discord.js';
import {
    Command,
    CommandHandlerArgs,
    CommandValidatorArgs,
} from '../../types/command';
import { Value } from '@sinclair/typebox/value';
import { Type, type Static } from '@sinclair/typebox';

const PlayOptions = {
    query: 'query',
} as const;

const PlayCommandSchema = Type.Object({
    [PlayOptions.query]: Type.String(),
});

type PlayCommandArgs = Static<typeof PlayCommandSchema>;

const command: Command<PlayCommandArgs> = {
    properties: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play music in your voice chat')
        .addStringOption((option) =>
            option
                .setName(PlayOptions.query)
                .setDescription(
                    'Link or name of the music/playlist you want to play',
                )
                .setRequired(true),
        ),

    validator: ({ interaction }: CommandValidatorArgs) => {
        return Value.Decode(PlayCommandSchema, {
            [PlayOptions.query]: interaction.options.get(PlayOptions.query)
                ?.value,
        });
    },

    handler: async ({
        interaction,
        client,
        config,
        // player,
        // args,
    }: CommandHandlerArgs<PlayCommandArgs>) => {
        const guild = await client.guilds.fetch(config.guildId);
        const member = await guild.members.fetch(interaction.user.id);

        const voiceChannel = member.voice.channel;

        if (!voiceChannel) {
            await interaction.reply({
                content: 'You are not in a voice channel',
            });

            return;
        }

        await interaction.deferReply();

        await interaction.reply({ content: 'Work in progress...' });
    },
};

export default command;
