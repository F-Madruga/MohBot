import { Command } from '../types/command';
import healthcheckCommand from './healthcheck-command';
import listCommandsCommand from './list-commands-command';

export default new Map<string, Command>([
    [healthcheckCommand.name, healthcheckCommand],
    [listCommandsCommand.name, listCommandsCommand],
]);
