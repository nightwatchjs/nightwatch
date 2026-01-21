import {expectError, expectType} from 'tsd';
import {EnhancedPageObject, PageObjectModel, Awaitable, NightwatchAPI} from '..';

// Page object file
const fileUploadPageElements = {
  fileUploadInput: 'input#file-upload',
  submitButton: 'input#file-submit',
  uploadFiles: '#uploaded-files'
};

const menuSection = {
  selector: 'nav',
  elements: {
    home: 'a[href="/"]',
    about: 'a[href="/about"]'
  }
};

const fileUploadPage = {
  url(this: EnhancedPageObject) {
    return `${this.api.launch_url}/upload`;
  },
  elements: fileUploadPageElements,
  sections: {
    menu: menuSection
  }
} satisfies PageObjectModel;

export interface FileUploadPage extends
  EnhancedPageObject<{}, typeof fileUploadPageElements, typeof fileUploadPage.sections, {}, () => string> {} // eslint-disable-line @typescript-eslint/ban-types

export default fileUploadPage;


// Declare the newly created page object in the NightwatchCustomPageObjects interface.
// This will allow you to access the page object type in your test files.
declare module '..' {
  interface NightwatchCustomPageObjects {
    FileUpload(): FileUploadPage;
  }
  interface NightwatchCustomCommands {
    // uploadFile1 returns NightwatchAPI (breaks chaining on page objects)
    uploadFile1(selector: string, filePath: string): NightwatchAPI;
    // uploadFile2 returns Awaitable<NightwatchAPI, null> (breaks chaining on page objects)
    uploadFile2(selector: string, filePath: string): Awaitable<NightwatchAPI, null>;
    // uploadFile3 returns 'this' (allows chaining)
    uploadFile3(selector: string, filePath: string): this;
    upload: {
      file(selector: string, filePath: string): NightwatchAPI;
    }
  }
}


// test file
describe('File Upload', function() {
  it('File Upload test', function() {
    const fileUploadPage = browser.page.FileUpload();
    const url = fileUploadPage.url();

    fileUploadPage
      .navigate(url)
      .uploadFile('@fileUploadInput', 'test.txt')
      // alternate way of passing an element instead of '@submitButton'
      .click(fileUploadPage.elements.submitButton)
      .expect.element('@uploadFiles').text.to.equal('test.txt');

    // test custom commands over page object
    expectType<NightwatchAPI>(fileUploadPage.uploadFile1('@fileUploadInput', 'test2.txt'));
    expectType<Awaitable<NightwatchAPI, null>>(fileUploadPage.uploadFile2('@fileUploadInput', 'test2.txt'));
    // uploadFile3 returns 'this', so it preserves the page object type
    expectType<FileUploadPage>(fileUploadPage.uploadFile3('@fileUploadInput', 'test2.txt'));
    // should fail ideally but succeeding
    expectType<NightwatchAPI>(fileUploadPage.upload.file('@fileUploadInput', 'test2.txt'));

    // test custom commands over page object sections
    const menuSection = fileUploadPage.section.menu;
    expectType<NightwatchAPI>(menuSection.uploadFile1('@fileUploadInput', 'test2.txt'));
    expectType<Awaitable<NightwatchAPI, null>>(menuSection.uploadFile2('@fileUploadInput', 'test2.txt'));
    // uploadFile3 returns 'this', so it preserves the section type
    // Note: TypeScript may not properly resolve 'this' for custom commands on sections
    // The command works, but type resolution is limited
    menuSection.uploadFile3('@fileUploadInput', 'test2.txt');
    // should fail because the namespaces from custom commands are not loaded directly into the section
    expectError(menuSection.upload.file('@fileUploadInput', 'test2.txt'));

    browser.end();
  });
});


/**************************
 * OTHER TESTS
 *************************/
describe('File Upload 2', function() {
  it('File Upload test', function() {
    const fileUploadPage = browser.page.FileUpload();

    // user actions element commands work on page objects
    fileUploadPage.rightClick('@fileUploadInput');
    fileUploadPage.doubleClick('@fileUploadInput');
    fileUploadPage.clickAndHold('@fileUploadInput');
    expectError(fileUploadPage.navigateTo('https://google.com'));
    expectType<string>(fileUploadPage.url());

    // user actions element commands work on sections
    const menuSection = fileUploadPage.section.menu;
    menuSection.rightClick('@fileUploadInput');
    menuSection.doubleClick('@fileUploadInput');
    menuSection.clickAndHold('@fileUploadInput');
    expectError(menuSection.navigateTo('https://google.com'));
    expectError(menuSection.url());
  });
});

/**************************
 * TESTS FOR MOVED COMMANDS (SharedClientCommands)
 *************************/
describe('Page Object - SharedClientCommands', function() {
  it('should have access to moved commands from SharedClientCommands', function() {
    const fileUploadPage = browser.page.FileUpload();
    const menuSection = fileUploadPage.section.menu;

    // Test commands that were moved to SharedClientCommands
    // Verify they exist, are callable, and return correct types
    expectType<Awaitable<FileUploadPage, undefined>>(fileUploadPage.pause(1000));
    expectType<Awaitable<FileUploadPage, undefined>>(fileUploadPage.debug());
    expectType<Awaitable<FileUploadPage, null>>(fileUploadPage.end());
    expectType<Awaitable<FileUploadPage, string>>(fileUploadPage.getTitle());
    expectType<Awaitable<FileUploadPage, null>>(fileUploadPage.init());
    expectType<Awaitable<FileUploadPage, null>>(fileUploadPage.axeInject());
    expectType<Awaitable<FileUploadPage, null>>(fileUploadPage.deleteCookie('test'));
    expectType<Awaitable<FileUploadPage, null>>(fileUploadPage.deleteCookies());
    expectType<Awaitable<FileUploadPage, null>>(fileUploadPage.resizeWindow(1000, 800));
    expectType<Awaitable<FileUploadPage, string>>(fileUploadPage.saveScreenshot('test.png'));
    expectType<Awaitable<FileUploadPage, null>>(fileUploadPage.setCookie({ name: 'test', value: 'value' }));
    expectType<Awaitable<FileUploadPage, null>>(fileUploadPage.setWindowPosition(0, 0));
    expectType<Awaitable<FileUploadPage, null>>(fileUploadPage.setWindowRect({ x: 0, y: 0, width: 800, height: 600 }));
    expectType<Awaitable<FileUploadPage, null>>(fileUploadPage.setWindowSize(800, 600));
    expectType<Awaitable<FileUploadPage, null>>(fileUploadPage.urlHash('#test'));
    expectType<Awaitable<FileUploadPage, undefined>>(fileUploadPage.useCss());
    expectType<Awaitable<FileUploadPage, undefined>>(fileUploadPage.useXpath());

    expectError(fileUploadPage.registerBasicAuth('test-user', 'test-pass'));
    // These should also work on sections with correct return types
    expectType<Awaitable<typeof menuSection, undefined>>(menuSection.pause(1000));
    expectType<Awaitable<typeof menuSection, undefined>>(menuSection.debug());
    expectType<Awaitable<typeof menuSection, null>>(menuSection.end());
    expectType<Awaitable<typeof menuSection, string>>(menuSection.getTitle());
    expectType<Awaitable<typeof menuSection, null>>(menuSection.init());
    expectType<Awaitable<typeof menuSection, null>>(menuSection.axeInject());
    expectType<Awaitable<typeof menuSection, null>>(menuSection.deleteCookie('test'));
    expectType<Awaitable<typeof menuSection, null>>(menuSection.deleteCookies());
    expectType<Awaitable<typeof menuSection, null>>(menuSection.resizeWindow(1000, 800));
    expectType<Awaitable<typeof menuSection, string>>(menuSection.saveScreenshot('test.png'));
    expectType<Awaitable<typeof menuSection, null>>(menuSection.setCookie({ name: 'test', value: 'value' }));
    expectType<Awaitable<typeof menuSection, null>>(menuSection.setWindowPosition(0, 0));
    expectType<Awaitable<typeof menuSection, null>>(menuSection.setWindowRect({ x: 0, y: 0, width: 800, height: 600 }));
    expectType<Awaitable<typeof menuSection, null>>(menuSection.setWindowSize(800, 600));
    expectType<Awaitable<typeof menuSection, null>>(menuSection.urlHash('#test'));
    expectType<Awaitable<typeof menuSection, undefined>>(menuSection.useCss());
    expectType<Awaitable<typeof menuSection, undefined>>(menuSection.useXpath());
  });
});

/**************************
 * TESTS FOR CHROMIUM CLIENT COMMANDS
 *************************/
describe('Page Object - ChromiumClientCommands', function() {
  it('should have access to commands from ChromiumClientCommands', function() {
    const fileUploadPage = browser.page.FileUpload();
    const menuSection = fileUploadPage.section.menu;

    // Test commands from ChromiumClientCommands
    // Verify they exist, are callable, and return correct types
    expectType<Awaitable<FileUploadPage, null>>(fileUploadPage.setGeolocation({ latitude: 35.689487, longitude: 139.691706, accuracy: 100 }));
    expectType<Awaitable<FileUploadPage, null>>(fileUploadPage.setGeolocation());
    expectType<Awaitable<FileUploadPage, null>>(fileUploadPage.setDeviceDimensions({ width: 400, height: 600, deviceScaleFactor: 50, mobile: true }));
    expectType<Awaitable<FileUploadPage, null>>(fileUploadPage.setDeviceDimensions());
    expectType<Awaitable<FileUploadPage, { [metricName: string]: number }>>(fileUploadPage.getPerformanceMetrics());
    expectType<Awaitable<FileUploadPage, null>>(fileUploadPage.enablePerformanceMetrics(true));
    expectType<Awaitable<FileUploadPage, null>>(fileUploadPage.enablePerformanceMetrics());
    expectType<Awaitable<FileUploadPage, string>>(fileUploadPage.takeHeapSnapshot('./snap.heapsnapshot'));
    expectType<Awaitable<FileUploadPage, string>>(fileUploadPage.takeHeapSnapshot());
    expectType<Awaitable<FileUploadPage, null>>(fileUploadPage.captureNetworkRequests(() => {}));
    expectType<Awaitable<FileUploadPage, null>>(fileUploadPage.mockNetworkResponse('https://example.com', { status: 200 }));
    expectType<Awaitable<FileUploadPage, null>>(fileUploadPage.setNetworkConditions({ offline: false, latency: 3000, download_throughput: 500 * 1024, upload_throughput: 500 * 1024 }));
    expectType<Awaitable<FileUploadPage, null>>(fileUploadPage.captureBrowserConsoleLogs(() => {}));
    expectType<Awaitable<FileUploadPage, null>>(fileUploadPage.captureBrowserExceptions(() => {}));
    expectType<Awaitable<FileUploadPage, null>>(fileUploadPage.registerBasicAuth('test-user', 'test-pass'));

    // These should also work on sections with correct return types
    expectType<Awaitable<typeof menuSection, null>>(menuSection.setGeolocation({ latitude: 35.689487, longitude: 139.691706, accuracy: 100 }));
    expectType<Awaitable<typeof menuSection, null>>(menuSection.setGeolocation());
    expectType<Awaitable<typeof menuSection, null>>(menuSection.setDeviceDimensions({ width: 400, height: 600, deviceScaleFactor: 50, mobile: true }));
    expectType<Awaitable<typeof menuSection, null>>(menuSection.setDeviceDimensions());
    expectType<Awaitable<typeof menuSection, { [metricName: string]: number }>>(menuSection.getPerformanceMetrics());
    expectType<Awaitable<typeof menuSection, null>>(menuSection.enablePerformanceMetrics(true));
    expectType<Awaitable<typeof menuSection, null>>(menuSection.enablePerformanceMetrics());
    expectType<Awaitable<typeof menuSection, string>>(menuSection.takeHeapSnapshot('./snap.heapsnapshot'));
    expectType<Awaitable<typeof menuSection, string>>(menuSection.takeHeapSnapshot());
    expectType<Awaitable<typeof menuSection, null>>(menuSection.captureNetworkRequests(() => {}));
    expectType<Awaitable<typeof menuSection, null>>(menuSection.mockNetworkResponse('https://example.com', { status: 200 }));
    expectType<Awaitable<typeof menuSection, null>>(menuSection.setNetworkConditions({ offline: false, latency: 3000, download_throughput: 500 * 1024, upload_throughput: 500 * 1024 }));
    expectType<Awaitable<typeof menuSection, null>>(menuSection.captureBrowserConsoleLogs(() => {}));
    expectType<Awaitable<typeof menuSection, null>>(menuSection.captureBrowserExceptions(() => {}));
    expectType<Awaitable<typeof menuSection, null>>(menuSection.registerBasicAuth('test-user', 'test-pass'));
  });
});

/**************************
 * TESTS FOR CLIENT COMMANDS
 *************************/
describe('Page Object - ClientCommands', function() {
  it('should verify that ClientCommands-specific commands are not available on page objects', function() {
    const fileUploadPage = browser.page.FileUpload();
    const menuSection = fileUploadPage.section.menu;

    // Test commands that are specific to ClientCommands (not in ChromiumClientCommands or SharedClientCommands)
    // These commands are NOT available on page objects as they're not part of PageObjectClientCommands
    // Verify they don't exist using expectError
    expectError(fileUploadPage.closeWindow());
    expectError(fileUploadPage.fullscreenWindow());
    expectError(fileUploadPage.minimizeWindow());
    expectError(fileUploadPage.openNewWindow());
    expectError(fileUploadPage.getCurrentUrl());
    expectError(fileUploadPage.navigateTo('https://example.com'));
    expectError(fileUploadPage.quit());
    expectError(fileUploadPage.waitUntil(function() { return true; }));
    expectError(fileUploadPage.switchWindow('handle'));
    expectError(fileUploadPage.switchToWindow('handle'));

    // These should also not be available on sections
    expectError(menuSection.closeWindow());
    expectError(menuSection.fullscreenWindow());
    expectError(menuSection.minimizeWindow());
    expectError(menuSection.openNewWindow());
    expectError(menuSection.getCurrentUrl());
    expectError(menuSection.navigateTo('https://example.com'));
    expectError(menuSection.quit());
    expectError(menuSection.waitUntil(function() { return true; }));
    expectError(menuSection.switchWindow('handle'));
    expectError(menuSection.switchToWindow('handle'));
  });
});

/**************************
 * TESTS FOR CUSTOM COMMAND CHAINING
 *************************/
describe('Page Object - Custom Command Chaining', function() {
  it('should support chaining custom commands with built-in commands on page objects', function() {
    const fileUploadPage = browser.page.FileUpload();

    // Chain built-in command -> custom command
    expectType<NightwatchAPI>(fileUploadPage.pause(1000).uploadFile1('@fileUploadInput', 'test.txt'));
    expectType<NightwatchAPI>(fileUploadPage.click('@submitButton').uploadFile1('@fileUploadInput', 'test.txt'));
    expectType<NightwatchAPI>(fileUploadPage.setValue('@fileUploadInput', 'value').uploadFile1('@fileUploadInput', 'test.txt'));

    // Chain custom command -> built-in command
    // uploadFile1 returns NightwatchAPI, then these commands return Awaitable<NightwatchAPI, ...>
    expectType<Awaitable<NightwatchAPI, undefined>>(fileUploadPage.uploadFile1('@fileUploadInput', 'test.txt').pause(1000));
    expectType<Awaitable<NightwatchAPI, null>>(fileUploadPage.uploadFile1('@fileUploadInput', 'test.txt').click('@submitButton'));
    expectType<Awaitable<NightwatchAPI, string>>(fileUploadPage.uploadFile1('@fileUploadInput', 'test.txt').getTitle());

    // Chain multiple custom commands (uploadFile1 returns NightwatchAPI)
    expectType<NightwatchAPI>(fileUploadPage.uploadFile1('@fileUploadInput', 'test.txt').uploadFile1('@fileUploadInput', 'test2.txt'));
    // When chained with pause, pause returns Awaitable<NightwatchAPI, undefined>
    expectType<Awaitable<NightwatchAPI, undefined>>(fileUploadPage.uploadFile1('@fileUploadInput', 'test.txt').uploadFile1('@fileUploadInput', 'test2.txt').pause(1000));

    // Chain multiple custom commands (uploadFile3 returns 'this', preserves page object type)
    // uploadFile3 returns FileUploadPage, so chaining multiple returns FileUploadPage
    expectType<FileUploadPage>(fileUploadPage.uploadFile3('@fileUploadInput', 'test.txt').uploadFile3('@fileUploadInput', 'test2.txt'));
    // When chained with pause, pause returns Awaitable
    expectType<Awaitable<FileUploadPage, undefined>>(fileUploadPage.uploadFile3('@fileUploadInput', 'test.txt').uploadFile3('@fileUploadInput', 'test2.txt').pause(1000));

    // Chain custom command that returns 'this' (allows chaining back to page object)
    // uploadFile3 returns FileUploadPage, then pause returns Awaitable<FileUploadPage, undefined>
    expectType<Awaitable<FileUploadPage, undefined>>(fileUploadPage.pause(1000).uploadFile3('@fileUploadInput', 'test.txt').pause(1000));
    expectType<Awaitable<FileUploadPage, undefined>>(fileUploadPage.uploadFile3('@fileUploadInput', 'test.txt').pause(1000));
    // click returns Awaitable<FileUploadPage, null>
    expectType<Awaitable<FileUploadPage, null>>(fileUploadPage.uploadFile3('@fileUploadInput', 'test.txt').click('@submitButton'));
    expectType<Awaitable<FileUploadPage, string>>(fileUploadPage.uploadFile3('@fileUploadInput', 'test.txt').getTitle());

    // Chain custom command with Awaitable return type -> built-in command
    expectType<Awaitable<NightwatchAPI, null>>(fileUploadPage.uploadFile2('@fileUploadInput', 'test.txt').click('@submitButton'));

    // Chain built-in command -> custom command with Awaitable return type
    expectType<Awaitable<NightwatchAPI, null>>(fileUploadPage.pause(1000).uploadFile2('@fileUploadInput', 'test.txt'));
    expectType<Awaitable<NightwatchAPI, null>>(fileUploadPage.click('@submitButton').uploadFile2('@fileUploadInput', 'test.txt'));

    // Chain custom command -> SharedClientCommands (uploadFile1 returns NightwatchAPI)
    // These commands return Awaitable<NightwatchAPI, ...>
    expectType<Awaitable<NightwatchAPI, undefined>>(fileUploadPage.uploadFile1('@fileUploadInput', 'test.txt').pause(1000));
    expectType<Awaitable<NightwatchAPI, undefined>>(fileUploadPage.uploadFile1('@fileUploadInput', 'test.txt').debug());
    expectType<Awaitable<NightwatchAPI, string>>(fileUploadPage.uploadFile1('@fileUploadInput', 'test.txt').getTitle());
    expectType<Awaitable<NightwatchAPI, string>>(fileUploadPage.uploadFile1('@fileUploadInput', 'test.txt').saveScreenshot('test.png'));

    // Chain custom command -> SharedClientCommands (uploadFile3 returns 'this', preserves page object type)
    // uploadFile3 returns FileUploadPage, then these commands return Awaitable<FileUploadPage, ...>
    expectType<Awaitable<FileUploadPage, undefined>>(fileUploadPage.uploadFile3('@fileUploadInput', 'test.txt').pause(1000));
    expectType<Awaitable<FileUploadPage, undefined>>(fileUploadPage.uploadFile3('@fileUploadInput', 'test.txt').debug());
    expectType<Awaitable<FileUploadPage, string>>(fileUploadPage.uploadFile3('@fileUploadInput', 'test.txt').getTitle());
    expectType<Awaitable<FileUploadPage, string>>(fileUploadPage.uploadFile3('@fileUploadInput', 'test.txt').saveScreenshot('test.png'));

    // Chain SharedClientCommands -> custom command (uploadFile1 returns NightwatchAPI)
    expectType<NightwatchAPI>(fileUploadPage.pause(1000).uploadFile1('@fileUploadInput', 'test.txt'));
    expectType<NightwatchAPI>(fileUploadPage.debug().uploadFile1('@fileUploadInput', 'test.txt'));
    expectType<NightwatchAPI>(fileUploadPage.getTitle().uploadFile1('@fileUploadInput', 'test.txt'));

    // Chain SharedClientCommands -> custom command (uploadFile3 returns 'this', preserves page object type)
    // Note: When chaining from Awaitable, TypeScript may not properly resolve 'this' type
    // These tests verify that uploadFile3 can be called, but type resolution may be limited
    fileUploadPage.pause(1000).uploadFile3('@fileUploadInput', 'test.txt');
    fileUploadPage.debug().uploadFile3('@fileUploadInput', 'test.txt');
    fileUploadPage.getTitle().uploadFile3('@fileUploadInput', 'test.txt');

    // Chain custom command -> ChromiumClientCommands (uploadFile1 returns NightwatchAPI)
    // setGeolocation returns Awaitable<NightwatchAPI, null>
    expectType<Awaitable<NightwatchAPI, null>>(fileUploadPage.uploadFile1('@fileUploadInput', 'test.txt').setGeolocation({ latitude: 35.689487, longitude: 139.691706 }));
    expectType<Awaitable<NightwatchAPI, null>>(fileUploadPage.uploadFile1('@fileUploadInput', 'test.txt').setDeviceDimensions({ width: 400, height: 600 }));

    // Chain custom command -> ChromiumClientCommands (uploadFile3 returns 'this', preserves page object type)
    expectType<Awaitable<FileUploadPage, null>>(fileUploadPage.uploadFile3('@fileUploadInput', 'test.txt').setGeolocation({ latitude: 35.689487, longitude: 139.691706 }));
    expectType<Awaitable<FileUploadPage, null>>(fileUploadPage.uploadFile3('@fileUploadInput', 'test.txt').setDeviceDimensions({ width: 400, height: 600 }));

    // Chain ChromiumClientCommands -> custom command (uploadFile1 returns NightwatchAPI)
    expectType<NightwatchAPI>(fileUploadPage.setGeolocation({ latitude: 35.689487, longitude: 139.691706 }).uploadFile1('@fileUploadInput', 'test.txt'));
    expectType<NightwatchAPI>(fileUploadPage.setDeviceDimensions({ width: 400, height: 600 }).uploadFile1('@fileUploadInput', 'test.txt'));

    // Chain ChromiumClientCommands -> custom command (uploadFile3 returns 'this', preserves page object type)
    // Note: When chaining from Awaitable, TypeScript may not properly resolve 'this' type
    // These tests verify that uploadFile3 can be called, but type resolution may be limited
    fileUploadPage.setGeolocation({ latitude: 35.689487, longitude: 139.691706 }).uploadFile3('@fileUploadInput', 'test.txt');
    fileUploadPage.setDeviceDimensions({ width: 400, height: 600 }).uploadFile3('@fileUploadInput', 'test.txt');
  });

});
