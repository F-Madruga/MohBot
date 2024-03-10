import { Player } from 'discord-player';
import { Client, CommandInteraction, SlashCommandBuilder } from 'discord.js';

export type Command<CommandParams = undefined> = {
    properties:
        | SlashCommandBuilder
        | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>;
    handler: CommandHandler<CommandParams>;
    validator?: CommandValidator<CommandParams>;
};

export type CommandHandlerArgs<T = undefined> = {
    interaction: CommandInteraction;
    commands: Map<string, Command>;
    client: Client;
    player: Player;
    args: T;
};

export type CommandHandler<T = undefined> = ({
    interaction,
    commands,
    client,
    player,
    args,
}: CommandHandlerArgs<T>) => Promise<void>;

export type CommandValidatorArgs = {
    interaction: CommandInteraction;
};

export type CommandValidator<T = undefined> = ({
    interaction,
}: CommandValidatorArgs) => T;
