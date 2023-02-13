'use strict';
import { iterateProperties } from "./iterate.mjs"

function generateValues(gen) {
    let values = [];
	for (let prop of gen) {
		values.push(prop)
	}
    return values
}

describe('Edge case tests', () => {
    test('Null object', () => {
        const obj = null;
        expect(generateValues(iterateProperties(obj))).toStrictEqual([])
    })
    
    test('Undefined object', () => {
        const obj = undefined;
        expect(generateValues(iterateProperties(obj))).toStrictEqual([])
    })

    test('Without object', () => {
        expect(generateValues(iterateProperties())).toStrictEqual([])
    })
    
    test('Prototype object', () => {
        const obj = Object.prototype;
        expect(generateValues(iterateProperties(obj)).length).toBe(12)
    })

})

describe('Basic tests', () => {
    const defaultObj = {
        a : 42
    }
    test('Object with attributes', () => {
        expect(generateValues(iterateProperties(defaultObj)).slice(-1)).toStrictEqual(['a'])
    })
    
    test('Inherited object', () => {
        const inheritedObj = Object.create(defaultObj);
        expect(generateValues(iterateProperties(inheritedObj)).slice(-1)).toStrictEqual(['a'])
    })

    test('Inherited object with new attribute', () => {
        const inheritedCustomizedObj = Object.create(defaultObj);
        inheritedCustomizedObj.b = 24;
        expect(generateValues(iterateProperties(inheritedCustomizedObj)).slice(-1)).toStrictEqual(['b'])
    })
})

describe('Filter tests', () => {
    test('Enumerable', () => {
        const obj = {}
        Object.defineProperty(obj, "a", {
            value: 42,
            enumerable: false
        })
        Object.defineProperty(obj, "b", {
            value: 24,
            enumerable: true
        })
        expect(generateValues(iterateProperties(obj, {enumerable: true}))).toStrictEqual(['b'])
    })
    test('Writable', () => {
        const obj = {}
        Object.defineProperty(obj, "a", {
            value: 42,
            writable: false
        })
        Object.defineProperty(obj, "b", {
            value: 24,
            writable: true
        })
        expect(generateValues(iterateProperties(obj, {writable: false}))).toStrictEqual(['a'])
    })
    test('Configurable', () => {
        const obj = {}
        Object.defineProperty(obj, "a", {
            value: 42,
            configurable: false
        })
        Object.defineProperty(obj, "b", {
            value: 24,
            configurable: true
        })
        expect(generateValues(iterateProperties(obj, {configurable: false}))).toStrictEqual(['a'])
    })
    test('2 filters', () => {
                const obj = {}
        Object.defineProperty(obj, "a", {
            value: 42,
            enumerable: true,
            configurable: false
        })
        Object.defineProperty(obj, "b", {
            value: 24,
            enumerable: true,
            configurable: true
        })
        expect(generateValues(iterateProperties(obj, {configurable: false, enumerable: true}))).toStrictEqual(['a'])
    })
    test('3 filters', () => {
        const obj = {}
        Object.defineProperty(obj, "a", {
            value: 42,
            enumerable: true,
            configurable: false,
            writable: true
        })
        Object.defineProperty(obj, "b", {
            value: 24,
            enumerable: true,
            configurable: true,
            writable: true
        })
        Object.defineProperty(obj, "c", {
            value: 24,
            enumerable: false,
            configurable: false,
            writable: true
        })
        expect(generateValues(iterateProperties(obj, {configurable: true, writable: true, enumerable: true}))).toStrictEqual(['b'])
    })
})

describe('Multiple generators', () => {
})