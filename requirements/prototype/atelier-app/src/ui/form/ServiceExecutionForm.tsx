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
  containerFullHeight: {
    height: "100%"
  }
});

const validationSchema = yup.object({
  customer: yup
  .object()
  .required("Cliente é obrigatório!")
  .typeError("Cliente é obrigatório!"),
  hourValue: yup
  .number()
  .min(0.01, "O valor/hora deve ser maior que zero!")
  .required("Valor/hora é obrigatório!"),  
  price: yup
  .number()
  .min(0.00, "O preço deve ser maior ou igual a zero!")
  .required("Preço é obrigatório!"),
  deadline: yup
  .string()
  .required("Prazo de conclusão é obrigatório!")
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

    showSnackAlert("Peças atualizadas com sucesso!", 'success');

    props.handleServiceUpdate(service);
  }

  function updateSpendedTimes(spendedTimes: SpendTime[]) {
    setExecutionService({...executionService, spendedTimes: spendedTimes});
  }

  function updateExpenses(expenses: Expense[]) {
    setExecutionService({...executionService, expenses: expenses});
    showSnackAlert("Despesas atualizadas com sucesso!", 'success');
  }

  function updateRevenues(revenues: Revenue[]) {
    setExecutionService({...executionService, revenues: revenues});
    showSnackAlert("Receitas atualizadas com sucesso!", 'success');
  }

  function completeService() {
    setExecutionService({...executionService, status: props.controller.getStatusCompletedService()});
  }

  function payedService() {
    setExecutionService({...executionService, status: props.controller.getStatusPayedService()});
  } 
  
  function reopenService() {
    setExecutionService({...executionService, status: props.controller.getStatusProgressService()});
  }  

  function returnedService() {
    setExecutionService({...executionService, status: props.controller.getStatusProgressService(), serviceReturned: true});
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
      setExecutionService({...executionService, hourValue: values.hourValue, service: changedService});
      showSnackAlert("Serviço atualizado com sucesso!", "success");
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
              <Grid item xs={11}>                
                <Typography variant="h4" align="center" gutterBottom className={classes.titlePage} component="span">
                  Execução de serviço #{executionService.service.id}
                </Typography>
              </Grid>
              <Grid item xs={1}>
                {
                  executionService.serviceReturned &&                                
                  <Tooltip title="Serviço com retorno de ajustes">   
                    <IconButton aria-label="Serviço com retorno de ajustes" className={classes.serviceReturned}>
                      <BuildIcon />
                    </IconButton>        
                  </Tooltip>
                }
              </Grid>
            </Grid>
          </Grid>          
          <Grid item xs={6} sm={2}>  
              <PriceCard label="Valor base" value={precoBaseTotal} toolTip="Valor base é calculado através do valor unitário das peças * a sua quantidade." />
          </Grid>
          <Grid item xs={6} sm={2}>     
            <PriceCard label="Preço cobrado" value={formik.values.price} valueColor={valorCobradoColor} toolTip="Preço informado ao cliente." />
          </Grid>
          <Grid item xs={6} sm={2}>     
            <PriceCard label="Custo estimado" value={custoEstimado} toolTip="Custo estimado é calculado através das despesas cadastradas + os recursos fixos (multiplicados pela quantidade de peças) + os recursos utilizados (horas despendidas nas etapas * valor/hora)." />
          </Grid>
          <Grid item xs={6} sm={2}>     
            <PriceCard label="Valor recebido" value={valorRecebido} toolTip="Valor recebido é a soma das receitas cadastradas." />
          </Grid>                    
        </Grid>

        <ContentCard header="Informações do serviço:" marginTop={2}>
          <form id="formService" onSubmit={formik.handleSubmit} noValidate> 
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField     
                  variant="outlined"
                  value={props.service.baseService && props.service.baseService.name}
                  label="Base de serviço:"
                  disabled
                  fullWidth />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomerInput options={props.controller.customers} value={formik.values.customer} 
                  onChange={(event: any, value: string | Customer | null) => { formik.setFieldValue('customer', value); }}
                  errorExpression={formik.touched.customer && Boolean(formik.errors.customer)}
                  helperText={formik.touched.customer && formik.errors.customer}
                  handleAddCustomer={(newCustomer: Customer) => { addNewCustomer(newCustomer) }} />

              </Grid>
              <Grid item xs={6} sm={4}> 
                <CurrencyRealInput id="inputHourValue" label="Valor/hora:" required 
                    value={formik.values.hourValue}
                    onValueChange={ (values: any) => formik.setFieldValue('hourValue', values.floatValue) }
                    error={formik.touched.hourValue && Boolean(formik.errors.hourValue)}
                    helperText={formik.touched.hourValue && formik.errors.hourValue} />
              </Grid>                    
              <Grid item xs={6} sm={4}> 
                <CurrencyRealInput id="inputPrice" label="Preço cobrado:" required 
                    value={formik.values.price}
                    onValueChange={ (values: any) => formik.setFieldValue('price', values.floatValue) }
                    error={formik.touched.price && Boolean(formik.errors.price)}
                    helperText={formik.touched.price && formik.errors.price} />
              </Grid>          
              <Grid item xs={12} sm={4}>            
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
              <Grid item xs={8}>              
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
              <Grid item xs={4}> 
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
              <Grid item xs={12}>
                <Grid container spacing={2} justify="flex-end" style={{width: "100%"}}>
                  <Grid item xs={3} sm={1}>
                      <Button color="primary" type="submit" variant="contained">Salvar</Button>
                  </Grid> 
                </Grid>           
              </Grid>
            </Grid>
          </form>
         </ContentCard>

         <ContentCard header="Especificação dos trabalhos:" marginTop={2}>
          <Grid container spacing={2}>
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
                      <StepTable cloth={selectedCloth} optionsBaseSteps={props.controller.baseSteps} 
                        handleStepSelection={handleStepSelection} controller={props.controller} />
                    </TabPanel>,
                    <TabPanel value={tabIndex} index={2} key={2}>
                      <ResourceTable step={selectedStep} optionsBaseResources={props.controller.baseResources} controller={props.controller} />
                    </TabPanel> 
                  ]
                } />
              </Grid>
            </Grid>
        </ContentCard>

        <ContentCard header="Horas despendidas nas tarefas:" marginTop={2}>
            <RegisterSpendedTimeTable clothInstances={executionService.instancedCloths} 
              serviceSpendedTimes={executionService.spendedTimes}
              updateSpendedTimes={updateSpendedTimes} 
              showSnackAlert={showSnackAlert} />
        </ContentCard>

        <ContentCard header="Receitas e despesas:" marginTop={2}>
          <Grid container spacing={2}>
            <Grid item xs={12}>

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
                      <RevenueTable revenues={executionService.revenues} optionsPaymentType={props.controller.paymentTypes} updateRevenues={updateRevenues} />
                    </TabPanel>,
                    <TabPanel value={tabIndexReceitas} index={1} key={1}>
                        <ExpenseTable expenses={executionService.expenses} updateExpenses={updateExpenses} />
                    </TabPanel>
                  ]
                } />
              </Grid>
            </Grid>
        </ContentCard>        

        <ContentCard header="Ações:" marginTop={2}>
          <Grid container spacing={2}>            
            <Grid container justify="flex-end">
              <Grid item sm={2} xm={4}>                            
                {executionService.status.id === 2 ? <Button color="primary" variant="contained" onClick={ () => payedService()}>Serviço pago</Button> : null}
              </Grid>    
              <Grid item sm={2} xm={4}>            
                {(executionService.status.id > 1) ? 
                  <Button color="primary" variant="contained" onClick={ () => reopenService()}>Reabrir serviço</Button> : null}
              </Grid>
              <Grid item sm={2} xm={4}>            
                {executionService.status.id === 1 ? <Button color="primary" variant="contained" onClick={ () => completeService()}>Concluir serviço</Button> : null}
                {(executionService.status.id > 1 && !executionService.serviceReturned) ? 
                  <Button color="primary" variant="contained" onClick={ () => returnedService()}>Retorno de serviço</Button> : null}
              </Grid>              
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