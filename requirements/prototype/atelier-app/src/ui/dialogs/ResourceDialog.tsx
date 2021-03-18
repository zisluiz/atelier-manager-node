import React from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import HelpIcon from '@material-ui/icons/Help';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import { useFormik } from 'formik';
import * as yup from 'yup';
import FormDialog from 'src/ui/components/base/FormDialog';
import { CostType, Resource, getCostTypeName, getCostByTypeName } from 'src/model/Resource';
import CurrencyRealInput from 'src/ui/components/base/CurrencyRealInput';
import RadioButtonsGroup from 'src/ui/components/base/RadioButtonsGroup';
import * as EnumUtil from 'src/util/EnumUtil';

const tipCostApplication = 
  "Quando o custo é FIXO, o custo é multiplicado pela quantidade de peças uma única vez. Quando o custo é por hora, o custo é multiplicado pelas horas despendidas na etapa."

const validationSchema = yup.object({
    name: yup
    .string()
    .required("Nome do recurso é obrigatório!"),
    cost: yup
    .number()
    .min(0.00, "O preço deve ser maior ou igual a zero!")
    .required("Preço do recurso é obrigatório!"),
    costType: yup
    .string()
    .required("Tipo do custo é obrigatório!")
});

interface ResourceDialogProps {
  open:boolean,
  title:string,
  selectedResource:Resource | null,
  optionsResources:Resource[],
  handleSave:Function,
  handleClose:Function
}

const ResourceDialog = (props:ResourceDialogProps) => {
  
  if (!props.open)
    return null;

    let editingResource = props.selectedResource;

    const costTypesAsString = EnumUtil.getKeyArray(CostType);    
    const optionsCostTypes = costTypesAsString.map((costType: string) => { return { value: costType, label: getCostTypeName(getCostByTypeName(costType))} });
    
    const formik = useFormik< {selectedResourceToCopy: Resource | null, name: string, cost: number, costType: string, defaultSpendTime: string | null | undefined} >({    
      initialValues: { 
        selectedResourceToCopy: null,
        name: editingResource ? editingResource.name : "",
        cost: editingResource ? editingResource.cost : 0.00,
        costType: editingResource ? getCostByTypeName(editingResource.costType) : getCostTypeName(CostType.FIXED),
        defaultSpendTime: editingResource ? editingResource.defaultSpendTime : "",
      },    
      validationSchema: validationSchema,
      onSubmit: (values) => {
        const {selectedResourceToCopy, ...edittedResource} = values;
        props.handleSave(edittedResource);
      }
    });

  function handleCopySelectedResource(resource:Resource | null) {
    formik.setValues({ selectedResourceToCopy: resource, name: resource ? resource.name : "", cost: resource ? resource.cost : 0.00, 
      costType: resource ? CostType[resource.costType] : CostType[CostType.FIXED], defaultSpendTime: resource ? resource.defaultSpendTime : "" });
  }

  return(
    <div>
      <FormDialog open={props.open} idForm="formDialogResource" 
          title={props.title} handleSave={props.handleSave} handleClose={props.handleClose}  >

        <form id="formDialogResource" onSubmit={formik.handleSubmit} noValidate>               
          <Grid container spacing={2}>
              <Grid item xs={10}> 
                <Autocomplete                       
                  value={formik.values.selectedResourceToCopy}
                  onChange={(event, value: Resource | null) => { handleCopySelectedResource(value); }} 
                  id="autocomplete-resources-copy"
                  noOptionsText="Recurso não encontrado!"  
                  options={props.optionsResources}
                  getOptionLabel={(option) => option.name}
                  renderInput={(params) => <TextField {...params} label="Recurso para copiar:" autoFocus placeholder="Recurso" variant="outlined" />} />
              </Grid> 

              <Grid item xs={10}>
                  <TextField
                      required
                      value={formik.values.name}
                      onChange={ formik.handleChange }
                      error={formik.touched.name && Boolean(formik.errors.name)}
                      helperText={formik.touched.name && formik.errors.name}                                                       
                      variant="outlined"
                      id="resourceName"
                      name="name"
                      label="Nome:"
                      fullWidth />
              </Grid>
              <Grid item xs={10}>
                  <CurrencyRealInput id="resourceCost" label="Custo (R$):"
                    required name="cost"
                    value={formik.values.cost}
                    onValueChange={ (values: any) => formik.setFieldValue('cost', values.floatValue) }
                    error={formik.touched.cost && Boolean(formik.errors.cost)}
                    helperText={formik.touched.cost && formik.errors.cost} />
              </Grid> 
              <Grid item xs={2}>
                {
                <Tooltip title={tipCostApplication}>   
                  <IconButton aria-label={tipCostApplication}>
                    <HelpIcon />
                  </IconButton>        
                </Tooltip>}
              </Grid>
              <Grid item xs={10}>
                  <RadioButtonsGroup name="costType" ariaLabel="Tipo de custo:" label="Tipo de custo:" 
                    selected={formik.values.costType} options={optionsCostTypes} 
                    handleChange={ (value: string) => formik.setFieldValue('costType', value) } />
              </Grid>
              <Grid item xs={10}>
                <TextField
                  id="defaultSpendTime"
                  name="defaultSpendTime"
                  label="Tempo padrão gasto:"                
                  type="time"            
                  value={formik.values.defaultSpendTime}
                  onChange={ formik.handleChange }     
                  fullWidth
                  variant="outlined"                          
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    step: 300, // 5 min
                  }} />
              </Grid>                           
          </Grid>
        </form>

      </FormDialog>
    </div>
  );  
}

export default ResourceDialog;