# MohBot

made among friends for friends

## Made with:

- TypeScript
- Discord.js

## Contributors

**Francisco Madruga** <br>
[`LinkedIn Profile`](https://www.linkedin.com/in/francisco-madruga-0694971b4)
<br> [`GitHub Profile`](https://github.com/F-Madruga) <br>

**Pedro Nogueira** <br>
[`LinkedIn Profile`](https://www.linkedin.com/in/pedroinogueira/) <br>
[`GitHub Profile`](https://github.com/Pedro-No) <br>

## Guide

### 1 - Install dependencies

#### 1.1 - Make sure you're using the correct node version

```shell
nvm use
```

#### 1.2 - Install dependencies

```shell
npm i
```

### 2 - Set enviromment variables (required)

Create a `.env` file with the following format in the root of the repo:

```
NODE_ENV=
LOGGER_LEVEL=
DISCORD_TOKEN=
DISCORD_CLIENT_ID=
DISCORD_GUILD_ID=
```

- `NODE_ENV`allowed values: `prod` (recommended), `dev` or `test`
- `LOGGER_LEVEL`allowed values: `info` (recommended), `error`, `warn`, `debug`,
  `fatal` or `trace`

Usefull link to setup the discord bot:

- https://youtu.be/4IxLBKPVyXE?t=695
- Applications settings: https://discord.com/developers/applications
- Add bot to server (replace `CLIENT_ID` and `GUILD_ID` in the link by the
  actual value):
  https://discord.com/oauth2/authorize?client_id=CLIENT_ID&scope=bot&guild_id=GUILD_ID$permissions=8

### 3 - Build MohBot

```shell
npm run build
```

### 4 - Start MohBot

```shell
npm start
```
