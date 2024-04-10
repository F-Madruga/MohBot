import {
    CacheType,
    Client,
    CommandInteraction,
    GatewayIntentBits,
    Interaction,
} from 'discord.js';
import { Command } from './types/command';
import { Player } from 'discord-player';
import { Logger } from 'pino';
import registerCommands from './tools/register-commands';
import {
    AppleMusicExtractor,
    ReverbnationExtractor,
    SoundCloudExtractor,
    SpotifyExtractor,
    VimeoExtractor,
    YoutubeExtractor,
} from '@discord-player/extractor';
import { isServerError } from './types/error';
import {
    ERR_COMMAND_NOT_FOUND,
    ERR_INTERACTION_IS_NOT_A_COMMAND,
} from './errors';
import { LogLevel } from './env';

export type DiscordBotConfig = {
    token: string;
    clientId: string;
    guildId: string;
};

export type DiscordBot = {
    client: Client;
    config: DiscordBotConfig;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    commands: Map<string, Command<any>>;
    player: Player;
    log: Logger;
};

async function onInteractionCreateListener({
    interaction,
    discordBot,
}: {
    interaction: Interaction<CacheType>;
    discordBot: DiscordBot;
}) {
    {
        if (!interaction.isCommand()) {
            throw new ERR_INTERACTION_IS_NOT_A_COMMAND().withContextualData({
                interaction,
            });
        }

        await interaction.deferReply();

        const command = discordBot.commands.get(interaction.commandName);

        if (!command) {
            throw new ERR_COMMAND_NOT_FOUND()
                .withContextualData({ command: interaction.commandName })
                .withPublicMessage(
                    `Command ${interaction.commandName} does not exist`,
                );
        }

        discordBot.log.info(`Receive command: ${interaction.commandName}`);

        const args = command.validator
            ? command.validator({ interaction })
            : undefined;

        await command.handler({
            interaction,
            discordBot,
            args,
        });

        discordBot.log.info(
            `Successfuly executed command: ${interaction.commandName}`,
        );
    }
}

async function errorHandler({
    interaction,
    discordBot,
    error,
}: {
    interaction?: CommandInteraction;
    discordBot: DiscordBot;
    error: Error;
}) {
    let level = LogLevel.ERROR;
    let publicMessage = 'Something went wrong';

    if (isServerError(error)) {
        level = error.level;

        publicMessage = error.publicMessage || publicMessage;
    }

    discordBot.log[level](error);

    if (interaction) {
        await interaction.followUp({
            content: publicMessage,
        });
    }
}

export default function discordBot({
    config,
    commands,
    log,
    deployCommands,
}: Omit<DiscordBot, 'listen' | 'client' | 'player'> & {
    deployCommands: boolean;
}): DiscordBot & {
    listen: () => Promise<void>;
} {
    const client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.DirectMessages,
            GatewayIntentBits.GuildVoiceStates,
        ],
    });

    const player = new Player(client, {
        ytdlOptions: {
            quality: 'highestaudio',
            highWaterMark: 1 << 25,
        },
        blockStreamFrom: [
            AppleMusicExtractor.identifier,
            VimeoExtractor.identifier,
            SoundCloudExtractor.identifier,
            ReverbnationExtractor.identifier,
        ],
        blockExtractors: [
            AppleMusicExtractor.identifier,
            VimeoExtractor.identifier,
            SoundCloudExtractor.identifier,
            ReverbnationExtractor.identifier,
        ],
    });

    const discordBot = {
        client,
        config,
        commands,
        player,
        log,
    };

    return {
        ...discordBot,
        listen: async () => {
            if (deployCommands) {
                await registerCommands(
                    Array.from(commands.values()),
                    discordBot.config.token,
                    discordBot.config.clientId,
                );
            }

            // TODO spotify extractor sometimes doesn't find music
            await Promise.all([
                player.extractors.register(YoutubeExtractor, {}),
                player.extractors.register(SpotifyExtractor, {}),
            ]);

            discordBot.player.events.on('playerStart', (queue, track) => {
                queue.metadata.channel.send(
                    `Started playing **${track.title}**!`,
                );
            });

            discordBot.player.events.on(
                'playerError',
                (queue, _error, track) => {
                    queue.metadata.channel.send(
                        `Something went wrong when trying to play **${track.title}**`,
                    );
                },
            );

            discordBot.client.on('ready', () => {
                discordBot.log.info('Successfully started discord bot');
            });

            discordBot.client.on(
                'interactionCreate',
                async (interaction) =>
                    await onInteractionCreateListener({
                        interaction,
                        discordBot,
                    }).catch((error) =>
                        errorHandler({
                            interaction: interaction.isCommand()
                                ? interaction
                                : undefined,
                            discordBot,
                            error,
                        }),
                    ),
            );

            discordBot.player.events.on('error', (_queue, error: Error) => {
                discordBot.log.error(
                    `UNEXPECTED ERROR\n${JSON.stringify(error, null, 2)}`,
                );
            });

            discordBot.client.on('error', (error: Error) => {
                discordBot.log.error(
                    `UNEXPECTED ERROR\n${JSON.stringify(error, null, 2)}`,
                );
            });

            discordBot.client.login(discordBot.config.token);
        },
    };
}
