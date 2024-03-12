import { Client, GatewayIntentBits } from 'discord.js';
import commands from './commands';
import env, { NodeEnv } from './env';
import logger from './tools/logger';
import registerCommands from './tools/register-commands';
import { Player } from 'discord-player';

async function main() {
    if (env.NODE_ENV === NodeEnv.PROD) {
        await registerCommands(
            Array.from(commands.values()),
            env.DISCORD_TOKEN,
            env.DISCORD_CLIENT_ID,
        );
    }

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
    });

    await player.extractors.loadDefault(
        (extractor) =>
            extractor !== 'AppleMusicExtractor' &&
            extractor !== 'AttachmentExtractor' &&
            extractor !== 'ReverbnationExtractor' &&
            extractor !== 'VimeoExtractor',
    );

    player.events.on('playerStart', (queue, track) => {
        queue.metadata.channel.send(`Started playing **${track.title}**!`);
    });

    client.on('ready', () => {
        logger.info('Successfully started discord bot');
    });

    client.on('interactionCreate', async (interaction) => {
        if (!interaction.isCommand()) {
            return;
        }

        const command = commands.get(interaction.commandName);

        if (!command) {
            logger.info(`Command ${interaction.commandName} does not exist`);

            await interaction.reply({
                content: `Command ${interaction.commandName} does not exist`,
            });

            return;
        }

        logger.info(`Receive command: ${interaction.commandName}`);

        let args;

        try {
            args = command.validator
                ? command.validator({ interaction, commands })
                : undefined;
        } catch (error) {
            logger.error(error);

            await interaction.reply({ content: 'Wrong input data' });

            return;
        }

        try {
            await command.handler({
                interaction,
                commands,
                client,
                config: {
                    token: env.DISCORD_TOKEN,
                    clientId: env.DISCORD_CLIENT_ID,
                    guildId: env.DISCORD_GUILD_ID,
                },
                player,
                args,
            });
        } catch (error) {
            logger.error(error);

            await interaction.reply({ content: 'Something went wrong' });

            return;
        }

        logger.info(`Successfuly executed command: ${interaction.commandName}`);
    });

    client.login(env.DISCORD_TOKEN);
}

main().catch((error) => {
    logger.error(error);
});
