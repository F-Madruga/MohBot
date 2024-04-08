import { Static, Type } from '@sinclair/typebox';
import {
    Command,
    CommandHandlerArgs,
    CommandValidatorArgs,
} from '../../types/command';
import { SlashCommandBuilder } from 'discord.js';
import { Value } from '@sinclair/typebox/value';

const ResetPasswordOptions = {
    password: 'password',
} as const;

const ResetPasswordSchema = Type.Object({
    [ResetPasswordOptions.password]: Type.String(),
});

type ResetPasswordArgs = Static<typeof ResetPasswordSchema>;

const command: Command<ResetPasswordArgs> = {
    properties: new SlashCommandBuilder()
        .setName('resetpassword')
        .setDescription('Reset account password')
        .addStringOption((option) =>
            option
                .setName(ResetPasswordOptions.password)
                .setDescription(
                    'Your new password (only you will see this password)',
                )
                .setRequired(true),
        ),

    validator: ({ interaction }: CommandValidatorArgs) => {
        return Value.Decode(ResetPasswordSchema, {
            [ResetPasswordOptions.password]: interaction.options.get(
                ResetPasswordOptions.password,
            )?.value,
        });
    },

    handler: async ({
        interaction,
        args,
    }: CommandHandlerArgs<ResetPasswordArgs>) => {
        await interaction.reply({
            content: `${args.password}`,
            ephemeral: true,
        });
    },
};

export default command;
