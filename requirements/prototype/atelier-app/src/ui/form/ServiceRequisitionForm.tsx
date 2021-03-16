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
      let newService:Service = {...props.service};
      newService.baseService = values.baseService;
      newService.customer = values.customer;
      newService.comments = values.comments;
      newService.price = values.price;
      newService.deadline = moment(values.deadline, "yyyy-MM-DD").toDate();
      newService.id = IdentityUtil.generateId();
      props.handleServiceUpdate(newService);
    }
  });  
  
  return (
    <Container component="main" maxWidth="lg">
      <form id="formService" onSubmit={formik.handleSubmit} noValidate> 
        <Typography variant="h4" align="center" gutterBottom>
          Requisição de serviço
        </Typography>

        <Grid container spacing={2}>
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
              handleAddCustomer={(newCustomer: Customer) => {props.controller.customers.push(newCustomer); formik.setFieldValue('customer', newCustomer);}} />

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
          <Grid item xs={6} sm={3}>            
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
          <Grid item xs={6} sm={3}> 
            <CurrencyRealInput id="inputPrice" label="Preço:" required 
                value={formik.values.price}
                onValueChange={ (values: any) => formik.setFieldValue('price', values.floatValue) }
                error={formik.touched.price && Boolean(formik.errors.price)}
                helperText={formik.touched.price && formik.errors.price} />
          </Grid>
          <Grid item xs={8}> 
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
          <Grid item xs={4}> 
              <Typography variant="h5" align="center" gutterBottom>
              Preço base (R$): <CurrencyRealOutput value={getPrecoBaseTotal()} />
              </Typography>          
              
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

          <Grid item xs={12} justify="flex-end">
            <Button color="primary" type="submit" variant="contained">
              Salvar
            </Button>           
          </Grid>
        </Grid>       
      </form>
    </Container>
  );
}