export enum CostType {
    BY_HOUR = 0,
    FIXED = 1
}

export function getCostTypeName(costType: CostType) {
    switch (costType) {
        case CostType.BY_HOUR:
            return "Por hora";
        case CostType.FIXED:
            return "Fixo";
        default:
            return "";
    }
}

export class Resource {    
    constructor(public id: number, public name: string, public cost: number, public costType: CostType, public defaultSpendTime?: string) {};

    public getDescription():string {
        switch (this.costType) {
            case CostType.BY_HOUR:
                return " / Hora";
            case CostType.FIXED:
                return " Fixo";
            default:
                return "";
        }
    }
}