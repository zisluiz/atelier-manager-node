export function getKeyArray(enumeration: any): any[] {
    const objects = Object.values(enumeration);
    return objects.splice(0, objects.length / 2);
}