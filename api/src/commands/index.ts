import { Command } from '../types/command';
import healthcheckCommand from './healthcheck-command';
import listCommandsCommand from './list-commands-command';
import helpCommand from './help-command';
import playCommand from './music-commands/play-command';
import pauseCommand from './music-commands/pause-command';
import stopCommand from './music-commands/stop-command';
import resumeCommand from './music-commands/resume-command';
import skipCommand from './music-commands/skip-command';
import backCommand from './music-commands/back-command';
import listMusicCommand from './music-commands/list-musics-command';

export default new Map<string, Command<any>>([
    [healthcheckCommand.properties.name, healthcheckCommand],
    [listCommandsCommand.properties.name, listCommandsCommand],
    [helpCommand.properties.name, helpCommand],
    [playCommand.properties.name, playCommand],
    [stopCommand.properties.name, stopCommand],
    [pauseCommand.properties.name, pauseCommand],
    [resumeCommand.properties.name, resumeCommand],
    [skipCommand.properties.name, skipCommand],
    [backCommand.properties.name, backCommand],
    [listMusicCommand.properties.name, listMusicCommand],
]);
