import { SlashCommandBuilder } from 'discord.js';
import {
    Command,
    CommandHandlerArgs,
    CommandValidatorArgs,
} from '../../types/command';
import { Value } from '@sinclair/typebox/value';
import { Type, type Static } from '@sinclair/typebox';
import * as musicManager from '../../managers/music-manager';

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
        .setDescription(
            'Play music in your voice chat - available source: YouTube, Spotify, SoundCloud and Apple Music',
        )
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
        player,
        args,
    }: CommandHandlerArgs<PlayCommandArgs>) => {
        return musicManager.play({
            interaction,
            client,
            config,
            player,
            query: args.query,
        });
    },
};

export default command;
