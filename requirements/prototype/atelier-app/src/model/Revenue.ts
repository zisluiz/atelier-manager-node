import { PaymentType } from "./PaymentType";

export class Revenue {
    constructor(public id: number, public description: string, public value: number, public paymentType: PaymentType) {};

    public getNetValue() {
        return this.value * ((100 - this.paymentType.taxesPercent) / 100);
    }
}