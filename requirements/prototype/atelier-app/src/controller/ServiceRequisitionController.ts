import { Customer } from 'src/model/Customer';
import { BaseService } from 'src/model/BaseService';
import { ServiceType } from 'src/model/ServiceType';
import { Step } from 'src/model/Step';
import { Cloth } from 'src/model/Cloth';
import { Resource, CostType } from 'src/model/Resource';
import { Service } from 'src/model/Service';
import { ClothInstance } from 'src/model/ClothInstance';
import { ExecutionService } from 'src/model/ExecutionService';
import { PaymentType } from 'src/model/PaymentType';
import { Status } from 'src/model/Status';
import { SpendTime } from 'src/model/SpendTime';
import * as IdentityUtil from 'src/util/IdentityUtil';
import moment from 'moment';

export default class ServiceRequisitionController {
    public customers:Customer[];
    public baseServices:BaseService[];
    public serviceTypes:ServiceType[];
    public clothes:Cloth[];
    public baseSteps:Step[];
    public baseResources:Resource[];
    public paymentTypes: PaymentType[];
    public statusList: Status[];    

    constructor() {
        this.customers = [ new Customer('AMAI'), new Customer('Maria'), new Customer('Luiz Eduardo'), new Customer('Mirtes') ]
              
        const serviceTypeModeling:ServiceType = new ServiceType('Modelagem', '#e91e63');
        const serviceTypeCustomMade:ServiceType = new ServiceType('Sob-medida', '#8bc34a');
        const serviceTypeFix:ServiceType = new ServiceType('Ajuste', '#cddc39');
        const serviceTypeReturn:ServiceType = new ServiceType('Retorno', 'red');
        const serviceProducao:ServiceType = new ServiceType('Produção', '#5393ff');
      
        this.serviceTypes = [serviceTypeModeling, serviceTypeCustomMade, serviceTypeFix, serviceTypeReturn, serviceProducao];

        const resourceAtendimentoPresencial = new Resource(1, "Atendimento presencial", 0, CostType.FIXED, "00:10");
        const resourceDesmanche = new Resource(2, "Desmanche", 1.00, CostType.BY_HOUR);
        const resourceTesoura = new Resource(3, "Tesoura", 0.50, CostType.BY_HOUR);
        const resourceMaquinas = new Resource(4, "Máquinas", 2.00, CostType.BY_HOUR);
        const resourceImpressao = new Resource(5, "Impressão", 10.00, CostType.FIXED);
        const resourceSistemaModelagem = new Resource(6, "Sistema de Modelagem", 5.00, CostType.BY_HOUR);
        const resourceEntregaPresencial = new Resource(7, "Entrega presencial", 0, CostType.FIXED, "00:10");
      
        this.baseResources = [resourceAtendimentoPresencial, resourceDesmanche, resourceTesoura, resourceMaquinas, resourceImpressao, 
            resourceSistemaModelagem, resourceEntregaPresencial];

        this.baseSteps = [ new Step(1, 'Atendimento', [resourceAtendimentoPresencial]), new Step(2, 'Lavagem de tecido', []), 
                new Step(3, 'Modelagem', [resourceSistemaModelagem, resourceImpressao]), new Step(4, 'Corte', [resourceTesoura]), new Step(5, 'Costura', [resourceMaquinas]), 
                new Step(8, 'Desmanche', [resourceDesmanche]), new Step(6, 'Entrega', [resourceEntregaPresencial]) ]

        // clothes
        const steps1:Step[] = [ new Step(1, 'Atendimento', [resourceAtendimentoPresencial]), new Step(2, 'Lavagem de tecido', []), 
                new Step(3, 'Modelagem', [resourceSistemaModelagem, resourceImpressao]), new Step(4, 'Corte', [resourceTesoura]), 
                new Step(5, 'Costura', [resourceMaquinas]), new Step(6, 'Entrega', [resourceEntregaPresencial]) ];
        const steps2:Step[] = [ new Step(7, 'Atendimento', [resourceAtendimentoPresencial]), new Step(8, 'Desmanche', [resourceDesmanche]), 
                new Step(9, 'Costura', [resourceMaquinas]), new Step(10, 'Entrega', [resourceEntregaPresencial]) ];
        const steps3:Step[] = [ new Step(1, 'Atendimento', [resourceAtendimentoPresencial]), 
                new Step(3, 'Modelagem', [resourceSistemaModelagem, resourceImpressao]), new Step(4, 'Corte', [resourceTesoura]), 
                new Step(5, 'Costura', [resourceMaquinas]), new Step(6, 'Entrega', [resourceEntregaPresencial]) ];            
        const stepsProducao:Step[] = [ new Step(7, 'Atendimento', [resourceAtendimentoPresencial]), 
                new Step(8, 'Corte', [resourceTesoura]), 
                new Step(9, 'Costura', [resourceMaquinas]), new Step(10, 'Entrega', [resourceEntregaPresencial]) ];            


        const clothCamisaBranca = new Cloth(1, 'Camisa Branca', 3, 40.0, [ serviceTypeModeling, serviceTypeCustomMade ], steps1 );        
        const clothCalca = new Cloth(2, 'Calça', 1, 20.0, [ serviceTypeFix ], steps2 );
        const clothVestido = new Cloth(3, 'Vestido', 1, 120.0, [ serviceTypeCustomMade ], steps3 );
        const clothSaia = new Cloth(4, 'Barra de Saia', 1, 20.0, [ serviceTypeFix ], steps2 );
        const clothProducaoPeca = new Cloth(5, 'Produção de peça', 5, 50.0, [ serviceProducao ], stepsProducao );
        this.clothes = [ clothCamisaBranca, clothCalca, clothVestido, clothSaia, clothProducaoPeca];

        this.baseServices = [ new BaseService('Modelagem', [clothCamisaBranca]), new BaseService('Sob-medida', [clothVestido]), 
            new BaseService('Ajuste de calça', [clothCalca]), new BaseService('Barra de saia', [clothSaia]), 
            new BaseService('Sob-medida e ajuste', [clothVestido, clothSaia]),
            new BaseService('Produção de peça', [clothProducaoPeca])];

        this.paymentTypes = [ new PaymentType(1, "Dinheiro", 0.00), new PaymentType(2, "Cartão", 0.03)];

        this.statusList = [ new Status(1, "Em andamento"), new Status(2, "Concluído")]
    }
    
    public createNewService() {
        return new Service(0, null, null, "", new Date(), 0.00, []);
    }

    public createFilledService() {
        return new Service(1, this.baseServices[0], this.customers[0], "Observações gerais e anotações do serviço", new Date(), 130.00, this.baseServices[0].clothes);
    }

    public getExecutionService(service:Service) {
        let generatedId = 1;
        let instancedCloths:ClothInstance[] = [];

        let dateAtMoment = new Date();        
        let dateMoment = moment(dateAtMoment);
        let spendedTimes: SpendTime[] = [];

        service.clothes.forEach( (cloth: Cloth) => {
            let clothInstancedCloth: ClothInstance[] = [];

            for (let index = 0; index < cloth.quantity; index++) {
                const instancedCloth = new ClothInstance(generatedId, cloth.name + ` (${index+1})`, cloth);
                instancedCloths.push(instancedCloth);
                clothInstancedCloth.push(instancedCloth)
                generatedId++;
            }

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
                        
                        let spendedTime: SpendTime = new SpendTime(IdentityUtil.generateId(), clothInstancedCloth, [step], dateAtMoment, startDate, endTime);
                        spendedTimes.push(spendedTime);
                    }
                });
            });
        });

        return new ExecutionService(service, 20.0, instancedCloths, spendedTimes, [], [], this.statusList[0]);
    }

    public getStatusCompletedService() {
        return this.statusList[1];
    }

    public getStatusPayedService() {
        return this.statusList[2];
    }

    public getStatusProgressService() {
        return this.statusList[0];
    }
}