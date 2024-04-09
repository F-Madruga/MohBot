import { CacheType, Client, GatewayIntentBits, Interaction } from 'discord.js';
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

export type DiscordBotConfig = {
    token: string;
    clientId: string;
    guildId: string;
};

export type DiscordBot = {
    client: Client;
    config: DiscordBotConfig;
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
            return;
        }

        const command = discordBot.commands.get(interaction.commandName);

        if (!command) {
            discordBot.log.info(
                `Command ${interaction.commandName} does not exist`,
            );

            await interaction.reply({
                content: `Command ${interaction.commandName} does not exist`,
            });

            return;
        }

        discordBot.log.info(`Receive command: ${interaction.commandName}`);

        let args;

        try {
            args = command.validator
                ? command.validator({ interaction })
                : undefined;
        } catch (error) {
            discordBot.log.error(error);

            await interaction.reply({
                content: 'Wrong input data',
            });

            return;
        }

        try {
            await command.handler({
                interaction,
                discordBot,
                args,
            });
        } catch (error) {
            discordBot.log.error(error);

            await interaction.reply({
                content: 'Something went wrong',
            });

            return;
        }

        discordBot.log.info(
            `Successfuly executed command: ${interaction.commandName}`,
        );
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
                    }),
            );

            discordBot.client.login(discordBot.config.token);
        },
    };
}
