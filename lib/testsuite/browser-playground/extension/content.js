(() => {
    const nwTooltip = createTooltip();
    const highlightClassName = 'nw-highlight';
    //Explore mode is not the default mode
    var EXPLORE_MODE = false;
    //const tabID = getCurrentTabId();

    chrome.runtime.onMessage.addListener((msg, sender, response) => {
        const {from, action, content} = msg;

        switch (action) {
            case 'EXPLORE_MODE':
                setExploreMode(content);
                break;

            case 'highlightSelector':
                highlightSelector(content);
                break;
            
        }
    });

    document.addEventListener('mouseover', function (e) {
        if (!EXPLORE_MODE) {
            return;
        }

        const element = e.target;
        highlightElement(element);
        const selectorList = generateSelectors(element) || generateCssSelectors(element);
        //const selectorList = generateCssSelectors(element);
        updateTooltipPosition(element, selectorList);
    });

    document.addEventListener('mouseout', function (e) {
        if (!EXPLORE_MODE) {
            return;
        }

        const element = e.target;
        clearHighlight(element);
        updateTooltipPosition();
    });

    document.addEventListener('click', function(e) {
        if (!EXPLORE_MODE) {
            return;
        }
        
        disableClick(e);
        clearHighlight();
        var element = e.target;
        const selectorList = generateSelectors(element) || generateCssSelectors(element);
        //const selectorList = generateCssSelectors(element);

        chrome.runtime.sendMessage({
            from: 'contentJS',
            action: 'selector',
            content: selectorList
        });

    });

    function setExploreMode(value) {
        EXPLORE_MODE = value;
    }

    async function getCurrentTabId() {
        let queryOptions = { active: true, lastFocusedWindow: true };
        // `tab` will either be a `tabs.Tab` instance or `undefined`.
        let [tab] = await chrome.tabs.query(queryOptions);
        return tab;
    }

    function highlightSelector(selector) {
        // clear all previous highlighted elements
        clearHighlight();

        const element = document.querySelector(selector);
        highlightElement(element);
    }

    function highlightElement(element) {
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

    function disableClick(e) {
        e.stopPropagation();
        e.preventDefault();
    }

    function generateCssSelectors(element) {

        let selector = '>' + element.nodeName.toLowerCase() + ':nth-child(' + getChildIndex(element) + ')';
        let parent = element.parentNode;

        while (!parent.id && parent.nodeName.toLowerCase() !== 'body') {
            selector = '>' + parent.nodeName.toLowerCase() + ':nth-child(' + getChildIndex(parent) + ')' + selector;
            parent = parent.parentNode;
        }

        if (parent.nodeName === 'body') {
            selector = 'body' + selector;
        } else {
            selector = '#' + parent.id + selector;
        }

        return selector;
    }

    function generateSelectors(element) {
        const selectors = accumulateSelectors(element);
        let classSelector = '';
        selectors.sort((a, b) => a.priority > b.priority);
        console.log(selectors);
        if (selectors.length) {
            return selectors[0].selector;
        }
        // selectors.forEach(({selector}) => {
        //     const parentElementTagName = element.parentNode && element.parentNode.nodeName.toLowerCase();
        //     // if (document.querySelectorAll(selector).length === 1) {
        //     //     return selector;
        //     // }
        //     return selector;

        //     // const parentSelector = parentElementTagName + ' ' + selector;

        //     // if (document.querySelectorAll(parentSelector).length === 1) {
        //     //     return parentSelector;
        //     // }
        //     console.log(selector, parentSelector);

        // });

        let classList = [...element.classList];
        for(let i=0; i < classList.length; i++) {
                if (classList[i] === highlightClassName) {
                    continue;
                }

                classSelector += '.' + classList[i];
                // if(document.querySelectorAll(classSelector).length === 1) {
                //     return classSelector;
                // }
        }
        if (classSelector) {
            return classSelector;        
        }
    //    selectors.forEach(({selector}) => {
    //         if (document.querySelectorAll(selector + classSelector).length === 1) {
    //             return selector + classSelector;
    //         }
    //     });

        return '';
    }

    function accumulateSelectors(element) {
        let selectors = [];
        let selector = '';
        element = element.closest('a,input,button') || element;
        const elementName = element.nodeName.toLowerCase();
        const attributes = [...element.attributes];
        attributes.forEach((eachAttribute) => {
            const attributesName = eachAttribute.nodeName.toLowerCase();
            const attributesValue = eachAttribute.value;
            if (attributesName.startsWith('data-') && attributesValue) {
                selector = `${elementName}[${attributesName}="${attributesValue}"]`;
                selectors.push({
                    selector: selector,
                    priority: 1
                });
            }

            if(['placeholder', 'name', 'alt', 'title', 'type', 'id', 'href'].includes(attributesName) && attributesValue) {
                if (attributesName === 'class' && attributesValue) {
                    selector = `${elementName}[${attributesName}="${attributesValue}"]`;
                    selectors.push({
                        selector: selector,
                        priority: 2
                    });
                }
                else {
                    selector = `${elementName}[${attributesName}="${attributesValue}"]`;
                    selectors.push({
                        selector: selector,
                        priority: 2
                    });
                }
                
            }
        });

        return selectors;
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

    function updateTooltipPosition(element = null, selectorValue = '') {
        if (element === null) {
            nwTooltip.style.top = '0px';
            nwTooltip.style.left = '0px';
            nwTooltip.textContent = '';
            return;
        }

        // TODO: Should check if tootltip position is out of window
        const rect = element.getBoundingClientRect();
        nwTooltip.style.top = rect.top + window.pageYOffset + 'px';
        nwTooltip.style.left = rect.right + window.pageXOffset + 10 + 'px';
        // removing css class which is added to highlight the text
        //selectorValue = selectorValue.replace(highlightClassName, '');
        nwTooltip.textContent = selectorValue;
        return;
    }
    
})();