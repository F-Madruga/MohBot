import { Command, CommandHandlerArgs } from '../types/command';

export default new Command(handler)
    .setName('listcommands')
    .setDescription('List all available commands');

async function handler({
    interaction,
    commands,
}: CommandHandlerArgs): Promise<void> {
    let result = '';

    for (let command of commands.values()) {
        result += `**${command.name}**: ${command.description}\n`;
    }

    await interaction.reply({ content: result });
}
