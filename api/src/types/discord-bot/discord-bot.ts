import {
    CacheType,
    Client,
    CommandInteraction,
    GatewayIntentBits,
    Interaction,
} from 'discord.js';
import { Command } from './command';
import { Player } from 'discord-player';
import { Logger } from 'pino';
import registerCommands from '../../tools/register-commands';
import {
    AppleMusicExtractor,
    ReverbnationExtractor,
    SoundCloudExtractor,
    SpotifyExtractor,
    VimeoExtractor,
    YoutubeExtractor,
} from '@discord-player/extractor';
import { isServerError } from '../error';
import {
    ERR_COMMAND_NOT_FOUND,
    ERR_INTERACTION_IS_NOT_A_COMMAND,
} from '../../errors';
import { LogLevel } from '../../env';

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
        if (interaction.replied) {
            await interaction.followUp({
                content: publicMessage,
                ephemeral: true,
            });
        } else {
            await interaction.reply({
                content: publicMessage,
                ephemeral: true,
            });
        }
    }
}

export function discordBot({
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

            discordBot.player.events.on('playerStart', async (queue, track) => {
                try {
                    await queue.metadata.channel.send(
                        `Started playing **${track.title}**!`,
                    );
                } catch (error) {
                    await errorHandler({ error, discordBot });
                }
            });

            discordBot.player.events.on(
                'playerError',
                async (queue, _error, track) => {
                    try {
                        await queue.metadata.channel.send(
                            `Something went wrong when trying to play **${track.title}**`,
                        );
                    } catch (error) {
                        await errorHandler({ error, discordBot });
                    }
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
                    }).catch(
                        async (error) =>
                            await errorHandler({
                                interaction: interaction.isCommand()
                                    ? interaction
                                    : undefined,
                                discordBot,
                                error,
                            }),
                    ),
            );

            discordBot.player.events.on(
                'error',
                async (_queue, error: Error) => {
                    discordBot.log.error(
                        `UNEXPECTED ERROR\n${JSON.stringify(error, null, 2)}`,
                    );
                    await errorHandler({ error, discordBot });
                },
            );

            discordBot.client.on('error', async (error: Error) => {
                discordBot.log.error(
                    `UNEXPECTED ERROR\n${JSON.stringify(error, null, 2)}`,
                );
                await errorHandler({ error, discordBot });
            });

            discordBot.client.login(discordBot.config.token);
        },
    };
}
