import { Command } from '../types/command';
import healthcheckCommand from './healthcheck-command';
import listCommandsCommand from './list-commands-command';
import helpCommand from './help-command';
import playCommand from './music-commands/play-command';

export default new Map<string, Command<any>>([
    [healthcheckCommand.properties.name, healthcheckCommand],
    [listCommandsCommand.properties.name, listCommandsCommand],
    [helpCommand.properties.name, helpCommand],
    [playCommand.properties.name, playCommand],
]);
