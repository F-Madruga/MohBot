import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { DiscordBot } from '../discord-bot';

export type Command<CommandParams = undefined> = {
    properties:
        | SlashCommandBuilder
        | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>;
    handler: CommandHandler<CommandParams>;
    validator?: CommandValidator<CommandParams>;
};

export type CommandHandlerArgs<T = undefined> = {
    interaction: CommandInteraction;
    discordBot: DiscordBot;
    args: T;
};

export type CommandHandler<T = undefined> = ({
    interaction,
    discordBot,
    args,
}: CommandHandlerArgs<T>) => Promise<void>;

export type CommandValidatorArgs = {
    interaction: CommandInteraction;
};

export type CommandValidator<T = undefined> = ({
    interaction,
}: CommandValidatorArgs) => T;
