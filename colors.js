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

const getElements = (color, key, div, container) => {
    return {
        color: color,
        divColor: div,
        colorsKey: key,
        container: container
    };
}

const toggleClass = (element, classes = [], option) => {
    if (!element || classes.length < 1) {
        return;
    }

    for (const cssClass of classes) {
        const pattern = /div.+/g;

        if (pattern.test(cssClass)) {
            console.log('Setting color class', cssClass);
            element.classList.add(cssClass);
            continue;
        }

        switch (String(option)) {
            case '+':
            case 'show':
                console.log('Adding class ' + cssClass, '\nOption: ', option);
                element.classList.add(cssClass);
                break;
            case '-':
            case 'hide':
                console.log('Removing class ' + cssClass, '\nOption: ', option);
                element.classList.remove(cssClass);
                break;
            case '*':
            case 'toggle':
                console.log('Toggling class ' + cssClass);
                element.classList.toggle(cssClass);
                break
            default:
               console.error('option must be +/show or -/hide \nFuck you');
        }
    }
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

    let index = 0;
    for (let div of divs) {
        const list = Array.of(div.classList);
        if (index === 0) {
            if (list.length === 3) {
                toggleClass(div, Array.of('show'), '-');
            }
            toggleClass(div, Array.of('hide'), '+'); // hidden by default
            console.log('%cfirst index ', 'color: red');
            console.log('\n' + list);

        } else {
            div.style.backgroundColor = getColor(key, index);
            checkColor(key, div);
            div.style.borderRadius = '5px';
            div.style.padding = '5px';
            div.style.height = '30px';
            div.style.cursor = 'pointer';
            console.log('%cincludes hide:  ' + (list.toString().includes('hide')) + ' and show: ' + (list.toString().includes('show')) + '.\nRemoving hide ', 'color: red');
            console.log('\n' + list);
            if (list.toString().includes('hide') && !list.toString().includes('show')) {
                toggleClass(div, Array.of('hide'), '*');
            } else {
                toggleClass(div, Array.of('show'), '*');
            }

            div.style.justifyContent = 'center';
            div.style.alignItems = 'center';
            div.style.margin = '1em';
            const p = createParagraph(key, index);
            div.appendChild(p);
        }
        index++;
    }
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

const setAttributes = (elements, exists = false) => {
    let button;
    let colorSetup = elements.divColor.classList.toString().includes(elements.colorsKey);

    if (!colorSetup) {
        toggleClass(elements.divColor, Array.of('div' + elements.colorsKey), '+');
        console.log('Setting color class', elements.divColor.classList);
        colorSetup = true;
    }

    if (!exists) {
        toggleClass(elements.divColor, Array.of('show'), '*');
        button = createButton(elements.color, elements.colorsKey);
        button.addEventListener('click', () => {
            addListener(elements.color, elements.colorsKey);
        });
        elements.container.appendChild(button);
    } else {
        if (!elements.divColor) {
            elements.divColor = document.createElement('div');
        }
        toggleClass(elements.divColor, Array.of('hide'), '*');
    }
    elements.container.appendChild(elements.divColor);
    waitForElm('#button' + elements.colorsKey).then(() => {
        button.addEventListener('click', () => {
            addListener(elements.color, elements.colorsKey);
        });
    });
}

const hideDivs = (divs, key) => {
    divs.forEach((div) => {
        try{
            if (div.classList.toString().includes('show')) {
                toggleClass(div, Array.of('hide'), '*');
                toggleClass(div, Array.of('show'), '*');
                console.log('flex');
            }
        } catch(e) {
            // wtf its happening
            console.log('Error:\n' + e, '\ndiv:' + div);
            toggleClass(div, Array.of('hide'), '*');
            toggleClass(div, Array.of('show'), '*');
        }
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
        const divs = document.querySelectorAll('.div' + key);
        // hide all divs to avoid weird behaviour
        hideDivs(Array.of(divs), key);
        console.log(Array.of(divs));
        div = divs[0];
        container = document.getElementsByClassName('container' + key)[0];
    } else {
        div = document.createElement('div');
        container = document.createElement('div');
        toggleClass(container, Array.of('show'), '+');
    }

    const elements = getElements(color, key, div, container);

    setAttributes(elements, exists);
    form.reset();
    console.log ('Color added: ' + getColor(key, colors[key].length - 1) + '\nDictionary updated: ' + JSON.stringify(colors, null, '\t'));
};

const addButtons = () => {
    const main = document.getElementById('main');
    const div = document.createElement('div')
    div.setAttribute('class', 'colors');
    for (let colorsKey in colors) {
        const firstColor = colors[colorsKey][0];
        const divColor = document.createElement('div');
        const container = document.createElement('div');
        container.setAttribute('class', 'container' + colorsKey);
        const elements = getElements(firstColor, colorsKey, divColor, container);
        console.log(elements);
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

// start
window.onload = addButtons;
