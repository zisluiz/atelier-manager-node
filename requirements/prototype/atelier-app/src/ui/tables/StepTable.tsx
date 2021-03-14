import Button from '@material-ui/core/Button';
import React from 'react';
import Container from '@material-ui/core/Container';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import Typography from '@material-ui/core/Typography';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import { Cloth } from 'src/model/Cloth';
import AlertDialog from '../components/base/AlertDialog';
import { Step } from 'src/model/Step';
import StepDialog from '../dialogs/StepDialog';
import * as ArraysUtil from 'src/util/ArraysUtil';
import * as IdentityUtil from 'src/util/IdentityUtil';
import EmptyTableData from 'src/ui/components/base/EmptyTableData';
import ServiceRequisitionController from 'src/controller/ServiceRequisitionController';

interface StepTableProps {
    cloth:Cloth | null,
    optionsBaseSteps:Step[],
    handleStepSelection:Function,
    controller:ServiceRequisitionController
}

const StepTable = (props:StepTableProps) => {    
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [selectedRow, setSelectedRow] = React.useState<Step | null>(null);
    const [stepToRemove, setStepToRemove] = React.useState<Step | null>(null);
    const [steps, setSteps] = React.useState(props.cloth ? props.cloth.steps : []);
    const [messageAlertDialog, setMessageAlertDialog] = React.useState("");
    const [isAlertDialogOpen, setIsAlertDialogOpen] = React.useState(false);

    let isEdittingRow = false;

    function openNewStep() {
        isEdittingRow = false;
        setSelectedRow(createNewStep());
        setIsDialogOpen(true);
    }

    function openEditStep(stepToEdit:Step) {        
        isEdittingRow = true;
        setSelectedRow(stepToEdit);
        setIsDialogOpen(true);
    }

    function handleSaveStep(stepToSave:Step) {
        let newSteps = null;

        if (!selectedRow)
            throw new Error('Objeto etapa não pode ser nulo!');

        if (selectedRow.id == 0) {
            stepToSave.id = IdentityUtil.generateId();            
            newSteps = ArraysUtil.addObject(steps, stepToSave);
        } else {            
            const changedStep = {...selectedRow, ...stepToSave};
            newSteps = ArraysUtil.updateObject(steps, selectedRow, changedStep);            
        }

        setSteps(newSteps);
        props.controller.updateClothSteps(props.cloth, newSteps);
        handleCloseDialog();
    } 

    function removeStep() {
        const newSteps = ArraysUtil.removeObject(steps, stepToRemove);
        setSteps(newSteps);
        props.controller.updateClothSteps(props.cloth, newSteps);
        closeAlertDialog();
    }
    
    function handleCloseDialog() {
        setIsDialogOpen(false);
    }

    function createNewStep():Step {
        return new Step(0, '', []);
    } 

    function alertDialog(row:Step) {
        setStepToRemove(row);
        setMessageAlertDialog(`Deseja realmente remover a etapa \"${row.name}\"?`);
        setIsAlertDialogOpen(true);
    }

    function upStep(row:Step) {
        const newSteps = ArraysUtil.downObjectIndex(steps, row);
        setSteps(newSteps);
    }

    function showResources(row:Step) {
        props.handleStepSelection(row);
    }

    function closeAlertDialog() {        
        setIsAlertDialogOpen(false);
    }

    return(
        <Container maxWidth="lg">
            <Typography variant="h4" align="center" gutterBottom>
                Peça: {props.cloth && props.cloth.name}
            </Typography> 

            <StepDialog open={isDialogOpen} selectedStep={selectedRow} optionsSteps={props.optionsBaseSteps} 
                    handleSave={handleSaveStep} handleClose={handleCloseDialog} 
                    title={!selectedRow ? "" : (selectedRow.id == 0 ? "Cadastrar nova etapa" : "Editar etapa \"" + selectedRow.name + "\"")} />

            <Button variant="contained" color="secondary" component="span" onClick={ openNewStep } >Nova Etapa</Button>

            <TableContainer component={Paper}>                      
                <Table size="medium" aria-label="Lista de etapas">
                <TableHead>
                    <TableRow>
                    <TableCell>Nome da etapa</TableCell>
                    <TableCell align="center">Recursos</TableCell>
                    <TableCell align="center" width={220}>Opções</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <EmptyTableData data={steps} message={`Nenhuma etapa cadastrada para a peça \"${props.cloth && props.cloth.name}\"!`} colSpan={3} />

                    {steps && steps.length > 0 && steps.map((row) => (
                    <TableRow key={row.id}>
                        <TableCell scope="row">
                        {row.name}
                        </TableCell>
                        <TableCell>{row.resources && row.resources.map(resource => resource.name).join(', ')}</TableCell>
                        <TableCell align="center">

                        <Grid container>
                            <Grid item xs={3}>
                            <IconButton aria-label="verEtapas" title="Ver recursos desta etapa" color="secondary" onClick={ () => showResources(row)}>
                                <MonetizationOnIcon />
                            </IconButton> 
                            </Grid>      
                            <Grid item xs={3}>
                            <IconButton aria-label="subir" title="Subir etapa" color="secondary" onClick={ () => upStep(row) }>
                                <ArrowUpwardIcon />
                            </IconButton> 
                            </Grid>                                                             
                            <Grid item xs={3}>
                            <IconButton aria-label="edit" title="Editar etapa" color="secondary" onClick={ () => openEditStep(row) }>
                                <EditIcon />
                            </IconButton> 
                            </Grid>
                            <Grid item xs={3}>                                
                                <IconButton aria-label="delete" title="Excluir etapa" color="secondary" 
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

            <AlertDialog open={isAlertDialogOpen} title="Confirmação de exclusão" message={messageAlertDialog} handleClose={closeAlertDialog} handleConfirm={ removeStep } />
        </Container>
    );
};

export default StepTable;