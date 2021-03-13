import React, { useRef } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import Autocomplete from '@material-ui/lab/Autocomplete';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import AddBoxIcon from '@material-ui/icons/AddBox';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered';
import CategoryIcon from '@material-ui/icons/Category';
import Box from '@material-ui/core/Box';
import CurrencyRealInput from 'src/ui/components/CurrencyRealInput';
import ClothTable from 'src/ui/tables/ClothTable';
import Controller from 'src/controller/Controller';
import Customer from 'src/model/Customer';

export default function ServiceRequisitionPage() {
  const controller = new Controller();

  interface TabPanelProps {
    children?: React.ReactNode;
    index: any;
    value: any;
  }
  
  function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (          
          <Box p={3}>
            {children}
          </Box>
        )}
      </div>
    );
  }
  
  function a11yProps(index: any) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  const inputCustomerRef = useRef('');
  const [tabIndex, setTabIndex] = React.useState(0);
  var selectedCustomer:Customer = null;

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabIndex(newValue);
  };

  console.log('Service requisition loaded');

  //const clothDialogOptions:ClothDialogOptions = useClothDialogControl(controller.serviceTypes, handleSaveCloth);  
  
  return (
    <Container component="main" maxWidth="lg">
      <form>
        <Typography variant="h4" align="center" gutterBottom>
          Requisição de serviço
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Autocomplete
              id="autocomplete-base-services"
              noOptionsText="Serviço não encontrado!"                  
              options={controller.baseServices}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => <TextField {...params} label="Base de Serviço:" variant="outlined" required/>}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Grid container>
              <Grid item xs={11}>            
                  <Autocomplete
                    id="autocomplete-customers"  
                    noOptionsText="Cliente não encontrado!"                    
                    freeSolo={true}   
                    value={selectedCustomer}          
                    options={controller.customers}                    
                    getOptionLabel={(option) => option.name}
                    renderInput={(params) => <TextField {...params} inputRef={inputCustomerRef} label="Cliente:" variant="outlined" required />}
                  />
              </Grid>
              <Grid item xs={1}>      
                <IconButton aria-label="add" title="Criar novo cliente" color="secondary" 
                    onClick={() => { let newCustomer = { name: inputCustomerRef.current.value}; controller.customers.push(newCustomer); selectedCustomer = newCustomer; }} >
                  <AddBoxIcon fontSize="large" />
                </IconButton> 
              </Grid>
            </Grid>           
          </Grid>
          <Grid item xs={12} sm={6}>
              <TextField        
                multiline={true}
                variant="outlined"
                rows="4"      
                rowsMax="6"
                id="observacoes"
                name="observacoes"
                label="Observações"
                fullWidth />
          </Grid>           
          <Grid item xs={6} sm={3}>            
            <TextField
              id="inputDeadline"
              label="Prazo de conclusão:"
              variant="outlined"
              type="date"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={6} sm={3}> 
            <CurrencyRealInput id="inputPrice" label="Preço:" required />
          </Grid>
          <Grid item xs={12} sm={12}> 
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
          <Grid item xs={12} sm={12}>
            <Paper square>
              <Tabs
                value={tabIndex}
                onChange={handleChange}
                variant="fullWidth"
                indicatorColor="secondary"
                textColor="secondary"
                aria-label="Especificação dos trabalhos">
                <Tab icon={<CategoryIcon />} label="Peças" {...a11yProps(0)} />
                <Tab icon={<FormatListNumberedIcon />} label="Etapas" disabled {...a11yProps(1)} />
                <Tab icon={<MonetizationOnIcon />} label="Recursos" disabled {...a11yProps(2)} />
              </Tabs>

              <TabPanel value={tabIndex} index={0}>

                <ClothTable clothes={controller.clothes} serviceTypes={controller.serviceTypes} />

              </TabPanel>
              <TabPanel value={tabIndex} index={1}>
                Page Two
              </TabPanel>
              <TabPanel value={tabIndex} index={2}>
                Page Three
              </TabPanel>              
            </Paper>          
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}