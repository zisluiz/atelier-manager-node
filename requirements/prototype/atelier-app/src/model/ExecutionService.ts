import moment from 'moment';
import { Service } from "./Service";
import { ClothInstance } from "./ClothInstance";
import { SpendTime } from "./SpendTime";
import { Expense } from "./Expense";
import { Revenue } from "./Revenue";
import { Status } from "./Status";
import * as ArraysUtil from 'src/util/ArraysUtil';
import * as IdentityUtil from 'src/util/IdentityUtil';
import { Cloth } from "./Cloth";
import { Step } from './Step';
import { Resource } from './Resource';

export class ExecutionService {
    constructor(public service: Service, public hourValue: number, public instancedCloths: ClothInstance[], 
        public spendedTimes: SpendTime[], public revenues: Revenue[], public expenses: Expense[], public status: Status, 
        public serviceReturned: boolean = false, public payed: boolean = false) {};

    public updateInstancedClothes() {
        if (this.instancedCloths.length > 0) {
            let instancedClothsToRemove: ClothInstance[] = [];

            this.instancedCloths.forEach((instancedCloth: ClothInstance) => {
                if (!this.service.clothes.includes(instancedCloth.cloth)) {
                    instancedClothsToRemove.push(instancedCloth);
                    this.removeClothSpendedTime(instancedCloth.cloth);
                }
            });

            if (instancedClothsToRemove.length > 0) {
                instancedClothsToRemove.forEach( (toRemove => {
                    this.instancedCloths = ArraysUtil.removeObject(this.instancedCloths, toRemove);                    
                }));               
            }
        }

        this.service.clothes.map((cloth: Cloth) => {
            let instancesOfCloth: ClothInstance[] = [];

            this.instancedCloths.forEach((instancedCloth: ClothInstance) => {
                if (cloth.id == instancedCloth.cloth.id) {
                    instancesOfCloth.push(instancedCloth);
                }                
            });

            let quantity = 1;
            const isNewCloth = instancesOfCloth.length == 0; 

            while (instancesOfCloth.length != cloth.quantity) {
                if (instancesOfCloth.length == 0) {
                    const newInstance = new ClothInstance(IdentityUtil.generateId(), `${cloth.name} (${quantity})`, cloth);
                    instancesOfCloth.push(newInstance);
                    this.instancedCloths = ArraysUtil.addObject(this.instancedCloths, newInstance);
                } else {
                    let needInsertNewInstance = true;

                    instancesOfCloth.forEach((clothInstance: ClothInstance) => {
                        const numberInstance: number = Number(clothInstance.name.substring(clothInstance.name.indexOf("(")+1, clothInstance.name.indexOf(")")));

                        if (numberInstance > cloth.quantity) {
                            this.instancedCloths = ArraysUtil.removeObject(this.instancedCloths, clothInstance);
                            instancesOfCloth = ArraysUtil.removeObject(instancesOfCloth, clothInstance);
                            return;
                        } if (numberInstance >= quantity) {                            
                            needInsertNewInstance = false; 
                        }                  
                    });                    

                    if (needInsertNewInstance) {
                        const newInstance = new ClothInstance(IdentityUtil.generateId(), `${cloth.name} (${quantity})`, cloth);
                        instancesOfCloth.push(newInstance);
                        this.instancedCloths = ArraysUtil.addObject(this.instancedCloths, newInstance);
                    }
                    quantity++;
                }
            }

            if (isNewCloth) {
                this.createDefaultSpendedTime(cloth, instancesOfCloth, this.spendedTimes);
            }
        });
    }

    private removeClothSpendedTime(cloth: Cloth) {
        let spendedTimeToRemove: SpendTime[] = [];

        this.spendedTimes.forEach((spendedTime: SpendTime) => {
            if (spendedTime.clothes[0].cloth.id == cloth.id) {
                spendedTimeToRemove.push(spendedTime);
            }
        });

        spendedTimeToRemove.forEach((spendedTime: SpendTime) => {
            this.spendedTimes = ArraysUtil.removeObject(this.spendedTimes, spendedTime);
        });        
    }

    public createDefaultSpendedTime(cloth: Cloth, clothInstancedClothes: ClothInstance[], spendedTimes: SpendTime[]) {
        let dateAtMoment = new Date();    
        let dateMoment = moment(dateAtMoment);

        cloth.steps.forEach( (step: Step) => {
            step.resources.forEach( (resource: Resource) => {
                if (resource.defaultSpendTime) {
                    dateAtMoment.setMinutes(dateAtMoment.getMinutes() - 1);
                    dateMoment = moment(dateAtMoment);
                    const endTime = dateMoment.format("HH:mm");

                    const hours = Number(resource.defaultSpendTime.split(":")[0]);
                    const minutes = Number(resource.defaultSpendTime.split(":")[1]);

                    const dateStart = dateMoment.subtract({hours: hours, minutes: minutes});
                    const startDate = dateStart.format("HH:mm");
                    dateAtMoment = dateStart.toDate();
                    
                    let spendedTime: SpendTime = new SpendTime(IdentityUtil.generateId(), clothInstancedClothes, [step], dateAtMoment, startDate, endTime);
                    spendedTimes.push(spendedTime);
                }
            });
        });        
    }
}