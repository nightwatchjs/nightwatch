// DO NOT rename the file
import { fireEvent, within } from '@testing-library/dom';
import Form from '../src/Form.jsx';

export default {
  title: 'Form',
  component: Form,
}

export const FormStory = () => <Form />

export const AnotherForm = Object.assign(() => <Form />, {
  async beforeMount() {
    await new Promise((resolve, reject) => setTimeout(function() {
      resolve()
    }, 50));
  },

  async afterMount() {
    await new Promise((resolve, reject) => setTimeout(function() {
      resolve()
      //reject(new Error('something failed in after mount'));
    }, 100));
  },

  async play({canvasElement, args}) {
    const async_value = await new Promise((resolve) => setTimeout(function() {
      resolve('test_value_async');
    }, 100));

    const root = within(canvasElement);
    const input = root.getByTestId('new-todo-input');

    fireEvent.change(input, {
      target: {
        value: 'I entered the value'
      }
    });

    return {
      component_element: window['@component_element'],
      fromPlay: input,
      async_value
    }
  },
  test: async (browser, {component, result}) => {
    await browser.assert.deepEqual(Object.keys(result), ['async_value', 'component_element', 'fromPlay']);
    await browser.assert.strictEqual(result.async_value, 'test_value_async');
    await browser.assert.ok('driver_' in result.fromPlay);
    await expect(component).to.be.visible;
    await expect(component.find('input')).to.have.property('value').equal('I entered the value');
  }
});