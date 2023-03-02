/*
v2.0.0
now each key has an array to add more colors to the same key
todo check colors and add to existing array if it matches
 */
const defaultColor = '#ffffff';
const defaultBorder = '1px solid #000000';
const colors = {
    white: [defaultColor],
    black: ['#000000'],
    red: ['#ff0000'],
    green: ['#00ff00'],
    blue: ['#0000ff'],
    violet: ['#ba55d3'],
};
const show = 'show', hide = 'hide';

'use es2019';
'use strict';

const showDiv = (div, key = null) => {
    div.classList.add(show);
    if (div.classList.contains(hide)) {
        div.classList.remove(hide);
    }
};

const hideDiv = (div, key = null) => {
    div.classList.add(hide);
    if (div.classList.contains(show)) {
        div.classList.remove(show);
    }
};

const showAllDivs = (divs, key = null, size) => {
    for (let index = 0; index < size; index++) {
        showDiv(divs[index]);
    }
};

const hideAllDivs = (divs, key = null, size) => {
    for (let index = 0; index < size; index++) {
        hideDiv(divs[index]);
    }
};
const getElements = (color, key, div, container, lenght) => {
    return {
        color: color,
        divColor: div,
        colorsKey: key,
        container: container,
        lenght: lenght
    };
};

const toggleClass = (element, className) => {
    if (!element) {
        return;
    }

    if (className !== show && className !== hide) {
        element.classList.add(className);
    } else {
        element.classList.toggle(className === hide ? hide : show);
    }
};

const toggleMultipleClasses = (element, classes) => {
    for (const cssClass of classes) {
        element.classList.toggle(cssClass);
    }
};

const getColor = (key, index) => {
    try {
        return colors[key][index];
    } catch (error) {
        return defaultColor;
    }
};

const createButton = (color, key) => {
    const button =  document.createElement('button');
    button.id = 'button-' + key;
    button.style.backgroundColor = color;
    button.innerHTML = key;
    return button;
};

const createParagraph = (key, index = 0) => {
    let p = document.getElementById('p-' + key + '-' + (index + 1));
    if (!p) {
        p = document.createElement('p');
        p.id = 'p-' + key + '-' + (index + 1);
    }
    p.innerHTML = key + '-' + (index + 1);
    p.classList.add('p-color');

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
    const p = createParagraph(elements.colorsKey, index);
    elements.divColor.appendChild(p);
    elements.container.appendChild(elements.divColor);
};

const addListener = (elements, event) => {
    event.stopImmediatePropagation();
    const divs = document.querySelectorAll('.div-' + elements.colorsKey);
    const size = Array.from(divs).length;
    for (let index = 0; index < size; index++) {
        const div = divs[index];
        const list = Array.from(div.classList).toString();
        console.log(list);
        setDivProperties(elements);
    }
};

const setAttributes = (elements, exists = false) => {
    let button;
    if (!exists) {
        toggleClass(elements.divColor, 'div-' + elements.colorsKey);

        button = createButton(elements.color, elements.colorsKey);
        button.addEventListener('click', (e) => {
            addListener(elements, e);
        });
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

    let div, container = null;
    let exists = false;
    const form = document.getElementById('addColor');
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
        hideAllDivs(divs, key, divs.length);
        div = divs[0];
        container = document.querySelector('#container-' + key)
    } else {
        div = document.createElement('div');
        container = document.createElement('div');
    }
    container.appendChild(div);

    const elements = getElements(color, key, div, container, (colors[key].length - 1));
    setDivProperties(elements);
    setAttributes(elements, exists);
    form.reset();
};

const addButtons = () => {
    const div = document.createElement('div');
    const formSection = document.querySelector('#button-section');
    div.classList.add('colors', 'flex-container');
    for (let colorsKey in colors) {
        const firstColor = colors[colorsKey][0];
        const divColor = document.createElement('div');
        const container = document.createElement('div');
        container.id = 'container-' + colorsKey;
        const elements = getElements(firstColor, colorsKey, divColor, container, (colors[colorsKey].length - 1));
        setAttributes(elements);

        formSection.appendChild(div);
        formSection.appendChild(container);
        div.appendChild(container);
        const form = document.querySelector('#addColor')
        form.addEventListener('submit', addColor);
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
    //add the buttons
    addButtons();
//    every single div might be useful but probably not
    const allDivs = document.querySelectorAll('div');
    //get all the containers
    const containers = document.querySelectorAll('.colors > div');

    // display containers and divs
    showAllDivs(containers, containers.length);
    showAllDivs(allDivs, allDivs.length);
    //add listener to buttons
    const buttons = document.querySelectorAll('button');

    for (let i = 0; i < buttons.length; i++) {
        const button = buttons[i];
        button.addEventListener('click', (e) => {
            const divs = document.querySelectorAll('.div-colored');
            for (let index = 0; index < divs.length; index++) {
                const div = divs[index];
                hideDiv(div)
                toggleClass(show);
                toggleClass(hide);
            }
        });
    }
};

window.onload = initialize;
