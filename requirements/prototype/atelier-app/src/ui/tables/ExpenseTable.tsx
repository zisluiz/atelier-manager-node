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
import ExpenseDialog from 'src/ui/dialogs/ExpenseDialog';
import * as ArraysUtil from 'src/util/ArraysUtil';
import * as IdentityUtil from 'src/util/IdentityUtil';
import EmptyRowDataTable from 'src/ui/components/base/EmptyRowDataTable';
import CurrencyRealOutput from 'src/ui/components/base/CurrencyRealOutput';
import { Expense } from 'src/model/Expense';

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

interface ExpenseTableProps {    
    expenses: Expense[],
    disabled?: boolean,
    updateExpenses(expenses: Expense[]):void
}

const ExpenseTable = (props:ExpenseTableProps) => {    
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [selectedRow, setSelectedRow] = React.useState<Expense | null>(null);
    const [expenseToRemove, setExpenseToRemove] = React.useState<Expense | null>(null);
    const [messageAlertDialog, setMessageAlertDialog] = React.useState("");
    const [isAlertDialogOpen, setIsAlertDialogOpen] = React.useState(false);
    const classes = useStyles();
    let isEdittingRow = false;

    function openNewExpense() {
        isEdittingRow = false;
        setSelectedRow(createNewExpense());
        setIsDialogOpen(true);
    }

    function openEditExpense(expenseToEdit:Expense) {        
        isEdittingRow = true;
        setSelectedRow(expenseToEdit);
        setIsDialogOpen(true);
    }

    function handleSaveExpense(expenseToSave:Expense) {
        let newExpenses = null;

        if (selectedRow?.id == 0) {
            expenseToSave.id = IdentityUtil.generateId();
            newExpenses = ArraysUtil.addObject(props.expenses, expenseToSave);            
        } else {                        
            newExpenses = ArraysUtil.updateObject(props.expenses, selectedRow, expenseToSave);
        }
        props.updateExpenses(newExpenses);
        handleCloseDialog();
    } 

    function removeExpense() {
        const newExpenses = ArraysUtil.removeObject(props.expenses, expenseToRemove);
        props.updateExpenses(newExpenses);
        closeAlertDialog();
    }
    
    function handleCloseDialog() {
        setIsDialogOpen(false);
    }

    function createNewExpense():Expense {
        return new Expense(0, "", 0.00);
    } 

    function alertDialog(row:Expense) {
        setExpenseToRemove(row);
        setMessageAlertDialog(`Deseja realmente remover a despesa \"${row.description}\"?`);
        setIsAlertDialogOpen(true);
    }

    function closeAlertDialog() {        
        setIsAlertDialogOpen(false);
    }

    return(
       <>
            {selectedRow &&
            <ExpenseDialog open={isDialogOpen} selectedExpense={selectedRow}
                    handleSave={handleSaveExpense} handleClose={handleCloseDialog} 
                    title={!selectedRow ? "" : (selectedRow.id == 0 ? "Cadastrar nova despesa" : "Editar despesa \"" + selectedRow.description + "\"")} />}

            <Button variant="contained" color="primary" component="span" disabled={props.disabled} onClick={ openNewExpense }>Nova Despesa</Button>

            <TableContainer component={Paper} className={classes.root}>                      
                <Table size="medium" aria-label="Lista de despesas">
                <TableHead>
                    <TableRow>
                    <TableCell>Despesa</TableCell>
                    <TableCell align="center">Valor (R$)</TableCell>
                    <TableCell align="center" className={classes.columnOption}>Op????es</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <EmptyRowDataTable data={props.expenses} message={"Nenhuma despesa cadastrada!"} colSpan={4} />

                    {props.expenses && props.expenses.length > 0 && props.expenses.map((row) => (
                    <TableRow key={row.id}>
                        <TableCell scope="row">
                        {row.description}
                        </TableCell>
                        <TableCell align="right"><CurrencyRealOutput value={row.value} /></TableCell>
                        <TableCell align="center">
                            <Grid container>
                                <Grid item xs={12} sm={6}>
                                <IconButton aria-label="edit" title="Editar despesa" color="secondary" disabled={props.disabled} 
                                    onClick={ () => openEditExpense(row) }>
                                    <EditIcon />
                                </IconButton> 
                                </Grid>
                                <Grid item xs={12} sm={6}>                                
                                    <IconButton aria-label="delete" title="Excluir despesa" color="secondary" disabled={props.disabled} 
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

            <AlertDialog open={isAlertDialogOpen} title="Confirma????o de exclus??o" message={messageAlertDialog} 
                handleClose={closeAlertDialog} handleConfirm={ removeExpense } />
        </>
    );
};

export default ExpenseTable;