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
const show = 'show', hide = 'hide';

const showDiv = (div, key = null) => {
    div.classList.add(show);
    if (div.classList.contains(hide)) {
        div.classList.remove(hide)
    }
}

const hideDiv = (div, key = null) => {
    div.classList.add(hide);
    if (div.classList.contains(show)) {
        div.classList.remove(show);
    }
}

const showAllDivs = (divs, key = null) => {
    console.log('show all divs' + divs);
    for (let index = 0; index < divs.length; index++) {
        showDiv(divs[index], key);
    }
}
const hideAllDivs = (divs, key = null) => {
    for (let index = 0; index < divs.length; index++) {
        hideDiv(divs[index], key);
    }
};
const getElements = (color, key, div, container) => {
    return {
        color: color,
        divColor: div,
        colorsKey: key,
        container: container
    };
}

const toggleClass = (element, classes = []) => {
    if (!element || classes.length < 1) {
        return;
    }
    console.log(classes, element);
    for (const cssClass of classes) {
        const pattern = /div.+/g;

        if (pattern.test(cssClass)) {
            element.classList.add(cssClass);
            continue;
        }

       //element.classList.toggle(cssClass);
       element.classList.toggle(cssClass === show ? hide : show);
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

const waitForElm = async (selector, multipleSelectors = []) => new Promise(resolve => {
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

const setDivProperties = (div, color, key, index) => {
    div.style.backgroundColor = getColor(key, index);
    checkColor(key, div);
    div.style.borderRadius = '5px';
    div.style.padding = '5px';
    div.style.height = '30px';
    div.style.cursor = 'pointer';
    div.style.justifyContent = 'center';
    div.style.alignItems = 'center';
    div.style.margin = '1em';
    const p = createParagraph(key, index);
    div.appendChild(p);
}

const addListener = async (color, key, event) => {
    event.stopImmediatePropagation();
    let divs;
    await waitForElm(null, ['.div' + key]).then((p) => {
        divs = Array.from(p);
    });

    for (let index = 0; index < divs.length; index++) {
        const div = divs[index];
        const list = Array.from(div.classList).toString();
        setDivProperties(div, color, key, index);
    }
};

const setAttributes = async (elements, exists = false) => {
    let button;
    if (!exists) {
        toggleClass(elements.divColor, Array.of('div' + elements.colorsKey));
        button = createButton(elements.color, elements.colorsKey);
        button.addEventListener('click', (e) => {
            addListener(elements.color, elements.colorsKey, e);
        });
        elements.container.appendChild(button);

    } else {
        if (!elements.divColor) {
            elements.divColor = document.createElement('div');
        }
    }
    elements.container.appendChild(elements.divColor);
    await waitForElm('#button' + elements.colorsKey).then(() => {
        button.addEventListener('click', (e) => {
            addListener(elements.color, elements.colorsKey, e);
        });
    });
}


const addColor = async event => {
    event.preventDefault();
    event.stopImmediatePropagation();
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
        let divs;
        await waitForElm(null, ['.div' + key]).then((p) => {
            divs = Array.from(p);
        });
        // hide all divs to avoid weird behaviour
        hideAllDivs(divs, key);
        div = divs[0];
        container = document.getElementsByClassName('container' + key)[0];
    } else {
        div = document.createElement('div');
        container = document.createElement('div');
    }
    container.appendChild(div);

    const elements = getElements(color, key, div, container);
    setDivProperties(div, color, key, div.length);
    await setAttributes(elements, exists);
    form.reset();
};

const addButtons =  async () => {
    const div = document.createElement('div');
    const section = document.getElementById('main-section');
    div.setAttribute('class', 'colors');
    for (let colorsKey in colors) {
        const firstColor = colors[colorsKey][0];
        const divColor = document.createElement('div');
        const container = document.createElement('div');
        container.setAttribute('class', 'container' + colorsKey);
        const elements = getElements(firstColor, colorsKey, divColor, container);
        setAttributes(elements);

        section.appendChild(div);
        section.appendChild(container);
        div.appendChild(container);
        let form;
        await waitForElm('#addColor').then((f) => {
            form = f;
        });
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
const initialize = async () => {
    //add the buttons
    await addButtons();
    console.log('Buttons added');
    let divs;
    //get all the divs no matter the color
    await waitForElm(null, ['div']).then((p) => {
        divs =  Array.from(p);
        console.log('divs: ' + divs);
    });

    //get all the containers
    let containers;
    await waitForElm(null, ['container']).then((p) => {
        containers = Array.from(p);
        // display everything
        showAllDivs(containers);
        showAllDivs(divs);
        console.log('Containers: ' + containers);
        console.log('\nDivs: ' + divs);
    });
    //add listener to buttons
    let buttons;
    await waitForElm(null, ['button']).then((p) => {
        buttons =  Array.from(p);
    });
    for (let i = 0; i < buttons.length; i++) {
        const button = buttons[i];
        button.addEventListener('click', async (e) => {
            await waitForElm(null, ['/div.+/']).then((p) => {
                const allDivs = Array.from(p);
                console.log('allDivs: ' + allDivs);
                for (let k = 0; k < allDivs.length; k++) {
                    toggleClass(allDivs[k], ['show']);
                }
            })
        });
    }
}

window.onload = initialize;
