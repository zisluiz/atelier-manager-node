import Button from '@material-ui/core/Button';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import theme from 'src/theme';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import AlertDialog from 'src/ui/components/base/AlertDialog';
import RevenueDialog from 'src/ui/dialogs/RevenueDialog';
import * as ArraysUtil from 'src/util/ArraysUtil';
import * as IdentityUtil from 'src/util/IdentityUtil';
import EmptyRowDataTable from 'src/ui/components/base/EmptyRowDataTable';
import CurrencyRealOutput from 'src/ui/components/base/CurrencyRealOutput';
import { Revenue } from 'src/model/Revenue';
import { PaymentType } from 'src/model/PaymentType';

const useStyles = makeStyles({
    root: {    
      [theme.breakpoints.down('sm')]: {
        maxWidth: "700px"
      }
    }, columnOption: {    
        [theme.breakpoints.up('sm')]: {
          width: "120px"
        }
    }
});

interface RevenueTableProps {    
    revenues: Revenue[],
    optionsPaymentType: PaymentType[],
    disabled?: boolean,
    updateRevenues(revenues: Revenue[]):void
}

const RevenueTable = (props:RevenueTableProps) => {    
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [selectedRow, setSelectedRow] = React.useState<Revenue | null>(null);
    const [revenueToRemove, setRevenueToRemove] = React.useState<Revenue | null>(null);
    const [messageAlertDialog, setMessageAlertDialog] = React.useState("");
    const [isAlertDialogOpen, setIsAlertDialogOpen] = React.useState(false);
    const classes = useStyles();

    function openNewRevenue() {
        setSelectedRow(createNewRevenue());
        setIsDialogOpen(true);
    }

    function openEditRevenue(revenueToEdit:Revenue) {
        setSelectedRow(revenueToEdit);
        setIsDialogOpen(true);
    }

    function handleSaveRevenue(revenueToSave:Revenue) {
        let newRevenues = null;

        if (selectedRow?.id == 0) {
            revenueToSave.id = IdentityUtil.generateId();
            newRevenues = ArraysUtil.addObject(props.revenues, revenueToSave);            
        } else {                        
            newRevenues = ArraysUtil.updateObject(props.revenues, selectedRow, revenueToSave);
        }
        props.updateRevenues(newRevenues);
        handleCloseDialog();
    } 

    function removeRevenue() {
        const newRevenues = ArraysUtil.removeObject(props.revenues, revenueToRemove);
        props.updateRevenues(newRevenues);
        closeAlertDialog();
    }
    
    function handleCloseDialog() {
        setIsDialogOpen(false);
    }

    function createNewRevenue():Revenue {
        return new Revenue(0, "", 0.00, props.optionsPaymentType[0]);
    } 

    function alertDialog(row:Revenue) {
        setRevenueToRemove(row);
        setMessageAlertDialog(`Deseja realmente remover a receita \"${row.description}\"?`);
        setIsAlertDialogOpen(true);
    }

    function closeAlertDialog() {        
        setIsAlertDialogOpen(false);
    }

    return(
        <>
            {selectedRow &&
            <RevenueDialog open={isDialogOpen} selectedRevenue={selectedRow}
                    optionsPaymentType={props.optionsPaymentType}
                    handleSave={handleSaveRevenue} handleClose={handleCloseDialog} 
                    title={!selectedRow ? "" : (selectedRow.id == 0 ? "Cadastrar nova receita" : "Editar receita \"" + selectedRow.description + "\"")} />}

            <Button variant="contained" color="primary" component="span" disabled={props.disabled} onClick={ openNewRevenue }>Nova receita</Button>

            <TableContainer component={Paper} className={classes.root}>                      
                <Table size="medium" aria-label="Lista de receita">
                <TableHead>
                    <TableRow>
                    <TableCell>Receita</TableCell>
                    <TableCell align="center">Valor (R$)</TableCell>
                    <TableCell align="center">Forma de pagamento</TableCell>
                    <TableCell align="center">Valor líquido (R$)</TableCell>
                    <TableCell align="center" className={classes.columnOption}>Opções</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <EmptyRowDataTable data={props.revenues} message={"Nenhuma receita cadastrada!"} colSpan={4} />

                    {props.revenues && props.revenues.length > 0 && props.revenues.map((row) => (
                    <TableRow key={row.id}>
                        <TableCell scope="row">
                        {row.description}
                        </TableCell>
                        <TableCell align="right"><CurrencyRealOutput value={row.value} /></TableCell>
                        <TableCell align="center">{row.paymentType.name}</TableCell>
                        <TableCell align="right"><CurrencyRealOutput value={row.getNetValue()} /></TableCell>
                        <TableCell align="center">
                            <Grid container>
                                <Grid item xs={12} sm={6}>
                                <IconButton aria-label="edit" title="Editar receita" color="secondary" disabled={props.disabled} 
                                    onClick={ () => openEditRevenue(row) }>
                                    <EditIcon />
                                </IconButton> 
                                </Grid>
                                <Grid item xs={12} sm={6}>                                
                                    <IconButton aria-label="delete" title="Excluir receita" color="secondary" disabled={props.disabled} 
                                        onClick={ () => alertDialog(row) }>
                                        <DeleteForeverIcon />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </TableContainer>

            <AlertDialog open={isAlertDialogOpen} title="Confirmação de exclusão" message={messageAlertDialog} 
                handleClose={closeAlertDialog} handleConfirm={ removeRevenue } />
        </>
    );
};

export default RevenueTable;