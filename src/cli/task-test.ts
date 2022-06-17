import type { InternalStrictConfig, TestingRunOptions } from '../declarations';
import { IS_NODE_ENV } from '../compiler/sys/environment';

/**
 * Initiates running tests against a Stencil project
 * @param config the Stencil configuration to use while running tests
 */
export const taskTest = async (config: InternalStrictConfig): Promise<void> => {
  // TODO(NOW): Remove this once we have a better sense of config validation
  config.testing = config.testing ?? {};
  if (!config.sys?.lazyRequire) {
    throw new Error('sys was not defined');
  }
  if (!config.rootDir) {
    return config.sys.exit(1);
  }
  if (!config.logger) {
    return config.sys.exit(1);
  }
  //////////////////////////////////////////////////////////////////////////

  if (!IS_NODE_ENV) {
    config.logger.error(`"test" command is currently only implemented for a NodeJS environment`);
    return config.sys.exit(1);
  }

  config.buildDocs = false;
  const testingRunOpts: TestingRunOptions = {
    e2e: !!config.flags.e2e,
    screenshot: !!config.flags.screenshot,
    spec: !!config.flags.spec,
    updateScreenshot: !!config.flags.updateScreenshot,
  };

  // always ensure we have jest modules installed
  const ensureModuleIds = ['@types/jest', 'jest', 'jest-cli'];

  if (testingRunOpts.e2e) {
    // if it's an e2e test, also make sure we're got
    // puppeteer modules installed and if browserExecutablePath is provided don't download Chromium use only puppeteer-core instead
    const puppeteer = config.testing.browserExecutablePath ? 'puppeteer-core' : 'puppeteer';

    ensureModuleIds.push(puppeteer);

    if (testingRunOpts.screenshot) {
      // ensure we've got pixelmatch for screenshots
      config.logger.warn(
        config.logger.yellow(
          `EXPERIMENTAL: screenshot visual diff testing is currently under heavy development and has not reached a stable status. However, any assistance testing would be appreciated.`
        )
      );
    }
  }

  // ensure we've got the required modules installed
  const diagnostics = await config.sys.lazyRequire.ensure(config.rootDir, ensureModuleIds);
  if (diagnostics.length > 0) {
    config.logger.printDiagnostics(diagnostics);
    return config.sys.exit(1);
  }

  try {
    // let's test!
    const { createTesting } = await import('@stencil/core/testing');
    const testing = await createTesting(config);
    const passed = await testing.run(testingRunOpts);
    await testing.destroy();

    if (!passed) {
      return config.sys.exit(1);
    }
  } catch (e) {
    config.logger.error(e);
    return config.sys.exit(1);
  }
};
