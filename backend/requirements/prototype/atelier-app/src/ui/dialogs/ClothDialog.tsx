import React from 'react';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CurrencyRealInput from 'src/ui/components/CurrencyRealInput';
import IntegerInput from 'src/ui/components/IntegerInput';
import { Cloth } from 'src/model/Cloth';
import { ServiceType } from 'src/model/ServiceType';
import { useFormik } from 'formik';
import * as yup from 'yup';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      margin: 0,
      padding: theme.spacing(2),
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
  });

export interface DialogTitleProps extends WithStyles<typeof styles> {
  id: string;
  children: React.ReactNode;
  onClose: () => void;
}

const DialogTitle = withStyles(styles)((props: DialogTitleProps) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme: Theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

const validationSchema = yup.object({
  editingCloth: yup.object().shape({
    name: yup
      .string()
      .required('Nome da peça é obrigatória')
  })
});

export type ClothDialogOptions = {
  isShowing: any,
  openNewCloth: any,
  openEditCloth: any,
  changeCloth: any,
  handleClose: any,
  data: any
}

const useClothDialogControl = (serviceTypes:ServiceType[]):ClothDialogOptions => {
  const [isShowing, setIsShowing] = React.useState(false);
  const [data, setData] = React.useState({ serviceTypes: serviceTypes, editingCloth: {}});

  function openNewCloth() {        
    const updatedData = { ...data, editingCloth: createNewCloth()};    
    setData(updatedData);
    setIsShowing(true);
  }

  function openEditCloth(selectedCloath:Cloth) {
    const updatedData = { ...data, editingCloth: {...selectedCloath}};    
    setData(updatedData);
    setIsShowing(true);
  }

  function changeCloth(property:any) {    
    const updatedData = {... data, editingCloth: {...data.editingCloth, ...property}};
    setData(updatedData);
  }

  function handleClose() {
    setIsShowing(false);
  }

  function createNewCloth():Cloth {
    return new Cloth('', 1, 0.00, [], null);
  }

  return {
    isShowing,
    openNewCloth,
    openEditCloth,
    changeCloth,
    handleClose,
    data
  }
};

const ClothDialog = ({ isShowing, handleClose, handleSave, changeCloth, data }) => {
  
  if (!isShowing)
    return null;

  const formik = useFormik({
    initialValues: {
      editingCloth: {
        name: ''
      }
    },    
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log(values);
      handleSave();
    },
  });    

  return(
    <div>
      <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={isShowing}>
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          Cadastrar peça
        </DialogTitle>

        <DialogContent dividers>
         
          <form id="formDialogCloth" onSubmit={formik.handleSubmit} noValidate>
        
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField     
                            autoFocus
                            required
                            value={formik.values.editingCloth.name}
                            onChange={formik.handleChange}
                            error={formik.touched.editingCloth && formik.touched.editingCloth.name && formik.errors.editingCloth && Boolean(formik.errors.editingCloth.name)}
                            helperText={formik.touched.editingCloth && formik.touched.editingCloth.name && formik.errors.editingCloth && formik.errors.editingCloth.name}

                               
                                                       
                            variant="outlined"
                            id="clothName"
                            name="clothName"
                            label="Nome:"
                            fullWidth />
                    </Grid>
                    <Grid item xs={12}> 
                        <IntegerInput value={data.editingCloth.quantity}  
                            required
                            onValueChange={ values => changeCloth({ 'quantity' : values.floatValue}) }    
                            id="clothQuantity" label="Quantidade:" variant="outlined" />
                    </Grid>  
                    <Grid item xs={12}>
                        <CurrencyRealInput id="clothPrice" label="Preço unitário:" value={data.editingCloth.price}
                          required onValueChange={ values => changeCloth({ 'price' : values.floatValue}) } />
                    </Grid> 
                    <Grid item xs={12}> 
                    <Autocomplete                        
                        onChange={(event, values) => { changeCloth({ 'serviceTypes' : values}); }}
                        multiple
                        filterSelectedOptions
                        id="autocomplete-base-services"
                        noOptionsText="Tipo não encontrado!"                  
                        options={data.serviceTypes}
                        getOptionLabel={(option) => option.name}
                        renderInput={(params) => <TextField {...params} label="Base de Serviço:" required placeholder="Serviços" variant="outlined"  />} />
                    </Grid>                                                           
                </Grid>
              </form>

        </DialogContent>
        <DialogActions>
          <Button color="primary" type="submit" form="formDialogCloth">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
        );  
}

export { useClothDialogControl, ClothDialog };