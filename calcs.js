const defaultColor = '#ffffff';

const colors = {
    white: [defaultColor],
    black: ['#000000'],
    red: ['#ff0000'],
    green: ['#00ff00'],
    blue: ['#0000ff'],
    violet: ['#ba55d3'],
}

const defaultBorder = '1px solid #000000';

function getColor(color, index) {
    return colors[color][index] ?? defaultColor;
}

function checkColor(colorsKey, element) {
    if (colorsKey === 'white') {
        element.style.color = getColor('black', 0);
        element.style.border = defaultBorder;
    } else {
        element.style.color = getColor('white', 0);
        element.style.border = 'none';
    }
}

function createButton(color, key) {
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
}

function createParagraph(key) {
    let p = document.getElementById('p' + key + colors);
    if (!p) {
        p = document.createElement('p');
        p.setAttribute('id', 'p' + key);
    }
    p.innerHTML = key;
    p.style.fontFamily = 'Helvetica, non-serif';

    return p;
}

function addListener(color, key, div) {
    div.classList.toggle('active');
    div.style.backgroundColor = color;
    checkColor(key, div);
    div.style.borderRadius = '5px';
    div.style.padding = '5px';
    div.style.height = '30px';
    div.style.cursor = 'pointer';
    div.style.display = div.classList.contains('active') ? 'flex' : 'none';
    div.style.justifyContent = 'center';
    div.style.alignItems = 'center';
    const p = createParagraph(key);
    div.appendChild(p);
}
function setAttributes(elements, exists = false){
    let button;
    if (!exists) {
        elements.divColor.setAttribute('class', elements.colorsKey + 0);
        button = createButton(elements.color, elements.colorsKey);
        elements.container.appendChild(button);
    } else {
        elements.divColor.setAttribute('class', elements.colorsKey + (colors[elements.key] - 1));
        button = document.getElementById('button' + elements.key);
    }
    elements.container.appendChild(elements.divColor);
    button.addEventListener('click', () => {
        addListener(elements.color, elements.colorsKey, elements.divColor);
    });
}

function addButtons() {
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
}

function addColorObj(color, key) {
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
    colors[key].push(color);
    return true
}

function colorExists(key, color) {
    if (!colors[key]) {
        colors[key] = new Array(1);
    }
    return colors[key].includes(color);
}

function addColor(event) {
    event.preventDefault();
    let div, container = null;
    let exists = false;
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
    document.getElementById('main').appendChild(container);
    form.reset();
    console.log ('Color added: ' + getColor(key, colors.key.length - 1) + '\nDictionary updated: ' + JSON.stringify(colors, null, '\t'));
}

const hexToRgb = hex =>
    hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i
        ,(m, r, g, b) => '#' + r + r + g + g + b + b)
        .substring(1).match(/.{2}/g)
        .map(x => parseInt(x, 16))

const rgbToHex = (r, g, b) => '#' + [r, g, b]
    .map(x => x.toString(16).padStart(2, '0')).join('')

window.onload = addButtons;
