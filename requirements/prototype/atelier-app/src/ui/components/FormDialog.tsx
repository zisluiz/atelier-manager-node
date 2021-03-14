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
import YupLocale from 'yup/lib/locale';

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

interface FormDialogProps {
  children: any,
  open:boolean,
  title:string,
  idForm: string,
  handleSave:Function,
  handleClose:Function
}

const FormDialog = (props:FormDialogProps) => {
  
  if (!props.open)
    return null;

  return(
    <div>
      <Dialog onClose={() => props.handleClose()} aria-labelledby="customized-dialog-title" open={props.open}>
        <DialogTitle id="customized-dialog-title" onClose={() => props.handleClose()}>
          {props.title}
        </DialogTitle>

        <DialogContent dividers>
         
          { props.children }
          
        </DialogContent>
        <DialogActions>
          <Button color="primary" type="submit" form={props.idForm} variant="contained">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );  
}

export default FormDialog;