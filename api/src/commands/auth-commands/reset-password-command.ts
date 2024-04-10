import { Static, Type } from '@sinclair/typebox';
import {
    Command,
    CommandHandlerArgs,
    CommandValidatorArgs,
} from '../../types/command';
import { SlashCommandBuilder } from 'discord.js';
import { Value } from '@sinclair/typebox/value';
import * as userManager from '../../managers/user-manager';

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
        const user = await userManager.updateOne({
            id: interaction.user.id,
            username: interaction.user.username,
            password: args.password,
        });

        if (!user) {
            await interaction.followUp({
                content: 'User does not exist',
                ephemeral: true,
            });

            return;
        }

        await interaction.followUp({
            content: 'Account updated',
            ephemeral: true,
        });
    },
};

export default command;
