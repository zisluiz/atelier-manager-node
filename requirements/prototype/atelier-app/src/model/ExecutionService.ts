import { Service } from "./Service";
import { ClothInstance } from "./ClothInstance";
import { SpendTime } from "./SpendTime";
import { Expense } from "./Expense";
import { Revenue } from "./Revenue";
import { Status } from "./Status";

export class ExecutionService {
    constructor(public service: Service, public hourValue: number, public instancedCloths: null | ClothInstance[], 
        public spendedTimes: SpendTime[], public revenues: Revenue[], public expenses: Expense[], public status: Status, public serviceReturned: boolean = false) {};
}