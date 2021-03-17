import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Button from '@material-ui/core/Button';
import Tab from '@material-ui/core/Tab';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered';
import CategoryIcon from '@material-ui/icons/Category';
import moment from 'moment';
import { useFormik } from 'formik';
import CurrencyRealInput from 'src/ui/components/base/CurrencyRealInput';
import ClothTable from 'src/ui/tables/ClothTable';
import StepTable from 'src/ui/tables/StepTable';
import ResourceTable from 'src/ui/tables/ResourceTable';
import ServiceRequisitionController from 'src/controller/ServiceRequisitionController';
import { Customer } from 'src/model/Customer';
import { TabComponent, TabPanel, a11yPropsTab }  from 'src/ui/components/base/TabComponent';
import { Service } from 'src/model/Service';
import * as yup from 'yup';
import { BaseService } from 'src/model/BaseService';
import { Cloth } from 'src/model/Cloth';
import CurrencyRealOutput from 'src/ui/components/base/CurrencyRealOutput';
import CustomerInput from 'src/ui/components/CustomerInput';
import { Step } from 'src/model/Step';
import * as IdentityUtil from 'src/util/IdentityUtil';
import PriceCard from '../components/base/PriceCard';

const validationSchema = yup.object({
  baseService: yup
  .object()
  .required("Base de serviço é obrigatório!")
  .typeError("Base de serviço é obrigatório!"),
  customer: yup
  .object()
  .required("Cliente é obrigatório!")
  .typeError("Cliente é obrigatório!"),
  price: yup
  .number()
  .min(0.00, "O preço deve ser maior ou igual a zero!")
  .required("Preço é obrigatório!"),
  deadline: yup
  .string()
  .required("Prazo de conclusão é obrigatório!")
});

interface ServiceRequisitionFormProps {
  controller:ServiceRequisitionController,
  service: Service,
  handleServiceUpdate: Function
}

export default function ServiceRequisitionForm(props: ServiceRequisitionFormProps) {
  const [tabIndex, setTabIndex] = React.useState(0);
  const [selectedCloth, setSelectedCloth] = React.useState<null | Cloth>(null);
  const [selectedStep, setSelectedStep] = React.useState<null | Step>(null);
    
  const handleChangeTab = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabIndex(newValue);
  };

  function handleClothSelection(cloth:Cloth) {
    setSelectedCloth(cloth);
    setTabIndex(1);
  }

  function handleStepSelection(step:Step) {
    setSelectedStep(step);
    setTabIndex(2);
  }

  function handleLoadSelectedBaseService(baseService: BaseService | null) {    
    formik.setFieldValue("baseService", baseService);
    const clothes = baseService ? baseService.clothes : null;
    props.handleServiceUpdate({...props.service, clothes: clothes});
  }

  function handleUpdateClothes(clothes: Cloth[]) {
    props.handleServiceUpdate({...props.service, clothes: clothes});
  }

  function getPrecoBaseTotal() {
    let total = 0;

    if (props.service && props.service.clothes)
      props.service.clothes.forEach( (cloth:Cloth) => total += cloth.quantity * cloth.price );

    return total;
  }

  const formik = useFormik<{ baseService: BaseService | null, customer: Customer | null, comments: string, price: number, deadline: string}>({    
    initialValues: { 
      baseService: null,
      customer: null,
      comments: "",
      price: 0.00,
      deadline: moment(props.service.deadline).format("yyyy-MM-DD")
    },    
    validationSchema: validationSchema,
    onSubmit: (values: any) => {  
      let newService:Service = new Service(IdentityUtil.generateId(), values.baseService, values.customer, 
          values.comments, moment(values.deadline, "yyyy-MM-DD").toDate(), values.price, props.service.clothes);

      props.handleServiceUpdate(newService);
    }
  });  

  function addNewCustomer(newCustomer: Customer) {
    if (formik.values.customer == null || formik.values.customer.name != newCustomer.name) {
      props.controller.customers.push(newCustomer);
    }

    formik.setFieldValue('customer', newCustomer); 
  }

  const precoBase = getPrecoBaseTotal();

  const valorCobradoColor = formik.values.price > getPrecoBaseTotal() ? "green" :
  formik.values.price < precoBase ? "red" : "";

  return (
    <Container component="main" maxWidth="lg">
      <form id="formService" onSubmit={formik.handleSubmit} noValidate> 
        <Typography variant="h4" align="center" gutterBottom>
          Requisição de serviço
        </Typography>

        <Grid container spacing={2} justify="flex-end">
          <Grid item xs={12} sm={6}>
            <Autocomplete
              id="autocomplete-base-services"
              noOptionsText="Serviço não encontrado!"                  
              value={formik.values.baseService}
              onChange={(event: any, value: BaseService | null) => { handleLoadSelectedBaseService(value); }}               
              options={props.controller.baseServices}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => <TextField {...params} autoFocus label="Base de Serviço:" variant="outlined" required
              error={formik.touched.baseService && Boolean(formik.errors.baseService)}
              helperText={formik.touched.baseService && formik.errors.baseService}   />}
            />
          </Grid>
          <Grid item xs={12} sm={6}>

            <CustomerInput options={props.controller.customers} value={formik.values.customer} 
              onChange={(event: any, value: string | Customer | null) => { formik.setFieldValue('customer', value); }}
              errorExpression={formik.touched.customer && Boolean(formik.errors.customer)}
              helperText={formik.touched.customer && formik.errors.customer}
              handleAddCustomer={(newCustomer: Customer) => { addNewCustomer(newCustomer) }} />

          </Grid>
          <Grid item xs={12} sm={6}>              
               <TextField        
                multiline={true}
                variant="outlined"
                rows="4"      
                rowsMax="6"
                id="observacoes"
                value={formik.values.comments}
                onChange={formik.handleChange }            
                name="comments"
                label="Observações"
                fullWidth />
          </Grid>           
          <Grid item xs={12} sm={3}>            
            <TextField
              id="inputDeadline"
              label="Prazo de conclusão:"
              required
              value={formik.values.deadline}
              onChange={ (event) => { formik.setFieldValue('deadline', event.target.value); } }  
              error={formik.touched.deadline && Boolean(formik.errors.deadline)}
              helperText={formik.touched.deadline && formik.errors.deadline}              
              variant="outlined"
              type="date"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={3}> 
            <CurrencyRealInput id="inputPrice" label="Preço cobrado:" required 
                value={formik.values.price}
                onValueChange={ (values: any) => formik.setFieldValue('price', values.floatValue) }
                error={formik.touched.price && Boolean(formik.errors.price)}
                helperText={formik.touched.price && formik.errors.price} />
          </Grid>
          <Grid item xs={12} sm={8}> 
          <input
            style={{ display: "none" }}
            id="contained-button-file"
            type="file"
          />
          <label htmlFor="contained-button-file">
            <Button variant="contained" color="secondary" component="span">
              Upload
            </Button>
          </label>
          </Grid>
          <Grid item xs={6} sm={2}>            
              <PriceCard label="Valor base" value={getPrecoBaseTotal()} toolTip="Valor base é calculado através do valor unitário das peças * a sua quantidade." />
          </Grid>
          <Grid item xs={6} sm={2}>            
            <PriceCard label="Preço cobrado" value={formik.values.price} toolTip="Preço informado ao cliente." valueColor={valorCobradoColor} />
          </Grid>          
          <Grid item xs={12}>

            <TabComponent ariaLabel="Especificação dos trabalhos"
              tabIndex={tabIndex} handleChange={handleChangeTab}
              tabs={
               [
                  <Tab icon={<CategoryIcon />} label="Peças" key={0} {...a11yPropsTab(0)} />,
                  <Tab icon={<FormatListNumberedIcon />} label="Etapas" disabled={selectedCloth == null} key={1} {...a11yPropsTab(1)} />,
                  <Tab icon={<MonetizationOnIcon />} label="Recursos" disabled={selectedStep == null} {...a11yPropsTab(2)} key={2} />
                ]                
              }
              tabPanels={
                [
                  <TabPanel value={tabIndex} index={0} key={0}>                    
                    <ClothTable serviceTypes={props.controller.serviceTypes} handleClothSelection={handleClothSelection} controller={props.controller} 
                      clothes={props.service.clothes} handleUpdateClothes={handleUpdateClothes}
                      optionsClothes={props.controller.clothes} />
                  </TabPanel>,
                  <TabPanel value={tabIndex} index={1} key={1}>
                    <StepTable cloth={selectedCloth} optionsBaseSteps={props.controller.baseSteps} handleStepSelection={handleStepSelection} controller={props.controller} />
                  </TabPanel>,
                  <TabPanel value={tabIndex} index={2} key={2}>
                    <ResourceTable step={selectedStep} optionsBaseResources={props.controller.baseResources} controller={props.controller} />
                  </TabPanel> 
                ]
              }
            
            />
          </Grid>
          <Grid item xs={4} sm={2}>
            <Button color="primary" type="submit" variant="contained">
              Salvar
            </Button>           
          </Grid>
        </Grid>       
      </form>
    </Container>
  );
}