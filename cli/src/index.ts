#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { initCommand } from './commands/init';
import { addCommand } from './commands/add';
import { setupCommand } from './commands/setup';

const program = new Command();

program
  .name('tdp')
  .description('CLI tool for TDP Design System')
  .version('1.0.0');

program
  .command('init')
  .description('Initialize TDP Design System in your project')
  .option('-y, --yes', 'Skip prompts and use defaults')
  .action(initCommand);

program
  .command('add <component>')
  .description('Add a specific component to your project')
  .option('-o, --overwrite', 'Overwrite existing files')
  .action(addCommand);

program
  .command('setup')
  .description('Setup TDP Design System configuration')
  .option('-f, --force', 'Force overwrite existing config')
  .action(setupCommand);

program.parse(process.argv);

export default program; 