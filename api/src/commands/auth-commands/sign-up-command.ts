import { Static, Type } from '@sinclair/typebox';
import {
    Command,
    CommandHandlerArgs,
    CommandValidatorArgs,
} from '../../types/discord-bot';
import { SlashCommandBuilder } from 'discord.js';
import { Value } from '@sinclair/typebox/value';
import * as userManager from '../../managers/user-manager';

const SignUpOptions = {
    password: 'password',
} as const;

const SignUpCommandSchema = Type.Object({
    [SignUpOptions.password]: Type.String({ minLength: 3 }),
});

type SignUpCommandArgs = Static<typeof SignUpCommandSchema>;

const command: Command<SignUpCommandArgs> = {
    properties: new SlashCommandBuilder()
        .setName('signup')
        .setDescription('Create an account')
        .addStringOption((option) =>
            option
                .setName(SignUpOptions.password)
                .setDescription(
                    'Your password (only you will see this password)',
                )
                .setRequired(true),
        ),

    validator: ({ interaction }: CommandValidatorArgs) => {
        return Value.Decode(SignUpCommandSchema, {
            [SignUpOptions.password]: interaction.options.get(
                SignUpOptions.password,
            )?.value,
        });
    },

    handler: async ({
        interaction,
        args,
    }: CommandHandlerArgs<SignUpCommandArgs>) => {
        const user = await userManager.createOne({
            id: interaction.user.id,
            username: interaction.user.username,
            password: args.password,
        });

        if (!user) {
            await interaction.followUp({
                content:
                    'Account already exist. If you forgot your password ou can reset it',
                ephemeral: true,
            });

            return;
        }

        await interaction.followUp({
            content: 'Account created',
            ephemeral: true,
        });
    },
};

export default command;
