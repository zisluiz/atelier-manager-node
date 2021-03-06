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
import Typography from '@material-ui/core/Typography';
import AlertDialog from 'src/ui/components/base/AlertDialog';
import ResourceDialog from 'src/ui/dialogs/ResourceDialog';
import { Step } from 'src/model/Step';
import * as ArraysUtil from 'src/util/ArraysUtil';
import * as IdentityUtil from 'src/util/IdentityUtil';
import { CostType, Resource, getCostByTypeName } from 'src/model/Resource';
import EmptyRowDataTable from 'src/ui/components/base/EmptyRowDataTable';
import CurrencyRealOutput from 'src/ui/components/base/CurrencyRealOutput';

const useStyles = makeStyles({
    root: {    
      [theme.breakpoints.down('sm')]: {
        maxWidth: "700px"
      }
    }, columnOption: {    
        [theme.breakpoints.up('sm')]: {
          width: "140px"
        }
    }
  });

interface ResourceTableProps {
    step:Step | null,
    optionsBaseResources:Resource[],
    disabled?: boolean,
    updateStepResources(stepToUpdate:Step | null, resources: Resource[]):void
}

const ResourceTable = (props:ResourceTableProps) => {    
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [selectedRow, setSelectedRow] = React.useState<Resource | null>(null);
    const [resourceToRemove, setResourceToRemove] = React.useState<Resource | null>(null);
    const [resources, setResources] = React.useState(props.step ? props.step.resources : []);
    const [messageAlertDialog, setMessageAlertDialog] = React.useState("");
    const [isAlertDialogOpen, setIsAlertDialogOpen] = React.useState(false);
    const classes = useStyles();

    function openNewResource() {
        setSelectedRow(createNewResource());
        setIsDialogOpen(true);
    }

    function openEditResource(resourceToEdit:Resource) { 
        setSelectedRow(resourceToEdit);
        setIsDialogOpen(true);
    }

    function handleSaveResource(resourceToSave:any) {
        let newResources = null;

        if (!selectedRow)
            throw new Error('Objeto recurso n??o pode ser nulo!');

        if (selectedRow.id == 0) {
            resourceToSave.id = IdentityUtil.generateId();   
            resourceToSave = new Resource(resourceToSave.id, resourceToSave.name, resourceToSave.cost, getCostByTypeName(resourceToSave.costType), resourceToSave.defaultSpendTime);         
            newResources = ArraysUtil.addObject(resources, resourceToSave);            
        } else {            
            resourceToSave = new Resource(selectedRow.id, resourceToSave.name, resourceToSave.cost, getCostByTypeName(resourceToSave.costType), resourceToSave.defaultSpendTime);         
            newResources = ArraysUtil.updateObject(resources, selectedRow, resourceToSave);
        }

        setResources(newResources);
        props.updateStepResources(props.step, newResources);
        handleCloseDialog();
    } 

    function removeResource() {
        const newResources = ArraysUtil.removeObject(resources, resourceToRemove);
        setResources(newResources);
        props.updateStepResources(props.step, newResources);
        closeAlertDialog();
    }
    
    function handleCloseDialog() {
        setIsDialogOpen(false);
    }

    function createNewResource():Resource {
        return new Resource(0, '', 0, CostType.BY_HOUR, "");
    } 

    function alertDialog(row:Resource) {
        setResourceToRemove(row);
        setMessageAlertDialog(`Deseja realmente remover o recurso \"${row.name}\"?`);
        setIsAlertDialogOpen(true);
    }

    function closeAlertDialog() {        
        setIsAlertDialogOpen(false);
    }

    return(
        <>
            <Typography variant="h4" align="center" gutterBottom>
                Etapa: {props.step && props.step.name}
            </Typography> 

            <ResourceDialog open={isDialogOpen} selectedResource={selectedRow} optionsResources={props.optionsBaseResources} 
                    handleSave={handleSaveResource} handleClose={handleCloseDialog} 
                    title={!selectedRow ? "" : (selectedRow.id == 0 ? "Cadastrar novo recurso" : "Editar recurso \"" + selectedRow.name + "\"")} />

            <Button variant="contained" color="primary" component="span" disabled={props.disabled} onClick={ openNewResource }>Novo Recurso</Button>

            <TableContainer component={Paper} className={classes.root}>                      
                <Table size="medium" aria-label="Lista de recursos">
                <TableHead>
                    <TableRow>
                    <TableCell>Nome do recurso</TableCell>
                    <TableCell align="center">Custo (R$)</TableCell>
                    <TableCell align="center">Tempo padr??o gasto (em horas)</TableCell>
                    <TableCell align="center"className={classes.columnOption}>Op????es</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <EmptyRowDataTable data={resources} message={`Nenhum recurso cadastrado para a etapa \"${props.step && props.step.name}\"!`} colSpan={4} />

                    {resources && resources.length > 0 && resources.map((row) => (
                    <TableRow key={row.id}>
                        <TableCell scope="row">
                        {row.name}
                        </TableCell>
                        <TableCell align="center"><CurrencyRealOutput value={row.cost} />  {row.getDescription()}</TableCell>
                        <TableCell align="center">{row.defaultSpendTime} </TableCell>
                        <TableCell align="center">
                            <Grid container>
                                <Grid item xs={12} sm={6}>
                                <IconButton aria-label="edit" title="Editar recurso" color="secondary" disabled={props.disabled} onClick={ () => openEditResource(row) }>
                                    <EditIcon />
                                </IconButton> 
                                </Grid>
                                <Grid item xs={12} sm={6}>                                
                                    <IconButton aria-label="delete" title="Excluir recurso" disabled={props.disabled} color="secondary" 
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
                handleClose={closeAlertDialog} handleConfirm={ removeResource } />
        </>
    );
};

export default ResourceTable;