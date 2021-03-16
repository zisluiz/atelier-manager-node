import React from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { useFormik } from 'formik';
import * as yup from 'yup';
import FormDialog from 'src/ui/components/base/FormDialog';
import CurrencyRealInput from 'src/ui/components/base/CurrencyRealInput';
import { Revenue } from 'src/model/Revenue';
import { PaymentType } from 'src/model/PaymentType';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import ComboBox from '../components/base/ComboBox';

const validationSchema = yup.object({
    description: yup
    .string()
    .required("Descrição da receita é obrigatória!"),
    value: yup
    .number()
    .min(0.01, "O valor deve ser maior que zero!")
    .required("Valor da receita é obrigatória!"),
    paymentTypeId: yup
    .number()
    .required("Forma de pagamento é obrigatória!")    
});

interface RevenueDialogProps {
  open:boolean,
  title:string,
  selectedRevenue:Revenue,
  optionsPaymentType:PaymentType[],  
  handleSave:Function,
  handleClose:Function
}

const RevenueDialog = (props:RevenueDialogProps) => {
  
  if (!props.open)
    return null;

    let editingRevenue = props.selectedRevenue;

    const formik = useFormik< {selectedRevenueToCopy: Revenue, description: string, value: number, paymentTypeId: number} >({    
      initialValues: { 
        selectedRevenueToCopy: editingRevenue,
        description: editingRevenue ? editingRevenue.description : "",
        value: editingRevenue ? editingRevenue.value : 0.00,
        paymentTypeId: editingRevenue.paymentType.id
      },    
      validationSchema: validationSchema,
      onSubmit: (values) => {
        const edittedRevenue = {...values.selectedRevenueToCopy, ...values, paymentType: getPaymentType(values.paymentTypeId)};
        props.handleSave(new Revenue(edittedRevenue.id, edittedRevenue.description, edittedRevenue.value, edittedRevenue.paymentType));
      }
    });

    function getPaymentType(idPaymentType: number):PaymentType {
      return props.optionsPaymentType.filter( (paymentType) => paymentType.id == idPaymentType)[0];
    }

    function getNetValue() {
        return new Revenue(0, "", formik.values.value, getPaymentType(formik.values.paymentTypeId)).getNetValue();
    }

  return(
    <div>
      <FormDialog open={props.open} idForm="formDialogRevenue" 
          title={props.title} handleSave={props.handleSave} handleClose={props.handleClose}  >

        <form id="formDialogRevenue" onSubmit={formik.handleSubmit} noValidate>               
          <Grid container spacing={2}>
              <Grid item xs={12}>
                  <TextField
                      autoFocus
                      required
                      value={formik.values.description}
                      onChange={ formik.handleChange }
                      error={formik.touched.description && Boolean(formik.errors.description)}
                      helperText={formik.touched.description && formik.errors.description}                                                       
                      variant="outlined"
                      id="revenueDescription"
                      name="description"
                      label="Descrição:"
                      fullWidth />
              </Grid>
              <Grid item xs={12}>
                  <CurrencyRealInput id="revenueValue" label="Valor:"
                    required
                    value={formik.values.value}
                    onValueChange={ (values: any) => formik.setFieldValue('value', values.floatValue) }
                    error={formik.touched.value && Boolean(formik.errors.value)}
                    helperText={formik.touched.value && formik.errors.value} />
              </Grid>
              <Grid item xs={12}>

                <ComboBox idLabel="payment-type-label" value={formik.values.paymentTypeId}
                  label="Forma de pagamento:" options={props.optionsPaymentType}
                  error={formik.touched.paymentTypeId && Boolean(formik.errors.paymentTypeId)}
                  helperText={formik.touched.paymentTypeId && formik.errors.paymentTypeId}
                  handleChange={(value) => formik.setFieldValue('paymentTypeId', value) } />
              </Grid>
              <Grid item xs={12}>
                <CurrencyRealInput label="Valor líquido:"
                      value={getNetValue()}
                      disabled />                
              </Grid>

          </Grid>
        </form>

      </FormDialog>
    </div>
  );  
}

export default RevenueDialog;