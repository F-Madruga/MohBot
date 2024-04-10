import { SlashCommandBuilder } from 'discord.js';
import {
    Command,
    CommandHandlerArgs,
    CommandValidatorArgs,
} from '../types/discord-bot';
import { Value } from '@sinclair/typebox/value';
import { Type, type Static } from '@sinclair/typebox';

const HelpOptions = {
    commandName: 'command',
} as const;

const HelpCommandSchema = Type.Object({
    [HelpOptions.commandName]: Type.String(),
});

type HelpCommandArgs = Static<typeof HelpCommandSchema>;

const command: Command<HelpCommandArgs> = {
    properties: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Describes what a command does')
        .addStringOption((option) =>
            option
                .setName(HelpOptions.commandName)
                .setDescription('The command you want help')
                .setRequired(true),
        ),

    validator: ({ interaction }: CommandValidatorArgs) => {
        const helpOptions = Value.Decode(HelpCommandSchema, {
            [HelpOptions.commandName]: interaction.options.get(
                HelpOptions.commandName,
            )?.value,
        });

        return helpOptions;
    },

    handler: async ({
        interaction,
        discordBot,
        args,
    }: CommandHandlerArgs<HelpCommandArgs>) => {
        const { command } = args;

        const requestedCommand = discordBot.commands.get(command);

        if (!requestedCommand) {
            await interaction.followUp({
                content: `Cannot find command: ${command}`,
            });

            return;
        }

        let optionsString = '';

        for (const option of requestedCommand.properties.options) {
            const optionJson = option.toJSON();
            optionsString += `- \`${optionJson.name}\`: ${optionJson.description}\n`;
        }

        await interaction.followUp({
            content: `**${requestedCommand.properties.name}**\n${requestedCommand.properties.description}\n${optionsString}`,
        });
    },
};

export default command;
