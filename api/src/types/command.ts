import { Player } from 'discord-player';
import { Client, CommandInteraction, SlashCommandOptionsOnlyBuilder } from 'discord.js';
import { DiscordBotConfig } from './discord-bot';

export type Command<CommandParams = undefined> = {
    properties: SlashCommandOptionsOnlyBuilder;
    handler: CommandHandler<CommandParams>;
    validator?: CommandValidator<CommandParams>;
};

export type CommandHandlerArgs<T = undefined> = {
    interaction: CommandInteraction;
    commands: Map<string, Command<any>>;
    client: Client;
    config: DiscordBotConfig;
    player: Player;
    args: T;
};

export type CommandHandler<T = undefined> = ({
    interaction,
    commands,
    client,
    config,
    player,
    args,
}: CommandHandlerArgs<T>) => Promise<void>;

export type CommandValidatorArgs = {
    interaction: CommandInteraction;
    commands: Map<string, Command<any>>;
};

export type CommandValidator<T = undefined> = ({
    interaction,
    commands,
}: CommandValidatorArgs) => T;
