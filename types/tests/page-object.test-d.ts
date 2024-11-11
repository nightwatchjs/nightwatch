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
    uploadFile1(selector: string, filePath: string): NightwatchAPI;
    uploadFile2(selector: string, filePath: string): Awaitable<NightwatchAPI, null>;
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
    // should fail ideally but succeeding
    expectType<NightwatchAPI>(fileUploadPage.upload.file('@fileUploadInput', 'test2.txt'));

    // test custom commands over page object sections
    const menuSection = fileUploadPage.section.menu;
    expectType<NightwatchAPI>(menuSection.uploadFile1('@fileUploadInput', 'test2.txt'));
    expectType<Awaitable<NightwatchAPI, null>>(menuSection.uploadFile2('@fileUploadInput', 'test2.txt'));
    // should fail because the namespaces from custom commands are not loaded directly into the section
    expectError(menuSection.upload.file('@fileUploadInput', 'test2.txt'));

    browser.end();
  });
});
