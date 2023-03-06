const CustomElement = class Element {
    static #newElement = param => document.createElement(param);
    color;
    key;
    divColor;
    buttonContainer;
    divContainer;
    containers;
    index;
    buttons;
    selector;
    length;
    divs;
    visible;

    constructor(color, key, div,bContainer, dContainer, containers, index, buttons, selector, length, divs, visible, ...args) {
        if (index === undefined) {
            index = [...div.parentElement.children].indexOf(div);
        }
        this.color = color === undefined ? constants.defaultColor : color;
        this.key = key === undefined ? constants.defaultKey : key;
        this.divColor = div === undefined ? Element.#newElement('div') : div;
        this.buttonContainer = bContainer === undefined ? Element.#newElement('div') : bContainer;
        this.divContainer = dContainer === undefined ? Element.#newElement('div') : dContainer;
        this.containers = !!this.buttonContainer && !!this.divContainer  ? Array.of(bContainer, dContainer) : [Element.#newElement('div'), Element.#newElement('div')];
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

    static createElementDiv(divs) {
        return new Element(divs);
    };

    static createFullElement(color, key, div, bContainer, dContainer, container, index, buttons, selector, length, divs, visible,...args) {
        return new Element(color, key, div,bContainer, dContainer, container, index, buttons, selector, length, divs, visible,...args);
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

    get containers () {
        return this.containers;
    };

    get index() {
        return this.index;
    };

    get buttons() {
        return this.buttons;
    };

    get selector() {
        return this.selector;
    };

    get divs() {
        return this.divs;
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

const Color = class Color {
    name;
    key;
    value = ColorValue.createDefault();
};

const ColorValue = class ColorValue {
    static #isInternalConstructing = true;
    static #color
    #hex;
    #rgb;
    #rgba;
    #cssName;
    #customName;

    constructor() {
        if  (this.#isInternalConstructing) {
            throw new TypeError('Cannot construct ColorValue instances directly');
        }

    };

    static createDefault() {

    };
    static create(color) {

    };
    get hex() {
        return this.#hex;
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

    set rgb(rgb) {
        this.#rgb = rgb;
    };

    set rgba(rgba) {
        this.#rgba = rgba;
    };

    set cssName(cssName) {
        this.#cssName = cssName;
    };
};
