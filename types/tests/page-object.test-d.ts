// Page object file
import {EnhancedPageObject, PageObjectModel} from '..';

const fileUploadPageElements = {
  fileUploadInput: 'input#file-upload',
  submitButton: 'input#file-submit',
  uploadFiles: '#uploaded-files'
};

const fileUploadPage = {
  url(this: EnhancedPageObject) {
    return `${this.api.launch_url}/upload`;
  },
  elements: fileUploadPageElements
} satisfies PageObjectModel;

export interface FileUploadPage extends
  EnhancedPageObject<{}, typeof fileUploadPageElements, {}, {}, () => string> {} // eslint-disable-line @typescript-eslint/ban-types

export default fileUploadPage;


// Declare the newly created page object in the NightwatchCustomPageObjects interface.
// This will allow you to access the page object type in your test files.
declare module '..' {
  interface NightwatchCustomPageObjects {
    FileUpload(): FileUploadPage;
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

    browser.end();
  });
});
