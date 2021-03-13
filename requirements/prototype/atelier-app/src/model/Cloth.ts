import { int } from "src/type/int";
import { ServiceType } from "./ServiceType";
import { Step } from "./Step";

export class Cloth {
    constructor(public id: number, public name: string, public quantity: int, public price: number, public serviceTypes: ServiceType[], public steps: Step[]) {};
}