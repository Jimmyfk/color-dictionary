/*
v2.1.0
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
    red: ['#ff0000'],
    green: ['#00ff00'],
    blue: ['#0000ff'],
    violet: ['#ba55d3', '#7d02c7'],
};

let colorEntries = Object.entries(colors);

const Element = class element {
    color;
    key;
    divColor;
    container;
    index;
    buttons;
    selector;
    length;
    divs;
    visible;

    constructor(color, key, div, container, index, buttons, selector, length, divs, visible, ...args) {
        if (index === undefined) {
            index = [...div.parentElement.children].indexOf(div);
        }
        this.color = color === undefined ? constants.defaultColor : color;
        this.key = key === undefined ? constants.defaultKey : key;
        this.divColor = div === undefined ? createElement('div') : div;
        this.container = container === undefined ? createElement('div') : container;
        this.index = index;
        this.buttons = (buttons === undefined || typeof(buttons) !== 'object') ? [] : buttons;
        this.selector = selector === undefined? '' : selector;
        this.length = length === undefined? 0 : length;
        this.divs = divs === undefined ? [] : divs;
        this.visible = !visible ? false : visible;

        for (const arg of args) {
           this.arg = arg;
        }
    };

    static createEmptyObject() {
        return new Element();
    };

    get color() {
        return this.color;
    };

    get key() {
        return this.key;
    };

    get divColor() {
        return this.divColor;
    };

    get container () {
        return this.container;
    };

    get index() {
        return this.index;
    };

    get buttons() {
        return this.buttons;
    };

    get all() {
        return this;
    };

    pushButton(button) {
        this.buttons.push(button);
    };

    set x(obj) {
        const any = obj.key;
        this.any = obj.value;
    };
};

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
    console.log(elements);
    const pId = 'p-' + elements.key + '-' + elements.index;
    const attributes = {
        'id': pId,
        'class': 'p-color',
    };
    const text = 'p-' + elements.key + '-' + (elements.index + 1);
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
        console.log(mSelector, multipleSelectors);
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

const setDivProperties = (elements) => {
        const index = elements.index;
        const div = elements.divs[index];
        div.style.backgroundColor = elements.color;
        addClass(div, 'div-colored ' + elements.key);
        div.id = 'div-' + elements.key + '-' + index;
        createParagraph(elements);
        elements.container.appendChild(div);
        hideElem(div);
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
    let button;

    if (!exists) {
        addClass(elements.divColor, 'div-' + elements.key);
        button = createButton(elements);
        elements.buttons.push(button);
        elements.container.insertBefore(button, elements.container.firstChild);
    }
    waitForElm('#button-' + elements.key).then(() => {
        button.addEventListener('click', (e) => {
            addListener(elements, e);
        });
    });
};


const addColor = (event, elements) => {
    event.preventDefault();
    const calledBy = event.target;
    let div, container = null;
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

    // check if the color exists
    if (colors[key].length >= 1) {
        exists = true;
        const divs = document.querySelectorAll('.div-' + key);
        // hide all divs to avoid weird behaviour
        hideAllElements(divs);
        div = divs[0];
        container = document.querySelector('#container-' + key)
    } else {
        div = createElement('div');
        container = createElement('div');
    }
    container.appendChild(div);
    setDivProperties(elements);
    setAttributes(elements, exists);
    form.reset();
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const addElements = async () => {
    const div = createElement('div', {'class': 'colors flex-container'});
    const buttonSection = document.querySelector('#button-section');
    let color, divColor, elements, container = undefined, divs;
    for (const key in colors) {
        for (let index = 0; index < colors[key].length; index++) {
            divs = [];
            const divBG = createElement('div');
            divs.push(divBG);
            console.log('div pushed: ' + JSON.stringify(div) + '\nArray: ' + JSON.stringify(divs));
            container = createElement('div', {'id': 'container-' + key});
            color = getColor(key, index);
            divColor = createElement('div');
            elements = new Element(color, key, divColor, container, index, undefined, '', colors[key].length,
                divs);
            await sleep(1000);
            setDivProperties(elements);
            setAttributes(elements);
        }
        buttonSection.appendChild(div);
        buttonSection.appendChild(container);
        div.appendChild(container);
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
    const elements = addElements();
    //get all the containers
    const containers = document.querySelectorAll('.colors > div');

    //add the form listener
    const form = document.querySelector('#addColor');
    form.addEventListener('submit', (event) => {
        addColor(event, elements);
    });

    // display containers
    showAllElements(containers);
};

window.onload = initialize;
