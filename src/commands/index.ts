import { Command } from '../types/command';
import healthcheckCommand from './healthcheck-command';

export default new Map<string, Command>([
    [healthcheckCommand.name, healthcheckCommand],
]);
