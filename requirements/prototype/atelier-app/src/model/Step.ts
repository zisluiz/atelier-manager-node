import { Resource } from "src/model/Resource";

export class Step {
    constructor(public id: number, public name: string, public resources: Resource[]) {};
}