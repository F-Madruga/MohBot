import { useHistory, useQueue } from 'discord-player';
import { CommandHandlerArgs } from '../types/command';

interface PlayArgs
    extends Pick<
        CommandHandlerArgs,
        'interaction' | 'player' | 'client' | 'config'
    > {
    query: string;
}

export async function play({
    interaction,
    player,
    client,
    config,
    query,
}: PlayArgs) {
    const guild = await client.guilds.fetch(config.guildId);
    const member = await guild.members.fetch(interaction.user.id);

    const voiceChannel = member.voice.channel;

    if (!voiceChannel) {
        await interaction.reply({
            content: 'You are not in a voice channel',
        });

        return;
    }

    await interaction.deferReply();

    try {
        const { track } = await player.play(voiceChannel, query, {
            nodeOptions: {
                metadata: interaction,
            },
        });

        await interaction.followUp(`**${track.title}** enqueued!`);
    } catch (error) {
        await interaction.followUp(`Something went wrong: ${error}`);
    }
}

interface StopArgs extends Pick<CommandHandlerArgs, 'interaction' | 'config'> {}

export async function stop({ interaction, config }: StopArgs) {
    await interaction.deferReply();

    const queue = useQueue(config.guildId);

    if (!queue) {
        await interaction.followUp('Currently there is no queue');

        return;
    }

    queue.delete();

    await interaction.followUp('Music stopped');
}

interface PauseArgs
    extends Pick<CommandHandlerArgs, 'interaction' | 'config'> {}

export async function pause({ interaction, config }: PauseArgs) {
    await interaction.deferReply();

    const queue = useQueue(config.guildId);

    if (!queue) {
        await interaction.followUp('Currently there is no queue');

        return;
    }

    if (queue.node.isPaused()) {
        await interaction.followUp('Music is already paused');

        return;
    }

    queue.node.setPaused(true);

    await interaction.followUp('Music paused');
}

interface ResumeArgs
    extends Pick<CommandHandlerArgs, 'interaction' | 'config'> {}

export async function resume({ interaction, config }: ResumeArgs) {
    await interaction.deferReply();

    const queue = useQueue(config.guildId);

    if (!queue) {
        await interaction.followUp('Currently there is no queue');

        return;
    }

    if (!queue.node.isPaused()) {
        await interaction.followUp('Music is already playing');

        return;
    }

    queue.node.setPaused(false);

    await interaction.followUp('Music resumed');
}

interface SkipArgs extends Pick<CommandHandlerArgs, 'interaction' | 'config'> {}

export async function skip({ interaction, config }: SkipArgs) {
    await interaction.deferReply();

    const queue = useQueue(config.guildId);

    if (!queue) {
        await interaction.followUp('Currently there is no queue');

        return;
    }

    queue.node.skip();

    await interaction.followUp('Playing next music');
}

interface BackArgs extends Pick<CommandHandlerArgs, 'interaction' | 'config'> {}

export async function back({ interaction, config }: BackArgs) {
    await interaction.deferReply();

    const history = useHistory(config.guildId);

    if (!history) {
        await interaction.followUp('There is no previous music');

        return;
    }

    history.previous();

    await interaction.followUp('Playing previous music');
}

interface ListQueueArgs
    extends Pick<CommandHandlerArgs, 'interaction' | 'config'> {}

export async function listQueue({ interaction, config }: ListQueueArgs) {
    await interaction.deferReply();
    const queue = useQueue(config.guildId);

    if (!queue) {
        await interaction.followUp('Currently there is no queue');

        return;
    }

    const history = useHistory(config.guildId);

    if (!history) {
        await interaction.followUp('There is no previous music');

        return;
    }

    const currentTrack = queue.currentTrack;
    const previousTracks = history.tracks.toArray();
    const tracks = queue.tracks.toArray();

    let result = '';

    for (let track of previousTracks) {
        result += `${track.title}\n`;
    }

    if (currentTrack) {
        result += `**-> ${currentTrack.title}**\n`;
    }

    for (let track of tracks) {
        result += `${track.title}\n`;
    }

    await interaction.followUp(result);
}
