import { Command, CommandHandlerArgs } from '../types/command';

export default new Command(handler)
    .setName('healthcheck')
    .setDescription('Replies ok if the bot is healthy');

async function handler({ interaction }: CommandHandlerArgs): Promise<void> {
    await interaction.reply({ content: 'ok' });
}
