export function addObject(array: any[], object: any): any[] {
    let copyArray = array.slice();
    copyArray.push(object);
    return copyArray;
}

export function updateObject(array: any[], oldObject: any, newObject: any): any[] {
    let copyArray = array.slice();

    const index = copyArray.indexOf(oldObject);
    copyArray.splice(index, 1);
    copyArray.splice(index, 0, newObject);

    return copyArray;
}

export function removeObject(array: any[], object: any): any[] {
    let copyArray = array.slice();
    copyArray.splice(copyArray.indexOf(object), 1);
    return copyArray;
}

export function downObjectIndex(array: any[], object: any): any[] {
    const index = array.indexOf(object);

    if (index < 1)
        return array;

    let copyArray = array.slice();
    copyArray.splice(index, 1);
    copyArray.splice(index-1, 0, object);
    return copyArray;
}

