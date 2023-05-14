// New Programmatic APi
import { expectType } from 'tsd';
import Nightwatch from '..';

const client = Nightwatch.createClient({
  browserName: 'firefox',
  headless: true,
});

expectType<typeof Nightwatch>(client);

const runner = Nightwatch.CliRunner();
expectType<typeof Nightwatch>(runner);

client.updateCapabilities({
  testCapability: 'one, two, three',
});

const browser = async () => {
  await client.launchBrowser();
};

expectType<() => Promise<void>>(browser);
