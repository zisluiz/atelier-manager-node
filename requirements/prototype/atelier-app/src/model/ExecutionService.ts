import { Service } from "./Service";
import { ClothInstance } from "./ClothInstance";
import { SpendTime } from "./SpendTime";
import { Expense } from "./Expense";
import { Revenue } from "./Revenue";

export class ExecutionService {
    constructor(public service: Service, public instancedCloths: null | ClothInstance[], public spendedTimes: SpendTime[], public revenues: Revenue[], public expenses: Expense[]) {};
}