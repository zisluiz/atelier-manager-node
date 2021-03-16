import { Service } from "./Service";
import { ClothInstance } from "./ClothInstance";
import { SpendTime } from "./SpendTime";

export class ExecutionService {
    constructor(public service: Service, public instancedCloths: null | ClothInstance[], public spendedTimes: SpendTime[]) {};
}