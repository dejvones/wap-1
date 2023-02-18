'use strict';
import { iterateProperties } from "./iterate.mjs"

function generateValues(gen) {
    let values = [];
	for (let prop of gen) {
		values.push(prop);
	}
    return values;
}

describe('Edge case tests', () => {
    test('Null object', () => {
        const obj = null;
        expect(generateValues(iterateProperties(obj))).toStrictEqual([]);
    });
    
    test('Undefined object', () => {
        const obj = undefined;
        expect(generateValues(iterateProperties(obj))).toStrictEqual([]);
    });

    test('Without object', () => {
        expect(generateValues(iterateProperties())).toStrictEqual([]);
    });
    
    test('Prototype object', () => {
        const obj = Object.prototype;
        expect(generateValues(iterateProperties(obj)).length).toBe(12);
    });
});

describe('Basic tests', () => {
    const defaultObj = {
        a : 42
    };
    test('Object with attributes', () => {
        let result = generateValues(iterateProperties(defaultObj));
        expect(result.slice(-1)).toStrictEqual(['a']);
        expect(result.length).toBe(13);
    });
    
    test('Inherited object', () => {
        const inheritedObj = Object.create(defaultObj);
        let result = generateValues(iterateProperties(inheritedObj));
        expect(result.slice(-1)).toStrictEqual(['a']);
        expect(result.length).toBe(13);
    });

    test('Inherited object with new attribute', () => {
        const inheritedCustomizedObj = Object.create(defaultObj);
        inheritedCustomizedObj.b = 24;
        expect(generateValues(iterateProperties(inheritedCustomizedObj)).slice(-1)).toStrictEqual(['b'])
    });
});

describe('Filter tests', () => {
    test('Enumerable', () => {
        const obj = {};
        Object.defineProperty(obj, "a", {
            value: 42,
            enumerable: false
        });
        Object.defineProperty(obj, "b", {
            value: 24,
            enumerable: true
        });
        expect(generateValues(iterateProperties(obj, {enumerable: true}))).toStrictEqual(['b']);
    });
    test('Writable', () => {
        const obj = {};
        Object.defineProperty(obj, "a", {
            value: 42,
            writable: false
        });
        Object.defineProperty(obj, "b", {
            value: 24,
            writable: true
        });
        expect(generateValues(iterateProperties(obj, {writable: false}))).toStrictEqual(['a']);
    });
    test('Configurable', () => {
        const obj = {};
        Object.defineProperty(obj, "a", {
            value: 42,
            configurable: false
        });
        Object.defineProperty(obj, "b", {
            value: 24,
            configurable: true
        });
        expect(generateValues(iterateProperties(obj, {configurable: false}))).toStrictEqual(['a']);
    });
    test('2 filters', () => {
        const obj = {};
        Object.defineProperty(obj, "a", {
            value: 42,
            enumerable: true,
            configurable: false
        });
        Object.defineProperty(obj, "b", {
            value: 24,
            enumerable: true,
            configurable: true
        });
        expect(generateValues(iterateProperties(obj, {configurable: false, enumerable: true}))).toStrictEqual(['a']);
    });
    test('3 filters', () => {
        const obj = {};
        Object.defineProperty(obj, "a", {
            value: 42,
            enumerable: true,
            configurable: false,
            writable: true
        });
        Object.defineProperty(obj, "b", {
            value: 24,
            enumerable: true,
            configurable: true,
            writable: true
        });
        Object.defineProperty(obj, "c", {
            value: 24,
            enumerable: false,
            configurable: false,
            writable: true
        });
        expect(generateValues(iterateProperties(obj, {configurable: true, writable: true, enumerable: true}))).toStrictEqual(['b']);
    });
    test('Undefined descriptor value', () => {
        const obj = {};
        Object.defineProperty(obj, "a", {
            value: 42
        });
        let result = generateValues(iterateProperties(obj, {enumerable: undefined}));
        expect(result.slice(-1)).toStrictEqual(['a']);
        expect(result.length).toBe(13);
    });
    test('Custom descriptor', () => {
        const obj = {
            a: 42
        };
        expect(generateValues(iterateProperties(obj, {something: true}))).toStrictEqual([]);
    });
    test('Value descriptor', () => {
        const obj = {
            a: 42
        };
        expect(generateValues(iterateProperties(obj, {value: 42}))).toStrictEqual(['a'])
    });
});

describe('Advanced tests', () => {
    test('Independent iterators', () => {
        const obj = {};
        let it1 = iterateProperties(obj);
        let it2 = iterateProperties(obj);
        expect(it1.next().value).toStrictEqual('constructor')
        expect(it1.next().value).toStrictEqual('__defineGetter__')
        expect(it2.next().value).toStrictEqual('constructor')
        expect(it1.next().value).toStrictEqual('__defineSetter__')
        expect(it2.next().value).toStrictEqual('__defineGetter__')
        expect(it2.next().value).toStrictEqual('__defineSetter__')
        expect(it2.next().value).toStrictEqual('hasOwnProperty')
    });
    test('Independent iterators with filter', () => {
        const obj = {
            a: 42,
            b: 24,
            c: 15,
            d: 51
        };
        let it1 = iterateProperties(obj, {enumerable: true});
        let it2 = iterateProperties(obj, {enumerable: true});
        expect(it1.next().value).toStrictEqual('a')
        expect(it1.next().value).toStrictEqual('b')
        expect(it2.next().value).toStrictEqual('a')
        expect(it1.next().value).toStrictEqual('c')
        expect(it2.next().value).toStrictEqual('b')
        expect(it2.next().value).toStrictEqual('c')
        expect(it2.next().value).toStrictEqual('d')
    });
    test('Constructor', () => {
        function Rectangle(width, height){
            this.width = width
            this.height = height
        };
        Rectangle.prototype = {
            width: undefined,
            height: undefined
        };
        expect(generateValues(iterateProperties(new Rectangle(100,20), {enumerable: true}))).toStrictEqual(['width', 'height', 'width', 'height'])
    }),
    test('Class', () => {
        class Rectangle {
            width = undefined;
            height = undefined;
            content = undefined;
            constructor(w,h){
                this.width = w
                this.height = h
            };
        };
        expect(generateValues(iterateProperties(new Rectangle(100,20), {enumerable: true}))).toStrictEqual(['width', 'height', 'content'])
    });
});