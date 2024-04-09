import { useHistory, useQueue } from 'discord-player';
import { CommandHandlerArgs } from '../types/command';

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

    await interaction.deferReply();

    await interaction.followUp(`Loading **${query}**...`);

    try {
        const { track } = await discordBot.player.play(voiceChannel, query, {
            nodeOptions: {
                metadata: interaction,
            },
            // fallbackSearchEngine: 'youtube',
        });

        // ERR_NO_RESULT

        discordBot.log.info(track.extractor?.identifier);

        await interaction.followUp(`**${track.title}** enqueued!`);
    } catch (error) {
        await interaction.followUp(`Something went wrong: ${error}`);
    }
}

interface StopArgs extends Omit<CommandHandlerArgs, 'args'> {}

export async function stop({ interaction, discordBot }: StopArgs) {
    await interaction.deferReply();

    const queue = useQueue(discordBot.config.guildId);

    if (!queue) {
        await interaction.followUp('Currently there is no queue');

        return;
    }

    queue.delete();

    await interaction.followUp('Music stopped');
}

interface PauseArgs extends Omit<CommandHandlerArgs, 'args'> {}

export async function pause({ interaction, discordBot }: PauseArgs) {
    await interaction.deferReply();

    const queue = useQueue(discordBot.config.guildId);

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

interface ResumeArgs extends Omit<CommandHandlerArgs, 'args'> {}

export async function resume({ interaction, discordBot }: ResumeArgs) {
    await interaction.deferReply();

    const queue = useQueue(discordBot.config.guildId);

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

interface SkipArgs extends Omit<CommandHandlerArgs, 'args'> {}

export async function skip({ interaction, discordBot }: SkipArgs) {
    await interaction.deferReply();

    const queue = useQueue(discordBot.config.guildId);

    if (!queue) {
        await interaction.followUp('Currently there is no queue');

        return;
    }

    queue.node.skip();

    await interaction.followUp('Playing next music');
}

interface BackArgs extends Omit<CommandHandlerArgs, 'args'> {}

export async function back({ interaction, discordBot }: BackArgs) {
    await interaction.deferReply();

    const history = useHistory(discordBot.config.guildId);

    if (!history) {
        await interaction.followUp('There is no previous music');

        return;
    }

    history.previous();

    await interaction.followUp('Playing previous music');
}

interface ListQueueArgs extends Omit<CommandHandlerArgs, 'args'> {}

export async function listQueue({ interaction, discordBot }: ListQueueArgs) {
    await interaction.deferReply();
    const queue = useQueue(discordBot.config.guildId);

    if (!queue) {
        await interaction.followUp('Currently there is no queue');

        return;
    }

    const history = useHistory(discordBot.config.guildId);

    if (!history) {
        await interaction.followUp('There is no previous music');

        return;
    }

    const currentTrack = queue.currentTrack;
    const previousTracks = history.tracks.toArray();
    const tracks = queue.tracks.toArray();

    let result = '';

    for (const track of previousTracks) {
        result += `${track.title}\n`;
    }

    if (currentTrack) {
        result += `**-> ${currentTrack.title}**\n`;
    }

    for (const track of tracks) {
        result += `${track.title}\n`;
    }

    await interaction.followUp(result);
}
