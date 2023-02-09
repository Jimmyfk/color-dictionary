/*
first version, simple dictionary
 */

const defaultColor = '#ffffff';
const defaultBorder = '1px solid #000000';
const colors = {
    white: defaultColor,
    black: '#000000',
    red: '#ff0000',
    green: '#00ff00',
    blue: '#0000ff',
    violet: '#ba55d3',
}

function getColor(color) {
    return colors[color] ?? defaultColor;
}

function checkColor(colorsKey, element) {
    if (colorsKey === 'white') {
        element.style.color = getColor('black');
        element.style.border = defaultBorder;
    } else {
        element.style.color = getColor('white');
        element.style.border = 'none';
    }
}

function createButton(color, key) {
    const button =  document.createElement('button');
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
}

function cretateParagraph(key) {
    let p = document.getElementById('p' + key);
    if (!p) {
        p = document.createElement('p');
        p.setAttribute('id', 'p' + key);
    }
    p.innerHTML = key;
    p.style.fontFamily = 'Helvetica, non-serif';

    return p;
}

function addListener(color, key, div) {
    if (div.style.display === 'flex') {
        div.style.display = 'none';
    } else {
        div.style.backgroundColor = color;
        checkColor(key, div);
        div.style.borderRadius = '5px';
        div.style.padding = '5px';
        div.style.height = '30px';
        div.style.cursor = 'pointer';
        div.style.display = 'flex';
        div.style.justifyContent = 'center';
        div.style.alignItems = 'center';
        const p = cretateParagraph(key);
        div.appendChild(p);
    }
}
function setAttributes(elements){
    elements.divColor.setAttribute('class', elements.colorsKey);
    const button = createButton(elements.color, elements.colorsKey);

    button.addEventListener('click', () => {
        addListener(elements.color, elements.colorsKey, elements.divColor);
    });

    elements.container.appendChild(button);
    elements.container.appendChild(elements.divColor);
}

function addButtons() {
    const main = document.getElementById('main');
    const div = document.createElement('div')
    div.setAttribute('class', 'colors');
    for (let colorsKey in colors) {
        const color = colors[colorsKey];
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
}

function addColorObj(color, key) {
    let exist = false;
    for (let colorsKey in colors) {
        if (colorsKey === key || colors[colorsKey] === color) {
            exist = true;
            console.log('colors key: ' + colorsKey + '\ncolor: ' + colors[colorsKey] + '\nexists: ' + (exist ?  'yes' : 'no'));
            break;
        }
    }
    if (exist) {
        return false;
    }
    colors[key] = color;
    return true
}

function addColor(event) {
    event.preventDefault();
    const form = document.getElementById('addColor');
    if (!form.checkValidity()) {
        return;
    }

    if (!form.color.value || !form.name.value) {
        return;
    }

    const color = form.color.value;
    const key = form.name.value;
    if (!addColorObj(color, key)) {
        form.reset();
        return;
    }
    const div = document.createElement('div');
    const container = document.createElement('div');
    container.setAttribute('class', 'container' + key);
    const elements = {
        color: color,
        divColor: div,
        colorsKey: key,
        container: container
    }
    setAttributes(elements);
    document.getElementById('main').appendChild(container);
    form.reset();
    console.log ('Color added: ' + getColor(key) + '\nDictionary updated: ' + JSON.stringify(colors, null, '\t'));
}

const hexToRgb = hex =>
    hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i
        ,(m, r, g, b) => '#' + r + r + g + g + b + b)
        .substring(1).match(/.{2}/g)
        .map(x => parseInt(x, 16))

const rgbToHex = (r, g, b) => '#' + [r, g, b]
    .map(x => x.toString(16).padStart(2, '0')).join('')

addButtons();
