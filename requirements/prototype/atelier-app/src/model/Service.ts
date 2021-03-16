import { BaseService } from "./BaseService";
import { Cloth } from "./Cloth";
import { Customer } from "./Customer";
import { CostType, Resource } from "./Resource";
import { Step } from "./Step";

export class Service {
    constructor(public id: number, public baseService: null | BaseService, public customer: null | Customer, 
        public comments: string, public deadline: Date | null, public price: number, public clothes: Cloth[]) {};

    public getFixedResourceCosts(): number {
        let costs = 0;

        this.clothes.forEach((cloth: Cloth) => {
            cloth.steps.forEach((step:Step) => {
                step.resources.forEach((resource:Resource) => {
                    if (resource.costType == CostType.FIXED)
                        costs += resource.cost * cloth.quantity;
                }); 
            });
        });

        return costs;        
    }
}