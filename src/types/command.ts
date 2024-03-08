import { CommandInteraction, SlashCommandBuilder } from 'discord.js';

export class Command extends SlashCommandBuilder {
    handler: CommandHandler;
    constructor(handler: CommandHandler) {
        super();
        this.handler = handler;
    }
}

export type CommandHandlerArgs = {
    interaction: CommandInteraction;
};

export type CommandHandler = ({
    interaction,
}: CommandHandlerArgs) => Promise<void>;
