import React from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CurrencyRealInput from 'src/ui/components/CurrencyRealInput';
import IntegerInput from 'src/ui/components/IntegerInput';
import { Cloth } from 'src/model/Cloth';
import { ServiceType } from 'src/model/ServiceType';
import { useFormik } from 'formik';
import * as yup from 'yup';
import FormDialog from '../components/FormDialog';

const validationSchema = yup.object({
    name: yup
    .string()
    .required("Nome da peça é obrigatória!"),
    quantity: yup
    .number()
    .min(1, "A quantidade deve ser de uma ou mais peças!")
    .integer()
    .required("Quantidade de peças é obrigatória!"),
    price: yup
    .number()    
    .min(0.01, "O preço deve ser maior que zero!")
    .required("Preço da peça é obrigatório!"),
    serviceTypes: yup
    .array() 
    .min(1, "Selecione ao menos um tipo de serviço!")
});

interface ClothDialogProps {
  open:boolean,
  title:string,
  selectedCloth:Cloth,
  optionsServiceTypes:ServiceType[],
  optionsClothes:Cloth[],
  handleSave:Function,
  handleClose:Function
}

const ClothDialog = (props:ClothDialogProps) => {
  
  if (!props.open)
    return null;

    let editingCloth = props.selectedCloth;

    const formik = useFormik({    
      initialValues: { 
        selectedClothToCopy: null,
        name: editingCloth.name,
        quantity: editingCloth.quantity,
        price: editingCloth.price,
        serviceTypes: editingCloth.serviceTypes,
        steps: editingCloth.steps
      },    
      validationSchema: validationSchema,
      onSubmit: (values) => {      
        const {selectedClothToCopy, ...edittedCloth} = values;
        props.handleSave(edittedCloth);
      }
    });

    function handleCopySelectedCloth(cloth:Cloth) {
      formik.setValues({ selectedClothToCopy: cloth, name: cloth ? cloth.name : "", quantity: cloth ? cloth.quantity : 1, 
        price: cloth ? cloth.quantity : 0.00, serviceTypes: cloth ? cloth.serviceTypes : [], steps: cloth ? cloth.steps : [] });
    }    

  return(
    <div>
      <FormDialog open={props.open} idForm="formDialogCloth" 
          title={props.title} handleSave={props.handleSave} handleClose={props.handleClose}  >

        <form id="formDialogCloth" onSubmit={formik.handleSubmit} noValidate>        
          <Grid container spacing={2}>
            <Grid item xs={12}> 
              <Autocomplete                       
                value={formik.values.selectedClothToCopy}
                onChange={(event, value: Cloth) => { handleCopySelectedCloth(value); }} 
                id="autocomplete-cloths-copy"
                noOptionsText="Roupa não encontrada!"  
                options={props.optionsClothes}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => <TextField {...params} autoFocus label="Roupa para copiar:" placeholder="Roupa" variant="outlined" />} />
            </Grid> 

            <Grid item xs={12}>
                <TextField                    
                    required
                    value={formik.values.name}
                    onChange={ formik.handleChange }
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}                                                       
                    variant="outlined"
                    id="clothName"
                    name="name"
                    label="Nome:"
                    fullWidth />
            </Grid>
            <Grid item xs={12}> 
                <IntegerInput required 
                    value={formik.values.quantity}
                    onValueChange={ (values: any) => { formik.setFieldValue('quantity', values.floatValue ? values.floatValue : ''); } }
                    error={formik.touched.quantity && Boolean(formik.errors.quantity)}
                    helperText={formik.touched.quantity && formik.errors.quantity}
                    id="clothQuantity" name="quantity" label="Quantidade:" variant="outlined" />
            </Grid>  
            <Grid item xs={12}>
                <CurrencyRealInput id="clothPrice" label="Preço unitário:"
                  required name="price"
                  value={formik.values.price}
                  onValueChange={ (values: any) => formik.setFieldValue('price', values.floatValue) }
                  error={formik.touched.price && Boolean(formik.errors.price)}
                  helperText={formik.touched.price && formik.errors.price} />
            </Grid> 
            <Grid item xs={12}> 
            <Autocomplete                        
                value={formik.values.serviceTypes}
                onChange={(event, values) => { formik.setFieldValue('serviceTypes', values); }}
                multiple
                filterSelectedOptions
                id="autocomplete-base-services"
                noOptionsText="Tipo não encontrado!"                  
                options={props.optionsServiceTypes}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => <TextField {...params} label="Base de Serviço:" required placeholder="Serviços" variant="outlined"                        
                            name="serviceTypes"  
                            error={formik.touched.serviceTypes && Boolean(formik.errors.serviceTypes)}
                            helperText={formik.touched.serviceTypes && formik.errors.serviceTypes}     />} />
            </Grid>
            <Grid item xs={10}> 
                  {formik.values.steps && formik.values.steps.map((step) => step.name).join(", ") }
              </Grid>            
          </Grid>
        </form>

      </FormDialog>
    </div>
  );  
}

export default ClothDialog;