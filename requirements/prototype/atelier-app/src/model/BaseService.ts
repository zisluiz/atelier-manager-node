import { Cloth } from "./Cloth";

export class BaseService {
    constructor(public name: string, public clothes: Cloth[]) {};
}