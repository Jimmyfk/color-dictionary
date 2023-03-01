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
}

const getColor = (color, index) => {
    try {
        return colors[color][index];
    } catch (error) {
        return defaultColor;
    }
};

const checkColor = (colorsKey, element) => {
    if (colorsKey === 'white') {
        element.style.color = getColor('black', 0);
        element.style.border = defaultBorder;
    } else {
        element.style.color = getColor('white', 0);
        element.style.border = 'none';
    }
};

const createButton = (color, key) => {
    const button =  document.createElement('button');
    button.setAttribute('id', 'button' + key);
    checkColor(key, button);
    button.style.backgroundColor = color;
    button.innerHTML = key;
    button.style.borderRadius = '5px';
    button.style.padding = '5px';
    button.style.margin = '5px';
    button.style.height = '30px';
    button.style.cursor = 'pointer';
    button.style.width = '5em';
    return button;
};

const createParagraph = (key, index = 0) => {
    let p = document.getElementById('p' + key + index);
    if (!p) {
        p = document.createElement('p');
        p.setAttribute('id', 'p' + key + index);
    }
    // doesn't work with new colors added to an existing key
    p.innerHTML = key + index;
    p.style.fontFamily = 'Helvetica, non-serif';

    return p;
};

const addListener = (color, key) => {
    const divs = document.querySelectorAll('.div' + key);
    console.log(divs, color, key);
    /*
     color fixed, paragraph not working on new colors added to an existing key
     div is acting weird, need fix
     */
    let index = 0;
    for (let div of divs) {
        if (div.style.display === 'flex') {
            div.style.display = 'none';
        } else {
            div.style.backgroundColor = getColor(key, index);
            checkColor(key, div);
            div.style.borderRadius = '5px';
            div.style.padding = '5px';
            div.style.height = '30px';
            div.style.cursor = 'pointer';
            div.style.display = 'flex';
            div.style.justifyContent = 'center';
            div.style.alignItems = 'center';
            div.style.margin = '1em';
            const p = createParagraph(key, index);
            div.appendChild(p);
        }
        index++;
    }
};
const setAttributes = (elements, exists = false) => {
    let button;
    if (!exists) {
        elements.divColor.setAttribute('class','div' + elements.colorsKey);
        button = createButton(elements.color, elements.colorsKey);
        button.addEventListener('click', () => {
            addListener(elements.color, elements.colorsKey);
        });
        elements.container.appendChild(button);
    } else {
        if (!elements.divColor) {
            elements.divColor = document.createElement('div');
        }
        elements.divColor.setAttribute('class', 'div' + elements.colorsKey);
    }
    elements.container.appendChild(elements.divColor);
    waitForElm('#button' + elements.key, (elm) => {})
        .then(() => {
            button.addEventListener('click', () => {
                addListener(elements.color, elements.colorsKey);
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
    if (colors[key].length > 1) {
        exists = true;
        div = document.getElementsByClassName(key)[0];
        container = document.getElementsByClassName('container' + key)[0];
    } else {
        div = document.createElement('div');
        container = document.createElement('div');
        container.setAttribute('class', 'container' + key);
    }

    const elements = {
        color: color,
        divColor: div,
        colorsKey: key,
        container: container
    }

    setAttributes(elements, exists);
    form.reset();
    console.log ('Color added: ' + getColor(key, colors[key].length - 1) + '\nDictionary updated: ' + JSON.stringify(colors, null, '\t'));
};

const addButtons = () => {
    const main = document.getElementById('main');
    const div = document.createElement('div')
    div.setAttribute('class', 'colors');
    for (let colorsKey in colors) {
        const color = colors[colorsKey][0];
        const divColor = document.createElement('div');
        const container = document.createElement('div');
        container.setAttribute('class', 'container' + colorsKey);
        const elements = {
            color: color,
            divColor: divColor,
            colorsKey: colorsKey,
            container: container
        };
        setAttributes(elements);

        main.appendChild(container);
        const form = document.getElementById('addColor');
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

function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

// start
window.onload = addButtons;
