import React from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useFormik } from 'formik';
import * as yup from 'yup';
import FormDialog from 'src/ui/components/base/FormDialog';
import { Step } from 'src/model/Step';
import { Resource } from 'src/model/Resource';

const validationSchema = yup.object({
    name: yup
    .string()
    .required("Nome da etapa é obrigatória!")
});

interface StepDialogProps {
  open:boolean,
  title:string,
  selectedStep:Step | null,
  optionsSteps:Step[],
  handleSave:Function,
  handleClose:Function
}

const StepDialog = (props:StepDialogProps) => {
  
  if (!props.open)
    return null;

    let editingStep = props.selectedStep;

    const formik = useFormik<{ selectedStepToCopy: Step | null, name: string, resources: Resource[] }>({    
      initialValues: { 
        selectedStepToCopy: null,
        name: editingStep ? editingStep.name : "",
        resources: editingStep ? editingStep.resources : []
      },    
      validationSchema: validationSchema,
      onSubmit: (values) => {
        const {selectedStepToCopy, ...edittedStep} = values;
        props.handleSave(edittedStep);
      }
    });

  function handleCopySelectedStep(step:Step | null) {
    formik.setValues({ selectedStepToCopy: step, name: step ? step.name : "", resources: step ? step.resources : [] });
  }

  return(
    <div>
      <FormDialog open={props.open} idForm="formDialogStep" 
          title={props.title} handleSave={props.handleSave} handleClose={props.handleClose}  >

        <form id="formDialogStep" onSubmit={formik.handleSubmit} noValidate>               
          <Grid container spacing={2}>
              <Grid item xs={12}> 
                <Autocomplete                       
                  value={formik.values.selectedStepToCopy}
                  onChange={(event, value: Step | null) => { handleCopySelectedStep(value); }} 
                  id="autocomplete-steps-copy"
                  noOptionsText="Etapa não encontrada!"  
                  options={props.optionsSteps}
                  getOptionLabel={(option) => option.name}
                  renderInput={(params) => <TextField {...params} autoFocus label="Etapa para copiar:" placeholder="Etapa" variant="outlined" />} />
              </Grid> 

              <Grid item xs={12}>
                  <TextField                           
                      required
                      value={formik.values.name}
                      onChange={ formik.handleChange }
                      error={formik.touched.name && Boolean(formik.errors.name)}
                      helperText={formik.touched.name && formik.errors.name}                                                       
                      variant="outlined"
                      id="stepName"
                      name="name"
                      label="Nome:"
                      fullWidth />
              </Grid>
              <Grid item xs={2}> 
                  Recursos:
              </Grid>
              <Grid item xs={10}> 
                  {formik.values.resources && formik.values.resources.map((resource) => resource.name).join(", ") }
              </Grid>
          </Grid>
        </form>

      </FormDialog>
    </div>
  );  
}

export default StepDialog;