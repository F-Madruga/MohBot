import { Static, Type } from '@sinclair/typebox';
import {
    Command,
    CommandHandlerArgs,
    CommandValidatorArgs,
} from '../../types/command';
import { SlashCommandBuilder } from 'discord.js';
import { Value } from '@sinclair/typebox/value';

const SignUpOptions = {
    password: 'password',
} as const;

const SignUpCommandSchema = Type.Object({
    [SignUpOptions.password]: Type.String(),
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
        await interaction.reply({ content: `${args.password}` });
    },
};

export default command;
