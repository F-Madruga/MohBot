import { Player } from 'discord-player';
import { Client, CommandInteraction, SlashCommandBuilder } from 'discord.js';

export type Command = {
    properties:
        | SlashCommandBuilder
        | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>;
    handler: CommandHandler;
};

export type CommandHandlerArgs = {
    interaction: CommandInteraction;
    commands: Map<string, Command>;
    client: Client;
    player: Player;
};

export type CommandHandler = ({
    interaction,
    commands,
    client,
    player,
}: CommandHandlerArgs) => Promise<void>;
