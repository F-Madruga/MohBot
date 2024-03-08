import { Client, CommandInteraction, SlashCommandBuilder } from 'discord.js';

export class Command extends SlashCommandBuilder {
    handler: CommandHandler;
    constructor(handler: CommandHandler) {
        super();
        this.handler = handler;
    }
}

export type CommandHandlerArgs = {
    interaction: CommandInteraction;
    commands: Map<string, Command>;
    client: Client;
};

export type CommandHandler = ({
    interaction,
    commands,
    client,
}: CommandHandlerArgs) => Promise<void>;
