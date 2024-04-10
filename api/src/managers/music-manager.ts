import { useHistory, useQueue } from 'discord-player';
import { CommandHandlerArgs } from '../types/discord-bot';

interface PlayArgs extends Omit<CommandHandlerArgs, 'args'> {
    query: string;
}

export async function play({ interaction, discordBot, query }: PlayArgs) {
    const guild = await discordBot.client.guilds.fetch(
        discordBot.config.guildId,
    );
    const member = await guild.members.fetch(interaction.user.id);

    const voiceChannel = member.voice.channel;

    if (!voiceChannel) {
        await interaction.reply({
            content: 'You are not in a voice channel',
        });

        return;
    }

    await interaction.reply(`Adding **${query}** to queue...`);

    try {
        const { track } = await discordBot.player.play(voiceChannel, query, {
            nodeOptions: {
                metadata: interaction,
            },
        });

        discordBot.log.info(track.extractor?.identifier);

        await interaction.followUp(`**${track.title}** enqueued!`);
    } catch (error) {
        await interaction.followUp(`Something went wrong: ${error}`);
    }
}

interface StopArgs extends Omit<CommandHandlerArgs, 'args'> {}

export async function stop({ interaction, discordBot }: StopArgs) {
    const queue = useQueue(discordBot.config.guildId);

    if (!queue) {
        await interaction.reply('Currently there is no queue');

        return;
    }

    queue.delete();

    await interaction.reply('Music stopped');
}

interface PauseArgs extends Omit<CommandHandlerArgs, 'args'> {}

export async function pause({ interaction, discordBot }: PauseArgs) {
    const queue = useQueue(discordBot.config.guildId);

    if (!queue) {
        await interaction.reply('Currently there is no queue');

        return;
    }

    if (queue.node.isPaused()) {
        await interaction.reply('Music is already paused');

        return;
    }

    queue.node.setPaused(true);

    await interaction.reply('Music paused');
}

interface ResumeArgs extends Omit<CommandHandlerArgs, 'args'> {}

export async function resume({ interaction, discordBot }: ResumeArgs) {
    const queue = useQueue(discordBot.config.guildId);

    if (!queue) {
        await interaction.reply('Currently there is no queue');

        return;
    }

    if (!queue.node.isPaused()) {
        await interaction.reply('Music is already playing');

        return;
    }

    queue.node.setPaused(false);

    await interaction.reply('Music resumed');
}

interface SkipArgs extends Omit<CommandHandlerArgs, 'args'> {}

export async function skip({ interaction, discordBot }: SkipArgs) {
    const queue = useQueue(discordBot.config.guildId);

    if (!queue) {
        await interaction.reply('Currently there is no queue');

        return;
    }

    queue.node.skip();

    await interaction.reply('Playing next music');
}

interface BackArgs extends Omit<CommandHandlerArgs, 'args'> {}

export async function back({ interaction, discordBot }: BackArgs) {
    const history = useHistory(discordBot.config.guildId);

    if (!history) {
        await interaction.reply('There is no previous music');

        return;
    }

    history.previous();

    await interaction.reply('Playing previous music');
}

interface ListQueueArgs extends Omit<CommandHandlerArgs, 'args'> {}

export async function listQueue({ interaction, discordBot }: ListQueueArgs) {
    const queue = useQueue(discordBot.config.guildId);

    if (!queue) {
        await interaction.reply('Currently there is no queue');

        return;
    }

    const history = useHistory(discordBot.config.guildId);

    let result = '';

    if (history) {
        const previousTracks = history.tracks.toArray();

        for (const track of previousTracks) {
            result += `${track.title}\n`;
        }
    }

    const currentTrack = queue.currentTrack;
    const tracks = queue.tracks.toArray();

    if (currentTrack) {
        result += `**-> ${currentTrack.title}**\n`;
    }

    for (const track of tracks) {
        result += `${track.title}\n`;
    }

    await interaction.reply(result);
}
