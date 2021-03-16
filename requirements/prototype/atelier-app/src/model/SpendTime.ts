import { Service } from "./Service";
import { ClothInstance } from "./ClothInstance";
import { Step } from "./Step";
import moment from 'moment';
import { CostType, Resource } from "./Resource";

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

        return `${moment(this.date).format("DD/MM/yyyy")} - ${this.startTime} às ${this.endTime ? this.endTime : "?"} ${durationText}`;
    }

    public getSpendedHours(): number {
        const startTime = moment(this.startTime, "HH:mm");
        let durationText = "";

        if (this.endTime) {
            const endTime = moment(this.endTime, "HH:mm");        
            const duration = moment.duration(endTime.diff(startTime));

            return duration.get('hours') + (duration.get('minutes') / 60);
        }
        
        return 0;
    }

    public getSpendedResourcesCost(): number {
        let costs = 0;

        const spendedHours = this.getSpendedHours();

        this.steps.forEach( (step: Step) => {
            step.resources.forEach( (resource: Resource) => {
                if (resource.costType == CostType.BY_HOUR)
                    costs += resource.cost * spendedHours;
            });    
        });

        return costs;
    }


}