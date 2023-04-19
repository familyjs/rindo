import type { CompilerSystem, Logger } from '../declarations';

export const taskHelp = (sys: CompilerSystem, logger: Logger) => {
  const p = logger.dim(sys.details.platform === 'windows' ? '>' : '$');

  console.log(`
  ${logger.bold('Build:')} ${logger.dim('Build components for development or production.')}

    ${p} ${logger.green('rindo build [--dev] [--watch] [--prerender] [--debug]')}

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

    ${p} ${logger.green('rindo test [--spec] [--e2e]')}

      ${logger.cyan('--spec')} ${logger.dim('............')} Run unit tests with Jest
      ${logger.cyan('--e2e')} ${logger.dim('.............')} Run e2e tests with Puppeteer


  ${logger.bold('Generate:')} ${logger.dim('Bootstrap components.')}

    ${p} ${logger.green('rindo generate')} or ${logger.green('rindo g')}


  ${logger.bold('Examples:')}

    ${p} ${logger.green('rindo build --dev --watch --serve')}
    ${p} ${logger.green('rindo build --prerender')}
    ${p} ${logger.green('rindo test --spec --e2e')}
    ${p} ${logger.green('rindo generate')}
    ${p} ${logger.green('rindo g my-component')}

`);
};
