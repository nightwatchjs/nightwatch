const nwTooltip = createTooltip();
const highlightClassName = 'nw-highlight';

//Explore mode is not the default mode
let EXPLORE_MODE = false;

chrome.runtime.onMessage.addListener(handleMessages);

document.addEventListener('mouseover', mouseOver);
document.addEventListener('mouseout', mouseOut);
document.addEventListener('click', clickEvent);

function handleMessages(message) {
  const {action, content} = message;

  switch (action) {
    case 'EXPLORE_MODE':
      setExploreMode(content);
      break;

    case 'HIGHLIGHT_ELEMENT':
      highlightElement(content);
      break;
      
  }
}

function mouseOver(event) {
  if (!EXPLORE_MODE) {
    return;
  }

  const element = event.target;
  addHighlightClass(element);

  const uniqueSelector = generateSelector(element);
  updateTooltipPosition(element, uniqueSelector);
}

function mouseOut(event) {
  if (!EXPLORE_MODE) {
    return;
  }

  const element = event.target;

  clearHighlight(element);
  updateTooltipPosition();
}

function clickEvent(event) {
  console.log('click event happend');
  if (!EXPLORE_MODE) {
    return;
  }

  disableClick(event);
  clearHighlight();
  const element = event.target;
  const uniqueSelector = generateSelector(element);

  chrome.runtime.sendMessage({
      from: 'contentJS',
      action: 'selector',
      content: uniqueSelector
  });
}

function setExploreMode(value) {
  console.log(value)
  EXPLORE_MODE = value;
}

function highlightElement(selector) {
    // clear all previous highlighted elements
    clearHighlight();
    const element = document.querySelector(selector);
    addHighlightClass(element);
}

function addHighlightClass(element) {
    // Adding css class to highlight the element
    element.classList.add(highlightClassName);
}

function clearHighlight(element = null) {
    if (element) {
        element.classList.remove(highlightClassName);
        return;
    }

    const highlightedElements = [...document.getElementsByClassName(highlightClassName)];

    highlightedElements.forEach((element) => {
        element.classList.remove(highlightClassName);
    });
}

function disableClick(event) {
  console.log("disable click");
    event.stopPropagation();
    event.preventDefault();
    event.stopImmediatePropagation();
}

function getChildIndex(element) {
    return Array.from(element.parentNode.children).indexOf(element) + 1;
}

function createTooltip() {
    //const eleCoordinates = element.getBoundingClientRect();
    const tooltip = document.createElement('span');
    tooltip.id = 'nw-tooltip';
    document.body.appendChild(tooltip);
    return tooltip;
}

function updateTooltipPosition(element = null, selector = '') {
    if (element === null) {
        nwTooltip.style.top = '0px';
        nwTooltip.style.left = '0px';
        nwTooltip.textContent = '';
        return;
    }

    // TODO: Should check if tootltip position is out of window (bottom of screen)
    const rect = element.getBoundingClientRect();
    nwTooltip.style.top = rect.bottom + window.pageYOffset + 10 + 'px';
    nwTooltip.style.left = rect.left + 'px';
    nwTooltip.textContent = selector;
    if ( window.innerWidth - nwTooltip.getBoundingClientRect().right < 0) {
      nwTooltip.style.left = rect.left + window.innerWidth - nwTooltip.getBoundingClientRect().right + 'px';
    }
}


function getAttributeSelectors(element) {
  const attributes = [...element.attributes];
  const attributesToConsider = ['placeholder', 'name', 'type', 'alt', 'value', 'for', 'title', 'lang', 'href']

  return attributes.reduce((prev, next) => {
      const attributesName = next.nodeName.toLowerCase();
      const attributesValue = next.value;
      if (attributesName.startsWith('data-') || attributesName.startsWith('aria-') || attributesToConsider.indexOf(attributesName) > -1) {
          if (attributesValue) {
              prev.push(`[${attributesName}="${attributesValue}"]`);
          }
      }

      return prev;
  }, []);

}

function getClassSelectors(element) {
  const classList = [...element.classList].filter((Class) => Class !== highlightClassName);
  return classList.map(Class => `.${Class}`);
}

function getIdSelectors(element) {
  const id = element.getAttribute('id');
  if(id && id !== '') {
      return `#${id}`;
  }

  return null;
}

function getCssPath(element) {
  const tagName = getTag(element);

  return `${tagName}:nth-child(${getChildIndex(element)})`;
}

function getTag(element) {
  return element.tagName.toLowerCase();
}

function getUniqueCombination(element, selectors, tagName) {
  let combinations = getCombinations(selectors);

  combinations = combinations.map(combination => tagName + combination);
  uniqueFirstSelector = chooseFirstUniqueSelector(element, combinations);

  if(uniqueFirstSelector)
  {
      return uniqueFirstSelector;
  }

  return null;
}

function getCombinations(selectors) {
  const combinations = [...selectors];
  for (let i=0; i < selectors.length-1; i++) {

      for (let j=i+1; j < selectors.length; j++) {
          combinations.push(selectors[i] + selectors[j]);
      }

  }
  return combinations;
} 

function chooseFirstUniqueSelector(element, selectors) {
  for(let selector of selectors) {
      if (isUnique(selector)) {
          return selector;
      }
      
  }
  // select unique selector in its parent children
  for(let selector of selectors) {
      if (isUniqueInParent(element, selector)) {
          return selector;
      }
      
  }

  return null;
}

function generateSelectorFromParent(element) {
  const attributesSelectors = getAttributeSelectors(element);
  const classSelectors = getClassSelectors(element);
  const idSelectors = getIdSelectors(element);
  const cssPath = getCssPath(element);
  const tagName = getTag(element);

  let selector = null;
  selector = getUniqueCombination(element, attributesSelectors, tagName);

  if (selector) {
      return selector;
  }

  if (idSelectors && isUnique(element, idSelectors)) {
      return idSelectors;
  }

  selector = getUniqueCombination(element, classSelectors, tagName);

  if(selector) {
      return selector;
  }

  if (cssPath) {
      return cssPath;
  }

  return '*';

}

function getParentElement(element) {
  if (element.parentNode) {
      return element.parentNode;
  }

  return null;
}

function isUniqueInParent(element, selector) {
  const {parentNode = null} = element;
  try {
    const elements = parentNode.querySelectorAll(selector);

    return elements.length === 1;
  } catch {
    return false;
  }
}

function isUnique(selector) {
  try {
    const elements = document.querySelectorAll(selector);

    return elements.length === 1;
  } catch {
    return false;
  }
}

function generateSelector(element) {
  let targetElement = element;
  let uniqueSelector = generateSelectorFromParent(targetElement);
  const selectors = [];
  selectors.unshift(uniqueSelector);

  while (!isUnique(uniqueSelector)) {
      targetElement = getParentElement(targetElement);
      selectors.unshift(generateSelectorFromParent(targetElement));
      uniqueSelector = selectors.join(' > ');
  }
  
  return uniqueSelector;
}