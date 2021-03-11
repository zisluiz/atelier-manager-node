import { Customer } from 'src/model/Customer';
import { BaseService } from 'src/model/BaseService';
import { ServiceType } from 'src/model/ServiceType';
import { Step } from 'src/model/Step';
import { Cloth } from 'src/model/Cloth';

export default class ServiceRequisitionController {
    public customers:Customer[];
    public baseServices:BaseService[];
    public serviceTypes:ServiceType[];
    public clothes:Cloth[];

    constructor() {
        this.customers = [ new Customer('AMAI'), new Customer('Maria'), new Customer('Luiz Eduardo'), new Customer('Mirtes') ]
        this.baseServices = [ new BaseService('Modelagem'), new BaseService('Sob-medida'), new BaseService('Ajuste de calça'), new BaseService('Barra de saia') ];
      
        const serviceTypeModeling:ServiceType = new ServiceType('Modelagem', '#e91e63');
        const serviceTypeCustomMade:ServiceType = new ServiceType('Sob-medida', '#8bc34a');
        const serviceTypeFix:ServiceType = new ServiceType('Ajuste', '#cddc39');
        const serviceTypeReturn:ServiceType = new ServiceType('Retorno', 'red');
      
        this.serviceTypes = [serviceTypeModeling, serviceTypeCustomMade, serviceTypeFix, serviceTypeReturn];
      
        const steps1:Step[] = [ new Step('Atendimento'), new Step('Lavagem de tecido'), new Step('Modelagem'), new Step('Corte'), new Step('Costura'), new Step('Entrega') ];
        const steps2:Step[] = [ new Step('Atendimento'), new Step('Desmanche'), new Step('Costura'), new Step('Entrega') ];
            
        this.clothes = [ new Cloth('Camisa Branca', 3, 40.0, [ serviceTypeModeling, serviceTypeCustomMade ], steps1 ),
                          new Cloth('Calça', 1, 20.0, [ serviceTypeFix ], steps2 ) ];
    }
    
}