import React from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { useFormik } from 'formik';
import * as yup from 'yup';
import FormDialog from 'src/ui/components/base/FormDialog';
import CurrencyRealInput from 'src/ui/components/base/CurrencyRealInput';
import { Expense } from 'src/model/Expense';

const validationSchema = yup.object({
    description: yup
    .string()
    .required("Descrição da despesa é obrigatória!"),
    value: yup
    .number()
    .min(0.01, "O valor deve ser maior que zero!")
    .required("Valor da despesa é obrigatória!")
});

interface ExpenseDialogProps {
  open:boolean,
  title:string,
  selectedExpense:Expense,
  handleSave:Function,
  handleClose:Function
}

const ExpenseDialog = (props:ExpenseDialogProps) => {
  
  if (!props.open)
    return null;

    let editingExpense = props.selectedExpense;

    const formik = useFormik< {selectedExpenseToCopy: Expense, description: string, value: number} >({    
      initialValues: { 
        selectedExpenseToCopy: editingExpense,
        description: editingExpense ? editingExpense.description : "",
        value: editingExpense ? editingExpense.value : 0.00
      },    
      validationSchema: validationSchema,
      onSubmit: (values) => {
        const edittedExpense = {...values.selectedExpenseToCopy, ...values} ;
        props.handleSave(edittedExpense);
      }
    });

  return(
    <div>
      <FormDialog open={props.open} idForm="formDialogExpense" 
          title={props.title} handleSave={props.handleSave} handleClose={props.handleClose}  >

        <form id="formDialogExpense" onSubmit={formik.handleSubmit} noValidate>               
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
                      id="expenseDescription"
                      name="description"
                      label="Descrição:"
                      fullWidth />
              </Grid>
              <Grid item xs={12}>
                  <CurrencyRealInput id="expenseValue" label="Valor:"
                    required
                    value={formik.values.value}
                    onValueChange={ (values: any) => formik.setFieldValue('value', values.floatValue) }
                    error={formik.touched.value && Boolean(formik.errors.value)}
                    helperText={formik.touched.value && formik.errors.value} />
              </Grid>
          </Grid>
        </form>

      </FormDialog>
    </div>
  );  
}

export default ExpenseDialog;