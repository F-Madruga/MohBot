import { Command } from '../types/command';
import healthcheckCommand from './healthcheck-command';
import listCommandsCommand from './list-commands-command';
import playCommand from './music-commands/play-command';

export default new Map<string, Command>([
    [healthcheckCommand.properties.name, healthcheckCommand],
    [listCommandsCommand.properties.name, listCommandsCommand],
    [playCommand.properties.name, playCommand],
]);
