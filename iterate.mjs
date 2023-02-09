'use strict'

export function* iterateProperties(obj, filter) {
    //Dokud mam objekt
    while (obj !== null){
        //Ziskam vsechny jeho property
        for (let prop of Object.getOwnPropertyNames(obj)){
            //Pokud mam filtr
            if (!filter || isValid(obj,prop,filter)){
                yield prop
            }
        }
        obj = Object.getPrototypeOf(obj)
    }
}

function isValid(obj, prop, filter){
    //Ziskam vsechny jeho deskriptory
    let descs = Object.getOwnPropertyDescriptor(obj, prop);
    //Porovnam je
    for (let desc in filter){
    //Pokud se nejaky deskriptor nerovna, ignoruji
        if (descs[desc] !== filter[desc])
            return false;
    }
    return true;
}
