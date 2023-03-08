const CustomElement = class Element {
    static #newElement = param => document.createElement(param);
    #color;
    #key;
    #divColor;
    #buttonContainer;
    #divContainer;
    #containers;
    #index;
    #buttons;
    #selector;
    #length;
    #divs;
    #visible;

    constructor(color, key, div,bContainer, dContainer, containers, index, buttons, selector, length, divs, visible, ...args) {
        if (index === undefined) {
            index = [...div.parentElement.children].indexOf(div);
        }
        this.#color = color === undefined ? constants.defaultColor : color;
        this.#key = key === undefined ? constants.defaultKey : key;
        this.#divColor = div === undefined ? Element.#newElement('div') : div;
        this.#buttonContainer = bContainer === undefined ? Element.#newElement('div') : bContainer;
        this.#divContainer = dContainer === undefined ? Element.#newElement('div') : dContainer;
        this.#containers = !!this.#buttonContainer && !!this.#divContainer  ? Array.of(bContainer, dContainer) : [Element.#newElement('div'), Element.#newElement('div')];
        this.#index = index;
        this.#buttons = (buttons === undefined || typeof(buttons) !== 'object') ? [] : buttons;
        this.#selector = selector === undefined? '' : selector;
        this.#length = length === undefined? 0 : length;
        this.#divs = divs === undefined ? [] : divs;
        this.#visible = !visible ? false : visible;
    };

    static createEmptyObject() {
        return new Element();
    };

    static createElementDiv(divs) {
        return new Element(divs);
    };

    static createFullElement(color, key, div, bContainer, dContainer, container, index, buttons, selector, length, divs, visible,...args) {
        return new Element(color, key, div, bContainer, dContainer, container, index, buttons, selector, length, divs, visible,...args);
    };

    get color() {
        return this.#color;
    };

    get key() {
        return this.#key;
    };

    get divColor() {
        return this.#divColor;
    };

    get containers () {
        return this.#containers;
    };

    get index() {
        return this.#index;
    };

    get buttons() {
        return this.#buttons;
    };

    get selector() {
        return this.#selector;
    };

    get divs() {
        return this.#divs;
    };

    get all() {
        return this;
    };

    get divContainer() {
        return this.#divContainer;
    }

    get buttonContainer() {
        return this.#buttonContainer;
    }

    pushButton(button) {
        this.#buttons.push(button);
    };

    set x(obj) {
        const any = obj.key;
        this.any = obj.value;
    };
};

const Color = class Color {
    name;
    key;
    value = ColorValue.createDefault();
};

const ColorValue = class ColorValue {
    static #default = ColorValue.createDefault();
    #hex;
    #shortHex;
    #rgb;
    #rgba;
    #cssName;
    #customName;

    constructor() {

    };

    static createDefault() {
        const instance = new ColorValue();
        instance.#hex = '#ffffff';
        instance.#rgb = [255, 255, 255];
        instance.#cssName = instance.#customName = 'white';
        return instance;
    };

    static #createEmpty() {
        return new ColorValue();
    };

    static create(hex, rgb, cssName, customName) {
        const instance = ColorValue.#createEmpty();
        instance.#hex = hex;
        instance.#rgb = rgb;
        instance.#cssName  = cssName;
        instance.#customName = customName;
        return instance
    };

    static createWithBasicFormat(hex, rgb, cssName) {
        const instance = ColorValue.#createEmpty();
        instance.#hex = hex;
        instance.#rgb = rgb;
        instance.#cssName = cssName;
        return instance;
    };

    get hex() {
        return this.#hex;
    };

    get shortHex() {
        return this.#shortHex;
    };

    get rgb() {
        return this.#rgb;
    };

    get rgba() {
        return this.#rgba;
    };

    get cssName() {
        return this.#cssName;
    };

    get customName() {
        return this.#customName;
    };

    set hex(hex) {
        this.#hex = hex;
    };

    set shortHex(shortHex) {
        this.#shortHex = shortHex;
    }

    set rgb(rgb) {
        this.#rgb = rgb;
    };

    set rgba(rgba) {
        this.#rgba = rgba;
    };

    set cssName(cssName) {
        this.#cssName = cssName;
    };

    #makeShortHex(hexValue) {
        const error = new TypeError('Cannot convert: ' `${hexValue}`);
        if (hexValue === undefined) {
            let hex = this.#hex.toString();
            switch (this.#hex.length) {
                default: throw error;
                case 7:
                    if (hex.charAt(0) === '#') {
                        hex = hex.substring(1)
                    } else {
                        throw error;
                    }
                    // we removed the # we don't need the break here
                case 6:
                    const regex = /.{2}/g; // any 2 chars
                    const arr = hex.match(regex);// split the string into an array of 2 chars
                    if (arr[0] === arr[1] && arr[0] === arr[2]) {
                        for (let i = 0; i < arr.length; hex = arr[i++].slice(1));
                    }
                    break;

            }
            return hex;
        }
    };
};
