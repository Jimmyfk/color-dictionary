/*
v2.0.0
now each key has an array to add more colors to the same key
todo check colors and add to existing array if it matches
 */
const constants = {
    defaultColor: '#ffffff',
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
const getElementsObject = (color, key, div, container, index = undefined) => {
  if (index === undefined) {
        index = [...div.parentElement.children].indexOf(div);
    }

    return {
        color: color,
        divColor: div,
        colorsKey: key,
        container: container,
        index: index,
    };
};

const addClass = (element, className) => {
    if (!element) {
        return;
    }
    if (className !== constants.show && className !== constants.hide) {
        element.classList.add(className);
    }
};

const classToggle = (el, ...args) => args.map(e => el.classList.toggle(e))

const toggleShow = (element) => {element.classList.toggle(constants.show)};
const toggleHide = (element) => {element.classList.toggle(constants.hide)};

const getColor = (key, index) => {
    try {
        return colors[key][index];
    } catch (error) {
        return constants.defaultColor;
    }
};

const createButton = (elements) => {
    const button =  document.createElement('button');
    button.id = 'button-' + elements.colorsKey + '-' + elements.index ;
    button.style.backgroundColor = elements.color;
    button.innerHTML = elements.colorsKey + constants.space + (elements.index + 1);

    button.addEventListener('click', (e) => {
        addListener(elements, e);
    });

    return button;
};

const createParagraph = (key, index = 0) => {
    const pId = '#p-' + key + '-' + index;
    let p = document.querySelector(pId);
    if (!p) {
        p = document.createElement('p');
        p.id = pId;
    }
    p.innerHTML = key + '-' + (index + 1);
    addClass(p, 'p-color');

    return p;
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
    elements.divColor.style.backgroundColor = elements.color;
    elements.divColor.classList.add('div-colored');
    elements.divColor.id = 'div-' + elements.colorsKey + '-' + elements.index;
    const p = createParagraph(elements.colorsKey, elements.index);
    elements.divColor.appendChild(p);
    elements.container.appendChild(elements.divColor);
};

const addListener = (elements, event) => {
    event.stopImmediatePropagation();
    setDivProperties(elements);
    const target = event.target;
    const divs = document.querySelectorAll('.div-' + elements.colorsKey);
    const size = Array.from(divs).length;
    for (let index = 0; index < size; index++) {
        const div = divs[index];
        const list = Array.from(div.classList).toString();
        console.log(list);
    }
};

const setAttributes = (elements, exists = false) => {
    let button;

    if (!exists) {
        addClass(elements.divColor, 'div-' + elements.colorsKey);

        button = createButton(elements);

        elements.container.appendChild(button);
    }
    waitForElm('#button-' + elements.colorsKey).then(() => {
        button.addEventListener('click', (e) => {
            addListener(elements, e);
        });
    });
};


const addColor = event => {
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
        div = document.createElement('div');
        container = document.createElement('div');
    }
    container.appendChild(div);
    const elements = getElementsObject(color, key, div, container);
    setDivProperties(elements);
    setAttributes(elements, exists);
    form.reset();
};

const addElements = () => {
    const div = document.createElement('div');
    const divColor = document.createElement('div');
    const buttonSection = document.querySelector('#button-section');
    div.classList.add('colors', 'flex-container');
    for (let colorsKey in colors) {
        const container = document.createElement('div');
        container.id = 'container-' + colorsKey;
        for (let index = 0; index < colors[colorsKey].length; index++) {
            const color = getColor(colorsKey, index);
            const divColor = document.createElement('div');
            const elements = getElementsObject(color, colorsKey, divColor, container, index);
            setAttributes(elements);
        }
        buttonSection.appendChild(div);
        buttonSection.appendChild(container);
        div.appendChild(container);
    }
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
    for (let colorsKey in colors) {
        // check if the color exists
        exist = colorExists(colorsKey, color);
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
    //get all the containers
    const containers = document.querySelectorAll('.colors > div');

    //add the form listener
    const form = document.querySelector('#addColor');
    form.addEventListener('submit', addColor);

    // display containers
    showAllElements(containers);

    //add listener to buttons
    const buttons = document.querySelectorAll('button');
    for (let i = 0; i < buttons.length; i++) {
        const button = buttons[i];
        const altIndex = [...button.parentElement.children].indexOf(button);
        console.log('Iterando... Index = ' + i + '\nButton: ', button.outerHTML + '\nindexOf: ' + altIndex);
        button.addEventListener('click', (e) => {
            const divs = document.querySelectorAll('.div-colored');
            for (let index = 0; index < divs.length; index++) {
                const div = divs[index];
                hideElem(div);
                toggleShow(div);
                toggleHide(div);
            }
        });
    }
};

window.onload = initialize;
