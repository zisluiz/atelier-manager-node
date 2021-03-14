import { BaseService } from "./BaseService";
import { Cloth } from "./Cloth";
import { Customer } from "./Customer";

export class Service {
    constructor(public id: number, public baseService: null | BaseService, public customer: null | Customer, 
        public comments: string, public deadline: Date | null, public price: number, public clothes: Cloth[]) {};
}