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
import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered';
import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import CurrencyRealOutput from 'src/ui/components/base/CurrencyRealOutput';
import CategoryListOutput from 'src/ui/components/base/CategoryListOutput';
import ClothDialog from 'src/ui/dialogs/ClothDialog';
import { Cloth } from 'src/model/Cloth';
import { ServiceType } from 'src/model/ServiceType';
import AlertDialog from 'src/ui/components/base/AlertDialog';
import * as ArraysUtil from 'src/util/ArraysUtil';
import * as IdentityUtil from 'src/util/IdentityUtil';
import EmptyTableData from 'src/ui/components/base/EmptyTableData';
import ServiceRequisitionController from 'src/controller/ServiceRequisitionController';

interface ClothTableProps {
    serviceTypes:ServiceType[],
    clothes:Cloth[],
    optionsClothes:Cloth[],
    handleClothSelection:Function,
    handleUpdateClothes: Function,
    controller: ServiceRequisitionController
}

const ClothTable = (props:ClothTableProps) => {    
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [selectedRow, setSelectedRow] = React.useState<Cloth | null>(null);
    const [clothToRemove, setClothToRemove] = React.useState<Cloth | null>(null);
    const [messageAlertDialog, setMessageAlertDialog] = React.useState("");
    const [isAlertDialogOpen, setIsAlertDialogOpen] = React.useState(false);

    function openNewCloth() {
        setSelectedRow(createNewCloth());
        setIsDialogOpen(true);
    }

    function openEditCloth(clothToEdit:Cloth) { 
        setSelectedRow(clothToEdit);
        setIsDialogOpen(true);
    }

    function handleSaveCloth(clothToSave:any) {
        let newClothes = null;

        if (!selectedRow)
            throw new Error('Objeto roupa não pode ser nula!');

        if (selectedRow.id == 0) {            
            clothToSave.id = IdentityUtil.generateId();
            newClothes = ArraysUtil.addObject(props.clothes, new Cloth(clothToSave.id, clothToSave.name, clothToSave.quantity, clothToSave.price, clothToSave.serviceTypes, clothToSave.steps));
        } else {
            const changedCloth = {...selectedRow};
            changedCloth.name = clothToSave.name;
            changedCloth.quantity = clothToSave.quantity;
            changedCloth.price = clothToSave.price;
            changedCloth.serviceTypes = clothToSave.serviceTypes;
            changedCloth.steps = clothToSave.steps;            

            newClothes = ArraysUtil.updateObject(props.clothes, selectedRow, changedCloth);                        
        }

        props.handleUpdateClothes(newClothes);
        handleCloseDialog();
    } 

    function removeCloth() {
        const newClothes = ArraysUtil.removeObject(props.clothes, clothToRemove);
        props.handleUpdateClothes(newClothes);
        closeAlertDialog();
    }
    
    function handleCloseDialog() {
        setIsDialogOpen(false);
    }

    function createNewCloth():Cloth {
        return new Cloth(0, '', 1, 0.00, [], []);
    } 

    function alertDialog(row:Cloth) {
        setClothToRemove(row);
        setMessageAlertDialog(`Deseja realmente remover a peça \"${row.name}\"?`);
        setIsAlertDialogOpen(true);
    }

    function closeAlertDialog() {        
        setIsAlertDialogOpen(false);
    }

    function showSteps(row:Cloth) {
        props.handleClothSelection(row);
    }    

    return(
        <Container maxWidth="lg">
            <ClothDialog open={isDialogOpen} selectedCloth={selectedRow} optionsServiceTypes={props.serviceTypes} 
                    handleSave={handleSaveCloth} handleClose={handleCloseDialog} 
                    optionsClothes={props.optionsClothes}
                    title={!selectedRow ? "" : (selectedRow.id == 0 ? "Cadastrar nova peça" : "Editar peça \"" + selectedRow.name + "\"")} />

            <Button variant="contained" color="secondary" component="span" onClick={ openNewCloth } >Nova Peça</Button>

            <TableContainer component={Paper}>                      
                <Table size="medium" aria-label="Lista de peças">
                <TableHead>
                    <TableRow>
                    <TableCell>Nome da peça</TableCell>
                    <TableCell align="right">Quantidade</TableCell>
                    <TableCell align="right">Preço Unitário (R$)</TableCell>
                    <TableCell align="center">Tipos de serviços</TableCell>
                    <TableCell align="center">Etapas</TableCell>
                    <TableCell align="center" width={180}>Opções</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <EmptyTableData data={props.clothes} message="Nenhuma peça cadastrada!" colSpan={6} />

                    {props.clothes && props.clothes.length > 0 && props.clothes.map((row) => (
                    <TableRow key={row.id}>
                        <TableCell scope="row">
                        {row.name}
                        </TableCell>                                                    
                        <TableCell align="right">{row.quantity}</TableCell>
                        <TableCell align="right">
                            <CurrencyRealOutput value={row.price} />
                        </TableCell>
                        <TableCell><CategoryListOutput categories={row.serviceTypes} /></TableCell>
                        <TableCell>{row.steps && row.steps.map(step => step.name).join(', ')}</TableCell>
                        <TableCell align="center">

                        <Grid container>
                            <Grid item xs={4}>
                            <IconButton aria-label="verEtapas" title="Ver etapas desta peça" color="secondary" onClick={ () => showSteps(row) }>
                                <FormatListNumberedIcon />
                            </IconButton> 
                            </Grid> 
                            <Grid item xs={4}>
                            <IconButton aria-label="edit" title="Editar peça" color="secondary" onClick={ () => openEditCloth(row) }>
                                <EditIcon />
                            </IconButton> 
                            </Grid>
                            <Grid item xs={4}>                                
                                <IconButton aria-label="delete" title="Excluir peça" color="secondary" 
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
                    handleClose={closeAlertDialog} handleConfirm={ removeCloth } />
        </Container>
    );
};

export default ClothTable;