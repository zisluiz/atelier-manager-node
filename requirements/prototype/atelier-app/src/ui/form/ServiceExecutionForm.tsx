import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import Tab from '@material-ui/core/Tab';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered';
import CategoryIcon from '@material-ui/icons/Category';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, {Color as AlertColor} from '@material-ui/lab/Alert';
import BuildIcon from '@material-ui/icons/Build';
import MoneyIcon from '@material-ui/icons/Money';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import moment from 'moment';
import CurrencyRealInput from 'src/ui/components/base/CurrencyRealInput';
import ClothTable from 'src/ui/tables/ClothTable';
import StepTable from 'src/ui/tables/StepTable';
import RegisterSpendedTimeTable from 'src/ui/tables/RegisterSpendedTimeTable';
import ResourceTable from 'src/ui/tables/ResourceTable';
import ServiceRequisitionController from 'src/controller/ServiceRequisitionController';
import { Customer } from 'src/model/Customer';
import { TabComponent, TabPanel, a11yPropsTab }  from 'src/ui/components/base/TabComponent';
import { Service } from 'src/model/Service';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Cloth } from 'src/model/Cloth';
import CustomerInput from 'src/ui/components/CustomerInput';
import { Step } from 'src/model/Step';
import PriceCard from 'src/ui/components/base/PriceCard';
import ContentCard from 'src/ui/components/base/ContentCard';
import { ExecutionService } from 'src/model/ExecutionService';
import { SpendTime } from 'src/model/SpendTime';
import { Expense } from 'src/model/Expense';
import ExpenseTable from 'src/ui/tables/ExpenseTable';
import { Revenue } from 'src/model/Revenue';
import RevenueTable from '../tables/RevenueTable';
import { Resource } from 'src/model/Resource';

const useStyles = makeStyles({
  root: {
   
  },
  titlePage: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center"
  },
  serviceReturned: {
    color: "red",
    height: "100%"
  },
  servicePayed: {
    color: "green",
    height: "100%"
  },  
  containerFullHeight: {
    height: "100%"
  }
});

const validationSchema = yup.object({
  customer: yup
  .object()
  .required("Cliente ?? obrigat??rio!")
  .typeError("Cliente ?? obrigat??rio!"),
  hourValue: yup
  .number()
  .min(0.01, "O valor/hora deve ser maior que zero!")
  .required("Valor/hora ?? obrigat??rio!"),  
  price: yup
  .number()
  .min(0.00, "O pre??o deve ser maior ou igual a zero!")
  .required("Pre??o ?? obrigat??rio!"),
  deadline: yup
  .string()
  .required("Prazo de conclus??o ?? obrigat??rio!")
});

interface ServiceExecutionFormProps {
  controller: ServiceRequisitionController,
  service: Service,
  handleServiceUpdate: Function
}

export default function ServiceExecutionForm(props: ServiceExecutionFormProps) {
  const [executionService, setExecutionService] = React.useState<ExecutionService>(props.controller.getExecutionService(props.service));

  const [tabIndex, setTabIndex] = React.useState(0);
  const [tabIndexReceitas, setTabIndexReceitas] = React.useState(0);
  const [selectedCloth, setSelectedCloth] = React.useState<null | Cloth>(null);
  const [selectedStep, setSelectedStep] = React.useState<null | Step>(null);
  const [openSnackAlert, setOpenSnackAlert] = React.useState(false);
  const [messageSnackAlert, setMessageSnackAlert] = React.useState<JSX.Element | null>(null);
  
  const classes = useStyles();
  const inProgressService = executionService.status.id == 1;
    
  const handleChangeTab = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabIndex(newValue);
  };

  const handleChangeTabReceitas = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabIndexReceitas(newValue);
  };

  function handleClothSelection(cloth:Cloth) {
    setSelectedCloth(cloth);
    setTabIndex(1);
  }

  function handleStepSelection(step:Step) {
    setSelectedStep(step);
    setTabIndex(2);
  }

  const handleCloseSnackAlert = (event?: React.SyntheticEvent, reason?: string) => {
    setOpenSnackAlert(false);
  };

  function showSnackAlert(message: string, severity: AlertColor) {
    const alert = (<MuiAlert elevation={6} variant="filled" onClose={handleCloseSnackAlert} severity={severity}>{message}</MuiAlert>);
    setOpenSnackAlert(true);
    setMessageSnackAlert(alert);
  }

  function handleUpdateClothes(clothes: Cloth[]) {    
    const service = new Service(props.service.id, props.service.baseService, props.service.customer, 
      props.service.comments, props.service.deadline, props.service.price, clothes);

    showSnackAlert("Pe??as atualizadas com sucesso!", 'success');
    
    executionService.service = service;

    executionService.updateInstancedClothes();

    props.handleServiceUpdate(service);
  }

  function updateClothSteps(clothToUpdate:Cloth | null, steps: Step[]) {
    if (!clothToUpdate)
        return;

    const persistedCloth = props.service.clothes.filter((cloth:Cloth) => cloth.id == clothToUpdate.id)[0];
    persistedCloth.steps = steps;
}

function updateStepResources(stepToUpdate:Step | null, resources: Resource[]) {
    if (!stepToUpdate)
        return;

    const persistedCloth = props.service.clothes.filter((cloth:Cloth) => cloth.steps && cloth.steps.filter((step:Step) => step.id == stepToUpdate.id))[0];
    const persistedStep = persistedCloth.steps && persistedCloth.steps.filter((step:Step) => step.id == stepToUpdate.id)[0];

    persistedStep.resources = resources;
}   

  function updateSpendedTimes(spendedTimes: SpendTime[]) {
    updateExecutionService({...executionService, spendedTimes: spendedTimes});
  }

  function updateExpenses(expenses: Expense[]) {
    updateExecutionService({...executionService, expenses: expenses});
    showSnackAlert("Despesas atualizadas com sucesso!", 'success');
  }

  function updateRevenues(revenues: Revenue[]) {
    updateExecutionService({...executionService, revenues: revenues});
    showSnackAlert("Receitas atualizadas com sucesso!", 'success');
  }

  function completeService() {
    updateExecutionService({...executionService, status: props.controller.getStatusCompletedService()});
  }

  function payedService() {
    updateExecutionService({...executionService, payed: true});
  } 
  
  function reopenService() {
    updateExecutionService({...executionService, status: props.controller.getStatusProgressService()});
  }  

  function returnedService() {
    updateExecutionService({...executionService, status: props.controller.getStatusProgressService(), serviceReturned: true});
  }
  
  function updateExecutionService(executionService: any) {
    setExecutionService(new ExecutionService(executionService.service, executionService.hourValue, executionService.instancedCloths, executionService.spendedTimes,
      executionService.revenues, executionService.expenses, executionService.status, executionService.serviceReturned, executionService.payed));
  }  

  function getPrecoBaseTotal() {
    let total = 0;

    props.service.clothes.forEach( (cloth:Cloth) => total += cloth.quantity * cloth.price);

    return total;
  }

  function getCustoEstimado() {
    let total = 0;

    executionService.expenses.forEach( (expense:Expense) => total += expense.value);

    total += props.service.getFixedResourceCosts();

    executionService.spendedTimes.map( (spendedTime: SpendTime) => {
      total += formik.values.hourValue * spendedTime.getSpendedHours();      
      total += spendedTime.getSpendedResourcesCost();
    });

    return total;
  }  

  function getValorRecebido() {
    let total = 0;
    executionService.revenues.forEach( (revenue:Revenue) => total += revenue.getNetValue());
    return total;
  }

  function addNewCustomer(newCustomer: Customer) {
    if (formik.values.customer == null || formik.values.customer.name != newCustomer.name) {
      props.controller.customers.push(newCustomer); showSnackAlert("Cliente adicionado com sucesso!", 'success');
    }

    formik.setFieldValue('customer', newCustomer); 
  }

  const formik = useFormik<{ customer: Customer | null, comments: string, hourValue: number, price: number, deadline: string}>({    
    initialValues: { 
      customer: props.service.customer,
      comments: props.service.comments,
      hourValue: executionService.hourValue,
      price: props.service.price,
      deadline: moment(props.service.deadline).format("yyyy-MM-DD")
    },    
    validationSchema: validationSchema,
    onSubmit: (values: any) => {
      let changedService:Service = new Service(props.service.id, props.service.baseService, values.customer, values.comments, 
        moment(values.deadline, "yyyy-MM-DD").toDate(), values.price, props.service.clothes);

      props.handleServiceUpdate(changedService);
      updateExecutionService({...executionService, hourValue: values.hourValue, service: changedService});
      showSnackAlert("Servi??o atualizado com sucesso!", "success");
    }
  });
  
  const precoBaseTotal = getPrecoBaseTotal();
  const custoEstimado = getCustoEstimado();
  const valorRecebido = getValorRecebido();
  const valorCobradoColor = formik.values.price > custoEstimado && formik.values.price > precoBaseTotal ? "green" :
      formik.values.price < custoEstimado || formik.values.price < precoBaseTotal ? "red" : "";
  
  return (
    <Container component="main" maxWidth="lg">      
      <Grid container spacing={2} >
          <Grid item xs={12} sm={4}>  

            <Grid container className={classes.containerFullHeight}>
              <Grid item xs={8} sm={10}>                
                <Typography variant="h4" align="center" gutterBottom className={classes.titlePage} component="span">
                  Execu????o de servi??o #{executionService.service.id}
                </Typography>
              </Grid>
              { executionService.serviceReturned &&               
                <Grid item xs={2} sm={1}>
                                                
                    <Tooltip title="Servi??o com retorno de ajustes">   
                      <IconButton aria-label="Servi??o com retorno de ajustes" className={classes.serviceReturned}>
                        <BuildIcon />
                      </IconButton>        
                    </Tooltip>
                </Grid>
              }                
              { executionService.payed &&                                
                <Grid item xs={2} sm={1}>
                  
                    <Tooltip title="Servi??o pago">   
                      <IconButton aria-label="Servi??o pago" className={classes.servicePayed}>
                        <MoneyIcon fontSize="large" />
                      </IconButton>        
                    </Tooltip>                
                </Grid>      
              }
            </Grid>
          </Grid>          
          <Grid item xs={6} sm={2}>  
              <PriceCard label="Valor base" value={precoBaseTotal} toolTip="Valor base ?? calculado atrav??s do valor unit??rio das pe??as * a sua quantidade." />
          </Grid>
          <Grid item xs={6} sm={2}>     
            <PriceCard label="Pre??o cobrado" value={formik.values.price} valueColor={valorCobradoColor} toolTip="Pre??o informado ao cliente." />
          </Grid>
          <Grid item xs={6} sm={2}>     
            <PriceCard label="Custo estimado" value={custoEstimado} toolTip="Custo estimado ?? calculado atrav??s das despesas cadastradas + os recursos fixos (multiplicados pela quantidade de pe??as) + os recursos utilizados (horas despendidas nas etapas * valor/hora)." />
          </Grid>
          <Grid item xs={6} sm={2}>     
            <PriceCard label="Valor recebido" value={valorRecebido} toolTip="Valor recebido ?? a soma das receitas cadastradas." />
          </Grid>                    
        </Grid>

        <ContentCard header="Informa????es do servi??o:" marginTop={2}>
          <form id="formService" onSubmit={formik.handleSubmit} noValidate> 
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField     
                  variant="outlined"
                  value={props.service.baseService && props.service.baseService.name}
                  label="Base de servi??o:"
                  disabled
                  fullWidth />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomerInput options={props.controller.customers} value={formik.values.customer} 
                  onChange={(event: any, value: string | Customer | null) => { formik.setFieldValue('customer', value); }}
                  errorExpression={formik.touched.customer && Boolean(formik.errors.customer)}
                  helperText={formik.touched.customer && formik.errors.customer}
                  disabled={!inProgressService}
                  handleAddCustomer={(newCustomer: Customer) => { addNewCustomer(newCustomer) }} />

              </Grid>
              <Grid item xs={6} sm={4}> 
                <CurrencyRealInput id="inputHourValue" label="Valor/hora:" required 
                    value={formik.values.hourValue}
                    onValueChange={ (values: any) => formik.setFieldValue('hourValue', values.floatValue) }
                    error={formik.touched.hourValue && Boolean(formik.errors.hourValue)}
                    helperText={formik.touched.hourValue && formik.errors.hourValue}
                    disabled={!inProgressService} />
              </Grid>                    
              <Grid item xs={6} sm={4}> 
                <CurrencyRealInput id="inputPrice" label="Pre??o cobrado:" required 
                    value={formik.values.price}
                    onValueChange={ (values: any) => formik.setFieldValue('price', values.floatValue) }
                    error={formik.touched.price && Boolean(formik.errors.price)}
                    helperText={formik.touched.price && formik.errors.price}
                    disabled={!inProgressService} />
              </Grid>          
              <Grid item xs={12} sm={4}>            
                <TextField
                  id="inputDeadline"
                  label="Prazo de conclus??o:"
                  required
                  value={formik.values.deadline}
                  onChange={ (event) => { formik.setFieldValue('deadline', event.target.value); } }  
                  error={formik.touched.deadline && Boolean(formik.errors.deadline)}
                  helperText={formik.touched.deadline && formik.errors.deadline}              
                  variant="outlined"
                  type="date"
                  fullWidth
                  disabled={!inProgressService}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={8}>              
                  <TextField        
                    multiline={true}
                    variant="outlined"
                    rows="4"      
                    rowsMax="6"
                    id="observacoes"
                    disabled={!inProgressService}
                    value={formik.values.comments}
                    onChange={formik.handleChange }            
                    name="comments"
                    label="Observa????es"
                    fullWidth />
              </Grid>          
              <Grid item xs={4}> 
                <input
                  style={{ display: "none" }}
                  id="contained-button-file"
                  disabled={!inProgressService}
                  type="file"
                />
                <label htmlFor="contained-button-file">
                  <Button variant="contained" color="secondary" component="span"
                     disabled={!inProgressService}>
                    Upload
                  </Button>
                </label>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={2} justify="flex-end" style={{width: "100%"}}>
                  <Grid item xs={3} sm={1}>
                      <Button color="primary" type="submit" variant="contained"
                         disabled={!inProgressService}>Salvar</Button>
                  </Grid> 
                </Grid>           
              </Grid>
            </Grid>
          </form>
         </ContentCard>

         <ContentCard header="Especifica????o dos trabalhos:" marginTop={2}>
            <TabComponent ariaLabel="Especifica????o dos trabalhos"
              tabIndex={tabIndex} handleChange={handleChangeTab}
              tabs={
              [
                  <Tab icon={<CategoryIcon />} label="Pe??as" key={0} {...a11yPropsTab(0)} />,
                  <Tab icon={<FormatListNumberedIcon />} label="Etapas" disabled={selectedCloth == null} key={1} {...a11yPropsTab(1)} />,
                  <Tab icon={<MonetizationOnIcon />} label="Recursos" disabled={selectedStep == null} {...a11yPropsTab(2)} key={2} />
                ]                
              }
              tabPanels={
                [
                  <TabPanel value={tabIndex} index={0} key={0}>                    
                    <ClothTable serviceTypes={props.controller.serviceTypes} handleClothSelection={handleClothSelection} controller={props.controller} 
                      clothes={props.service.clothes} handleUpdateClothes={handleUpdateClothes}
                      optionsClothes={props.controller.clothes}
                      disabled={!inProgressService} />
                  </TabPanel>,
                  <TabPanel value={tabIndex} index={1} key={1}>
                    <StepTable cloth={selectedCloth} optionsBaseSteps={props.controller.baseSteps} 
                      handleStepSelection={handleStepSelection} updateClothSteps={updateClothSteps}
                      disabled={!inProgressService} />
                  </TabPanel>,
                  <TabPanel value={tabIndex} index={2} key={2}>
                    <ResourceTable step={selectedStep} optionsBaseResources={props.controller.baseResources} updateStepResources={updateStepResources}
                      disabled={!inProgressService} />
                  </TabPanel> 
                ]
              } />
        </ContentCard>

        <ContentCard header="Horas despendidas nas tarefas:" marginTop={2}>
            <RegisterSpendedTimeTable clothInstances={executionService.instancedCloths} 
              serviceSpendedTimes={executionService.spendedTimes}
              updateSpendedTimes={updateSpendedTimes}
              disabled={!inProgressService} 
              showSnackAlert={showSnackAlert} />
        </ContentCard>

        <ContentCard header="Receitas e despesas:" marginTop={2}>
            <TabComponent ariaLabel="Receitas e despesas"
              tabIndex={tabIndexReceitas} handleChange={handleChangeTabReceitas}
              tabs={
                [
                  <Tab label="Receitas" key={0} {...a11yPropsTab(0)} />,
                  <Tab label="Despesas" key={1} {...a11yPropsTab(1)} />
                ]                
              }
              tabPanels={
                [
                  <TabPanel value={tabIndexReceitas} index={0} key={0}>                    
                    <RevenueTable revenues={executionService.revenues} optionsPaymentType={props.controller.paymentTypes} updateRevenues={updateRevenues}
                      disabled={!inProgressService} />
                  </TabPanel>,
                  <TabPanel value={tabIndexReceitas} index={1} key={1}>
                      <ExpenseTable expenses={executionService.expenses} updateExpenses={updateExpenses} disabled={!inProgressService} />
                  </TabPanel>
                ]
              } />
        </ContentCard>        

        <ContentCard header="A????es:" marginTop={2}>
          <Grid container spacing={2}>            
            <Grid container justify="flex-end">
              {executionService.status.id === 2 && !executionService.payed &&
                <Grid item sm={2} xs={4}>                            
                  <Button color="primary" variant="contained" onClick={ () => payedService()}>Servi??o pago</Button>
                </Grid>
              }
              <Grid item sm={2} xs={4}>            
                {(executionService.status.id > 1) ? 
                  <Button color="primary" variant="contained" onClick={ () => reopenService()}>Reabrir servi??o</Button> : null}
              </Grid>
              {(executionService.status.id === 1 || (executionService.status.id > 1 && !executionService.serviceReturned)) &&
                <Grid item sm={2} xs={4}>            
                  {executionService.status.id === 1 ? <Button color="primary" variant="contained" onClick={ () => completeService()}>Concluir servi??o</Button> : null}
                  {(executionService.status.id > 1 && !executionService.serviceReturned) ? 
                    <Button color="primary" variant="contained" onClick={ () => returnedService()}>Retorno de servi??o</Button> : null}
                </Grid>
              }       
            </Grid>
          </Grid> 
        </ContentCard>      

      {messageSnackAlert &&
        <Snackbar open={openSnackAlert} onClose={handleCloseSnackAlert} autoHideDuration={10000}>          
          {messageSnackAlert}
        </Snackbar>      
      }
    </Container>
  );
}