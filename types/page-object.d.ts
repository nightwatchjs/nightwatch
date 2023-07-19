import {MergeObjectsArray} from './utils';
import {NightwatchCustomCommands} from './custom-command';
import {
  AlertsNsCommands,
  Assert,
  ChromiumClientCommands,
  CookiesNsCommands,
  DocumentNsCommands,
  ElementCommands,
  ElementFunction,
  Expect,
  LocateStrategy,
  NamespacedApi,
  NightwatchAPI,
  NightwatchClient,
  NightwatchComponentTestingCommands,
  SharedCommands
} from './index';

export interface SectionProperties {
  /**
   * The element selector name
   *
   * @example
   * sections: {
   *   apps: {
   *     selector: 'div.gb_pc'
   *   }
   * }
   */
  selector: string;

  /**
   * An object, or array of objects, of named element definitions to be used
   * as element selectors within element commands.
   *
   * @example
   * sections: {
   *   apps: {
   *     selector: 'div.gb_pc',
   *     elements: {
   *       myAccount: {
   *         selector: '#gb192'
   *       },
   *       googlePlus: {
   *         selector: '#gb119'
   *       }
   *     }
   *   }
   * }
   */
  elements?:
  | Partial<{ [name: string]: string | ElementProperties }>
  | Partial<{ [name: string]: string | ElementProperties }>[];

  /**
   * An object of named sections definitions defining the sections.
   *
   * @example
   * sections: {
   *   menu: {
   *     selector: '#gb',
   *     sections: {
   *       apps: {
   *         selector: 'div.gb_pc',
   *         elements: {
   *           myAccount: {
   *             selector: '#gb192'
   *           }
   *         }
   *       }
   *     }
   *   }
   * }
   */
  sections?: {
    [name: string]: SectionProperties;
  };

  /**
   * A list of objects containing functions to represent methods added to the section.
   *
   * @example
   * sections: {
   *   apps: {
   *     selector: 'div.gb_pc',
   *     commands: [
   *       {
   *         clickYoutube() {
   *           console.log('Click Youtube')
   *         }
   *       }
   *     ]
   *   }
   * }
   */
  commands?:
    | Partial<Record<string, (...args: any) => unknown>>
    | Partial<Record<string, (...args: any) => unknown>>[];

  /**
   * An object or a function returning an object representing a container for user variables.
   * Props objects are copied directly into the props property of the page object instance.
   *
   * @example
   * sections: {
   *   apps: {
   *     selector: 'div.gb_pc',
   *     // object version
   *     props: {
   *       myVar: "some info"
   *     }
   *   },
   *   menu: {
   *     selector: '#gb',
   *     // function version
   *     props: function () {
   *       return {
   *         myOtherVar: "some other info"
   *       };
   *     }
   *   }
   * }
   */
  props?: Record<string, unknown> | (() => Record<string, unknown>);
}

export type EnhancedSectionInstance<
  Commands = {},
  Elements = {},
  Sections extends Record<string, PageObjectSection> = {},
  Props = {}
> = EnhancedPageObjectSections<Commands, Elements, Sections, Props> &
  Commands &
  ElementCommands &
  ChromiumClientCommands &
  Pick<
    NightwatchComponentTestingCommands,
    'importScript' | 'launchComponentRenderer' | 'mountComponent'
  > &
  Pick<
    NightwatchAPI,
    | 'axeInject'
    | 'axeRun'
    | 'debug'
    | 'deleteCookie'
    | 'deleteCookies'
    | 'end'
    | 'getCookie'
    | 'getCookies'
    | 'getLog'
    | 'getLogTypes'
    | 'getTitle'
    | 'getWindowPosition'
    | 'getWindowRect'
    | 'getWindowSize'
    | 'init'
    | 'injectScript'
    | 'isLogAvailable'
    | 'maximizeWindow'
    | 'pause'
    | 'perform'
    | 'resizeWindow'
    | 'saveScreenshot'
    | 'setCookie'
    | 'setWindowPosition'
    | 'setWindowRect'
    | 'setWindowSize'
    | 'urlHash'
    | 'useCss'
    | 'useXpath'
    | 'registerBasicAuth'
    | 'setNetworkConditions'
    | 'clickAndHold'
    | 'doubleClick'
    | 'rightClick'
  >;

interface PageObjectSection {
  commands?: Record<string, unknown> | Record<string, unknown>[];
  elements?: Record<string, unknown> | Record<string, unknown>[];
  props?: Record<string, unknown>;
  // TODO: make sections type more strict.
  sections?: any;
}

export interface EnhancedPageObjectSections<
  Commands = {},
  Elements = {},
  Sections extends Record<string, PageObjectSection> = {},
  Props = {}
> extends EnhancedPageObjectSharedFields<
  Commands,
  Elements,
  Sections,
  Props
> {
  /**
   * The element selector name
   *
   * @example
   * '@searchBar'
   */
  selector: string;
}

interface EnhancedPageObjectSharedFields<
  Commands = {},
  Elements = {},
  Sections extends Record<string, PageObjectSection> = {},
  Props = {},
  URL = string
> {
  /**
   * A map of Element objects
   * (see [Enhanced Element Instances](https://github.com/nightwatchjs/nightwatch/wiki/Page-Object-API#enhanced-element-instances))
   * used by element selectors.
   */
  elements: {
    [key in keyof Elements]: EnhancedElementInstance<
      EnhancedPageObject<Commands, Elements, Sections, Props, URL>
    >;
  };

  /**
   * Section object
   * (see [Enhanced Element Instances](https://github.com/nightwatchjs/nightwatch/wiki/Page-Object-API#enhanced-section-instances))
   */
  section: {
    [Key in keyof Sections]: EnhancedSectionInstance<
      Required<MergeObjectsArray<Sections[Key]['commands']>>,
      Required<MergeObjectsArray<Sections[Key]['elements']>>,
      Required<Sections[Key]['sections']>,
      Required<Sections[Key]['props']>
    >;
  };

  /**
   * The name of the page object as defined by its module name (not including the extension).
   * This is the same name used to access the `page` object factory from the page reference in the command API.
   */
  name: string;

  /**
   * An object or a function returning an object representing a container for user variables.
   */
  props: Props;

  /**
   * Nightwatch Client.
   */ 
  client: NightwatchClient;

  /**
   * Nightwatch API.
   */
  api: NightwatchAPI;

  /**
   * Nightwatch new element API.
   */
  element: ElementFunction;

  // Namespaces directly available on page-objects and sections.
  alerts: AlertsNsCommands<this>;
  cookies: CookiesNsCommands<this>;
  document: DocumentNsCommands<this>;
  assert: Assert<this>;
  verify: Assert<this>;
  expect: Expect;
}

export interface ElementProperties {
  /**
   * The element selector name
   *
   * @example
   * '@searchBar'
   */
  selector: string;

  /**
   * locator strategy can be one of
   *  - css selector
   *  - link text
   *  - partial link text
   *  - tag name
   *  - xpath
   *
   * @example
   * 'css selector'
   */
  locateStrategy?: LocateStrategy;

  /**
   * used to target a specific element in a query that results in multiple elements returned. Normally,
   * only the first element is used (index = 0) but using the index property, you can specify any element within the result.
   */
  index?: number;

  /**
   * used to overwrite this setting when using waitForElement* commands.
   */
  abortOnFailure?: boolean;

  /**
   * used to overwrite the default timeout for when using waitForElement* commands or assertions.
   */
  timeout?: number;

  /**
   * used to overwrite the default retry interval for when using waitForElement* commands or assertions.
   */
  retryInterval?: number;

  /**
   * Some element commands like .click() or .getText() will throw a NoSuchElement error if the element cannot be located, causing the test to fail.
   * If this option is set to true then this error is ignored.
   */
  suppressNotFoundErrors?: boolean;
}

/**
 * #### [Enhanced Element Instances](https://github.com/nightwatchjs/nightwatch/wiki/Page-Object-API#enhanced-element-instances)
 * Element instances encapsulate the definition used to handle element selectors.
 * Generally you won't need to access them directly,
 * instead referring to them using their `@`-prefixed names for selector arguments,
 * but they are available through a page object or section's elements property.
 */
export interface EnhancedElementInstance<T> {
  /**
   * The name of the element as defined by its key in the parent section or the page object's `elements` definition.
   * This is the same name used with the `@` prefix in selector arguments for page object commands that refer to the element.
   */
  name: string;

  /**
   * The locate strategy to be used with `selector` when finding the element within the DOM.
   */
  locateStrategy: LocateStrategy;

  /**
   * A reference to the parent object instance.
   * This is the parent section or the page object that contained the definition for this object.
   */
  parent: T;

  /**
   * The selector string used to find the element in the DOM.
   */
  selector: string;
}

/**
 * Page objects provide an additional layer of abstraction for test case creation.
 * Page objects are defined in modules and parsed into factory functions that create page object instances.
 *
 * @see https://nightwatchjs.org/api/pageobject/#overview
 *
 * @remarks Use satisfies to preserve types!
 *
 * @example
 * const homePage = {
 *   // Some options
 * } satisfies PageObjectModel;
 */

export interface PageObjectModel {
  /**
   * A list of objects containing functions to represent methods added to the page object instance.
   * Page-specific commands: {@link https://nightwatchjs.org/guide/using-page-objects/writing-page-specific-commands.html}
   *
   * @example
   * class MyCommands {
   *   myFirstMethod() {
   *     return 'My First Method';
   *   }
   * }
   *
   * const homePage = {
   *   commands: MyCommands
   * } satisfies PageObjectModel;
   */
  commands?:
    | Partial<Record<string, (...args: any) => unknown>>
    | Partial<Record<string, (...args: any) => unknown>>[];

  /**
   * An object, or array of objects, of named element definitions to be used
   * as element selectors within element commands called from the page object.
   *
   * @example
   * const homePage = {
   *   elements: [
   *     {
   *       contactUs: "#contactUs",
   *       searchBar: {
   *         selector: 'input[type=text]',
   *       },
   *       submitButton: {
   *         selector: 'input[name=btnK]',
   *       },
   *     },
   *   ]
   * } satisfies PageObjectModel;
   */
  elements?:
  | Partial<{ [name: string]: string | ElementProperties }>
  | Partial<{ [name: string]: string | ElementProperties }>[];

  /**
   * An object or a function returning an object representing a container for user variables.
   * Props objects are copied directly into the props property of the page object instance.
   *
   * @example
   * const homePage = {
   *   props: {
   *     myVar: "some info"
   *   }
   * } satisfies PageObjectModel;
   */
  props?: Record<string, unknown> | (() => Record<string, unknown>);

  /**
   * An object of named sections definitions defining the sections within the page object.
   *
   * @example
   * const homePage = {
   *   sections: {
   *     menu: {
   *       selector: '#gb',
   *       elements: {
   *         mail: {
   *           selector: 'a[href="https://mail.google.com/mail/&ogbl"]'
   *         }
   *       }
   *     }
   *   }
   * } satisfies PageObjectModel;
   */
  sections?: {
    [name: string]: SectionProperties;
  };

  /**
   * A url or function returning a url to be used in a url() command when the page's navigate() method is called.
   *
   * @example
   * const homePage = {
   *   url: function() {
   *      return this.api.launchUrl;
   *   }
   * } satisfies PageObjectModel;
   */
  url?: string | ((...args: any) => string);
}

/**
 * #### [Enhanced Page Object Instances](https://github.com/nightwatchjs/nightwatch/wiki/Page-Object-API#enhanced-page-object-instances)
 * Page object module definitions are used to define page object instances when their respective
 * factory functions within the page reference of the standard command API is called.
 * ```
 * const myPageObject = browser.page.MyPage(); // defined in MyPage.js module
 * ```
 * Every time a factory function like MyPage above is called, a new instance of the page object is instantiated.
 */
export type EnhancedPageObject<
  Commands = {},
  Elements = {},
  Sections extends Record<string, PageObjectSection> = {},
  Props = {},
  URL = string
> = SharedCommands &
  NightwatchCustomCommands &
  EnhancedPageObjectSharedFields<
    Required<MergeObjectsArray<Commands>>,
    Required<MergeObjectsArray<Elements>>,
    Sections,
    Props,
    URL
  > &
  Required<MergeObjectsArray<Commands>> & {
    /**
     * A url or function returning a url to be used in a url() command when the page's navigate() method is called.
     *
     * @example
     * const homePageObject = browser.page.homePage();
     *
     * googlePage.url; // if string type
     * googlePage.url(); // if function type
     */
    url: URL;

    /**
     * This command is an alias to url and also a convenience method because when called without any arguments
     * it performs a call to .url() with passing the value of `url` property on the page object.
     * Uses `url` protocol command.
     *
     * @example
     * const homePageObject = browser.page.homePage();
     *
     * homePageObject.navigate();
     */
    navigate(
      url?: string,
      callback?: () => void
    ): EnhancedPageObject<Commands, Elements, Sections, Props, URL>;
  };
