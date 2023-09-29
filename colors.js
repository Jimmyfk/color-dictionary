/*
v2.1.1
now each key has an array to add more colors to the same key
todo check colors and add to existing array if it matches
 */
const constants = {
    defaultColor: '#ffffff',
    defaultKey: 'white',
    show: 'show',
    hide: 'hide',
    space: ' ',
};
const colors = {
    white: [constants.defaultColor],
    black: ['#000000'],
    red: ['#ff0000', 'darkred', 'crimson'],
    green: ['#00ff00'],
    blue: ['#0000ff'],
    violet: ['#ba55d3', '#7d02c7'],
};

const data = {
    white: [],
    black: [],
    red: [],
    green: [],
    blue: [],
    violet: [],
}

let colorEntries = Object.entries(colors);

const insertAfter = (referenceNode, newNode) => {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

const createElement = (element, attribute, inner, parent) => {
    if (typeof(element) === "undefined") {
        return false;
    }

    if (typeof(inner) === "undefined") {
        inner = "";
    }

    if (typeof(parent) === "undefined") {
        parent = '';
    }

    const el = document.createElement(element);

    if (typeof(attribute) === 'object') {
        for (const key in attribute) {
            el.setAttribute(key, attribute[key]);
        }
    }

    if (!Array.isArray(inner)) {
        inner = [inner];
    }

    for (let k = 0; k < inner.length; k++) {
        if (inner[k].tagName) {
            el.appendChild(inner[k]);
        } else {
            el.appendChild(document.createTextNode(inner[k]));
        }
    }

    if (!!parent) {
        if (parent.children.length === 0) {
            parent.appendChild(el);
        }
    }

    return el;
};

const showElem = (element) => {
    element.classList.add(constants.show);
    if (element.classList.contains(constants.hide)) {
        element.classList.remove(constants.hide);
    }
};

const hideElem = (element) => {
    element.classList.add(constants.hide);
    if (element.classList.contains(constants.show)) {
        element.classList.remove(constants.show);
    }
};

const showAllElements = (elements) => {
    for (let index = 0; index < elements.length; index++) {
        showElem(elements[index]);
    }
};

const hideAllElements = (elements) => {
    for (let index = 0; index < elements.length; index++) {
        hideElem(elements[index]);
    }
};

const collapseColoredDivs = () => {
    const divs = document.querySelectorAll('.div-colored');
    hideAllElements(divs);
};

const addClass = (element, className) => {
    if (!element) {
        return;
    }
    if (className !== constants.show && className !== constants.hide) {
        const cClass = Array.from(className.split(' '));
        for (let i = 0; i < cClass.length; i++) {
            element.classList.add(cClass[i].toString());
        }
    }
};


const getColor = (key, index, element = undefined) => {
    try {
        return colors[key][index];
    } catch (error) {
        try {
            return element;
        } catch (error) {
            return constants.defaultColor;
        }
    }
};

const createButton = (elements) => {
    const button =  createElement('button', {
        'id': 'button-' + elements.key + '-' + elements.index,
        'style': 'background-color: ' + elements.color,
    }, elements.key + constants.space + (elements.index + 1));

    button.addEventListener('click', (e) => {
        addListener(elements, e);
    });

    return button;
};

const createParagraph = (elements) => {
    const pId = 'p-' + elements.key + '-' + elements.index;
    const attributes = {
        'id': pId,
        'class': 'p-color',
    };
    const text = elements.key + ' ' + (elements.index + 1);
    createElement('p', attributes, text, elements.divs[elements.index]);
};

const waitForElm = (selector, multipleSelectors = []) => new Promise(resolve => {
    if (selector && selector.length > 0) {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }
    }

    let mSelector;
    if (multipleSelectors && multipleSelectors.length > 0) {
        mSelector = multipleSelectors.join(' ');
        if (document.querySelectorAll(mSelector)) {
            return resolve(document.querySelectorAll(mSelector));
        }
    }

    const observer = new MutationObserver(() => {
        if (document.querySelector(selector)) {
            resolve(document.querySelector(selector));
            observer.disconnect();
        }

        if (document.querySelectorAll(mSelector)) {
            resolve(document.querySelectorAll(mSelector));
            observer.disconnect();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
});

const setDivProperties = (elements, comesFromForm = false) => {
    const index = elements.index;
    const div = elements.divs[index];
    if (!comesFromForm) {
        addClass(div, 'div-colored ' + elements.key);
        div.id = 'div-' + elements.key + '-' + index;
        hideElem(div);
        div.style.backgroundColor = elements.color;
    }

    createParagraph(elements);
};

const addListener = (elements, event) => {
    event.stopImmediatePropagation();
    const key = elements.key;
    const index = elements.index;
    const div = document.querySelector('#div-' + key + '-' + index);

    if (div.classList.contains(constants.hide)) {
        showElem(div);
    } else if (div.classList.contains(constants.show)) {
        hideElem(div);
    }
};

const setAttributes = (elements, exists = false) => {
    const button = createButton(elements);
    elements.buttons.push(button);
    const lastButton = document.querySelector('#button-' + elements.key + '-' + (elements.index - 1));

    if (!lastButton) {
        elements.buttonContainer.appendChild(button);
    } else {
        insertAfter(lastButton, button);
    }

    waitForElm('#button-' + elements.key + '-' + elements.index).then(() => {
        button.addEventListener('click', (e) => {
            addListener(elements, e);
        });
    });
};


const addColor = (event) => {
    event.preventDefault();
    const bContainer = document.querySelector('.buttons.flex-container');
    const dContainer = document.querySelector('.divs.flex-container');
    if (!bContainer || !dContainer) {
        return;
    }
    let exists = false;
    const form = document.querySelector('#addColor');

    // todo add constraints
    if (!form.checkValidity()) {
        form.reset();
        return;
    }

    if (!form.color.value || !form.name.value) {
        form.reset();
        return;
    }

    const color = form.color.value;
    const key = form.name.value;

    if (!addColorObj(color, key)) {
        form.reset();
        return;
    }
    const index = colors[key].length - 1;

    const div = createElement('div', {
        'id': 'div-' + key + '-' + index,
        'class': 'div-colored ' + key + ' hide',
        'style': 'background-color: ' + color,
    });

    // check if the color exists
    if (colors[key].length >= 1) {
        exists = true;
        const divs = document.querySelectorAll('.div-colored.show' + key);
        // hide all divs to avoid weird behaviour
        hideAllElements(divs);
    }
    const divs = document.querySelectorAll('div .' + key);
    const last = divs[divs.length - 1];

    insertAfter(last, div);
    const elements = CustomElement.createFullElement(color, key, div, bContainer, dContainer, null, index);
    data[key].push(elements);
    elements.divs[index] = div;
    setDivProperties(elements, true);
    setAttributes(elements, exists);
    form.reset();
};

const createDivs = (elements) => {
    const container = elements.divContainer;
    const index = elements.index;
    const div = createElement('div', {
        'id': + 'div-' + elements.key + '-' + index,
        'class': 'div-colored ' + elements.key,
    });
    elements.divs[index] = div;
    container.appendChild(div);
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const addElements = () => {
    const divB = createElement('div', {'class': 'buttons flex-container'});
    const divD = createElement('div', {'class': 'divs flex-container'});
    const buttonSection = document.querySelector('#button-section');
    buttonSection.appendChild(divB);
    const colorSection = document.querySelector('#div-section');
    colorSection.appendChild(divD);
    let color, divColor, elements;
    for (const key in colors) {
        for (let index = 0; index < colors[key].length; index++) {
            color = getColor(key, index);
            divColor = createElement('div');
            elements = CustomElement.createFullElement(color, key, divColor, divB, divD, null, index, undefined, '', colors[key].length, undefined, false,
                buttonSection, colorSection);
            data[key].push(elements);
            createDivs(elements);
            setDivProperties(elements);
            setAttributes(elements);
        }
    }
    return elements;
};

const colorExists = (key, color) => {
    try {
        return colors[key].includes(color);
    } catch (error) {
        return false;
    }
};

const addColorObj = (color, key) => {
    let exist = false;
    for (let key in colors) {
        // check if the color exists
        exist = colorExists(key, color);
        if (exist) {
            break;
        }
    }

    if (exist) {
        return false;
    }

    // if the color key doesn't exist, initialize new array
    if (!colors[key]) {
        colors[key] = [];
    }

    colors[key].push(color);
    return true;
};

// stackOverflow functions
const hexToRgb = hex =>
    hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i
        ,(m, r, g, b) => '#' + r + r + g + g + b + b)
        .substring(1).match(/.{2}/g)
        .map(x => parseInt(x, 16));

const rgbToHex = (r, g, b) => '#' + [r, g, b]
    .map(x => x.toString(16).padStart(2, '0')).join('');

// start
const initialize = () => {
    //add elements
    addElements();
    // get containers
    const bContainers = document.querySelectorAll('.button-container');
    const dContainers = document.querySelectorAll('.div-container');

    const collapseButton = document.querySelector('#collapse-button');
    collapseButton.addEventListener('click', (event) => {
        collapseColoredDivs();
    });

    //add the form listener
    const form = document.querySelector('#addColor');
    form.addEventListener('submit', (event) => {
        addColor(event);
    });

    // display containers
    showAllElements([bContainers, dContainers]);
};

window.onload = initialize;
