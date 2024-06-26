import type * as d from '../declarations';
import { ConfigFlags } from './config-flags';
import { taskTelemetry } from './task-telemetry';

/**
 * Entrypoint for the Help task, providing Rindo usage context to the user
 * @param flags configuration flags provided to Rindo when a task was call (either this task or a task that invokes
 * telemetry)
 * @param logger a logging implementation to log the results out to the user
 * @param sys the abstraction for interfacing with the operating system
 */
export const taskHelp = async (flags: ConfigFlags, logger: d.Logger, sys: d.CompilerSystem): Promise<void> => {
  const prompt = logger.dim(sys.details?.platform === 'windows' ? '>' : '$');

  console.log(`
  ${logger.bold('Build:')} ${logger.dim('Build components for development or production.')}

    ${prompt} ${logger.green('rindo build [--dev] [--watch] [--prerender] [--debug]')}

      ${logger.cyan('--dev')} ${logger.dim('.............')} Development build
      ${logger.cyan('--watch')} ${logger.dim('...........')} Rebuild when files update
      ${logger.cyan('--serve')} ${logger.dim('...........')} Start the dev-server
      ${logger.cyan('--prerender')} ${logger.dim('.......')} Prerender the application
      ${logger.cyan('--docs')} ${logger.dim('............')} Generate component readme.md docs
      ${logger.cyan('--config')} ${logger.dim('..........')} Set rindo config file
      ${logger.cyan('--stats')} ${logger.dim('...........')} Write rindo-stats.json file
      ${logger.cyan('--log')} ${logger.dim('.............')} Write rindo-build.log file
      ${logger.cyan('--debug')} ${logger.dim('...........')} Set the log level to debug


  ${logger.bold('Test:')} ${logger.dim('Run unit and end-to-end tests.')}

    ${prompt} ${logger.green('rindo test [--spec] [--e2e]')}

      ${logger.cyan('--spec')} ${logger.dim('............')} Run unit tests with Jest
      ${logger.cyan('--e2e')} ${logger.dim('.............')} Run e2e tests with Puppeteer


  ${logger.bold('Generate:')} ${logger.dim('Bootstrap components.')}

    ${prompt} ${logger.green('rindo generate')} or ${logger.green('rindo g')}

`);

  await taskTelemetry(flags, sys, logger);

  console.log(`
  ${logger.bold('Examples:')}

  ${prompt} ${logger.green('rindo build --dev --watch --serve')}
  ${prompt} ${logger.green('rindo build --prerender')}
  ${prompt} ${logger.green('rindo test --spec --e2e')}
  ${prompt} ${logger.green('rindo telemetry on')}
  ${prompt} ${logger.green('rindo generate')}
  ${prompt} ${logger.green('rindo g my-component')}
`);
};
