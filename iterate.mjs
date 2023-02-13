'use strict'
/**
 * Funkce generující názvy vlastností dostupných pro předaný objekt a jeho řetězec prototypů.
 * @param {Object} obj - Povinný parametr obsahující objekt, jehož vlastnosti se budou knihovnou procházet.
 * @param {Object} filter - Volitelný parametr obsahující popisovač vlastností. 
 * @returns {Iterator} Iterátor dostupných vlastností
 */
export function* iterateProperties(obj, filter) {
    for (let o of getPrototypeChain(obj)){
        for (let prop of Object.getOwnPropertyNames(o)){
            if (!filter || isValid(o, prop, filter)){
                yield prop;
            }
        }
    }
}

/**
 * Funkce vracející řetězec prototypů začínající na nejnižší úrovni (tedy od Object.prototype a dále).
 * @param {object} obj - Povinný parametr obsahujicí objekt, jehož prototypy chceme zjistit.
 * @returns {Array} Řetězec prototypů
 */
function getPrototypeChain(obj){
    let prototypes = []
    do{
        prototypes.push(obj)
        obj = Object.getPrototypeOf(obj)
    } while(obj)
    return prototypes.reverse()
}

/**
 * Funkce ověřující, zda daná vlastnost odpovídá vybranému filtru. 
 * @param {Object} obj - Povinný parametr obsahujicí objekt, jehož popisovače vlastností pro danou vlastnost chceme zjistit.
 * @param {Object} prop - Povinný parametr obsahujicí vlastnost, kterou chceme ověřit.
 * @param {Object} filter - Povinný parametr obsahujicí filtr popisovačů vlastností.
 * @returns {Boolean} V případě, že vlastnost odpovídá filtru, je vrácena hodnota True. Jinak False.
 */
function isValid(obj, prop, filter){
    let descs = Object.getOwnPropertyDescriptor(obj, prop);
    for (let desc in filter){
        if (descs[desc] !== filter[desc])
            return false;
    }
    return true;
}
