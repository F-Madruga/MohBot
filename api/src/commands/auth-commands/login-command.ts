import { Static, Type } from '@sinclair/typebox';
import {
    Command,
    CommandHandlerArgs,
    CommandValidatorArgs,
} from '../../types/discord-bot';
import { SlashCommandBuilder } from 'discord.js';
import { Value } from '@sinclair/typebox/value';

const LoginOptions = {
    password: 'password',
} as const;

const LoginSchema = Type.Object({
    [LoginOptions.password]: Type.String(),
});

type LoginArgs = Static<typeof LoginSchema>;

const command: Command<LoginArgs> = {
    properties: new SlashCommandBuilder()
        .setName('login')
        .setDescription('Login into your account')
        .addStringOption((option) =>
            option
                .setName(LoginOptions.password)
                .setDescription(
                    'Your account password (only you will see this password)',
                )
                .setRequired(true),
        ),

    validator: ({ interaction }: CommandValidatorArgs) => {
        return Value.Decode(LoginSchema, {
            [LoginOptions.password]: interaction.options.get(
                LoginOptions.password,
            )?.value,
        });
    },

    handler: async ({ interaction }: CommandHandlerArgs<LoginArgs>) => {
        await interaction.followUp({
            content: 'Login command not implmented yet',
            ephemeral: true,
        });
    },
};

export default command;
