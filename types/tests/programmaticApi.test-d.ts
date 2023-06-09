// New Programmatic APi
import { expectType, expectError, expectAssignable } from 'tsd';
import Nightwatch, { NightwatchAPI, NightwatchClient, NightwatchProgrammaticAPIClient } from '..';

const client = Nightwatch.createClient({
  browserName: 'firefox',
  headless: true,
});
Nightwatch.createClient();
Nightwatch.createClient({});

expectType<NightwatchProgrammaticAPIClient>(client);

// test methods/properties exported on Nightwatch
new Nightwatch.by('css selector', 'hello');
new Nightwatch.Capabilities();
expectType<NightwatchAPI>(Nightwatch.browser);
expectType<NightwatchAPI>(Nightwatch.app);
expectAssignable<string>(Nightwatch.Key.NULL);
expectError(Nightwatch.launchBrowser());
// @ts-expect-error
Nightwatch.updateCapabilities({});

// test internal methods exported on Nightwatch
const initClient = Nightwatch.initClient();
expectType<typeof Nightwatch>(initClient);

// test Nightwatch Programmatic API
client.updateCapabilities({
  testCapability: 'one, two, three',
});
client.updateCapabilities(function() { return {}; });

async () => {
  const browser = await client.launchBrowser();
  expectType<NightwatchAPI>(browser);

  expectType<NightwatchClient>(client.nightwatch_client);
};
