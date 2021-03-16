import { Service } from "./Service";
import { ClothInstance } from "./ClothInstance";
import { Step } from "./Step";
import moment from 'moment';

export class SpendTime {
    constructor(public id: number, public clothes: ClothInstance[], public steps: Step[], public date: Date, public startTime: string, public endTime: string) {};

    public getClothNames() {
        return this.clothes ? this.clothes.map((cloth) => cloth.name).join(", ") : "";
    }

    public getStepNames() {
        return this.steps ? this.steps.map((step) => step.name).join(", ") : "";
    }

    public getSpendedTime() {
        const startTime = moment(this.startTime, "HH:mm");
        let durationText = "";

        if (this.endTime) {
            const endTime = moment(this.endTime, "HH:mm");        
            const duration = moment.duration(endTime.diff(startTime));

            durationText = this.endTime ? ` - duração: ${duration.get('hours')} hora(s) e ${duration.get('minutes')} minuto(s)` : "";
        }

        return `${moment(this.date).format("DD/MM/YYYY")} - ${this.startTime} às ${this.endTime ? this.endTime : "?"} ${durationText}`;
    }
}