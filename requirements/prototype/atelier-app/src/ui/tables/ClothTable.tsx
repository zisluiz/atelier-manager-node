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
import Typography from '@material-ui/core/Typography';
import CurrencyRealOutput from 'src/ui/components/CurrencyRealOutput';
import CategoryListOutput from 'src/ui/components/CategoryListOutput';
import ClothDialog from 'src/ui/dialogs/ClothDialog';
import { Cloth } from 'src/model/Cloth';
import { ServiceType } from 'src/model/ServiceType';
import AlertDialog from '../components/AlertDialog';

interface ClothTableProps {
    clothes:Cloth[],
    serviceTypes:ServiceType[]
}

const ClothTable = (props:ClothTableProps) => {    
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [selectedRow, setSelectedRow] = React.useState();
    const [clothes, setClothes] = React.useState(props.clothes);
    const [messageAlertDialog, setMessageAlertDialog] = React.useState("");
    const [isAlertDialogOpen, setIsAlertDialogOpen] = React.useState(false);

    let isEdittingRow = false;
    let clothToRemove:Cloth = null;

    console.log("Loading clothTable");

    function openNewCloth() {
        isEdittingRow = false;
        setSelectedRow(createNewCloth());
        setIsDialogOpen(true);
    }

    function openEditCloth(clothToEdit:Cloth) {        
        isEdittingRow = true;
        setSelectedRow(clothToEdit);
        setIsDialogOpen(true);
    }

    function handleSaveCloth(clothToSave:Cloth) {
        let newClothes = clothes.slice();

        if (selectedRow == null) {
            clothToSave.id = Math.floor(Math.random() * 10000);            
            newClothes.push(clothToSave);
            setClothes(newClothes);            
        } else {
            const index = newClothes.indexOf(selectedRow);
            const changedCloth = {...selectedRow, ...clothToSave};

            newClothes.splice(index, 1);
            newClothes.splice(index, 0, changedCloth);
            setClothes(newClothes);  
        }

        handleCloseDialog();
    } 

    function removeCloth() {
        let newClothes = clothes.slice();
        newClothes.splice(newClothes.indexOf(clothToRemove), 1);
        setClothes(newClothes);
        clothToRemove = null;
        closeAlertDialog();
    }
    
    function handleCloseDialog() {
        setIsDialogOpen(false);
    }

    function createNewCloth():Cloth {
        return new Cloth(0, '', 1, 0.00, [], null);
    } 

    function alertDialog(row:Cloth) {
        setMessageAlertDialog(`Deseja realmente remover a peça \"${row.name}\"?`);
        setIsAlertDialogOpen(true);
    }

    function closeAlertDialog() {        
        setIsAlertDialogOpen(false);
    }

    return(
        <Container maxWidth="lg">
            <ClothDialog open={isDialogOpen} selectedCloth={selectedRow} optionsServiceTypes={props.serviceTypes} 
                    handleSave={handleSaveCloth} handleClose={handleCloseDialog} 
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
                    <TableCell align="center">Opções</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {!clothes || clothes.length == 0 && (
                        <TableRow>
                            <TableCell colSpan={6}>                           
                                <Typography variant="h6" align="center" gutterBottom>
                                    Nenhuma peça cadastrada!
                                </Typography> 
                            </TableCell>
                        </TableRow>                                    
                    )}
                    {clothes && clothes.length > 0 && clothes.map((row) => (
                    <TableRow key={row.name}>
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
                            <IconButton aria-label="verEtapas" title="Ver etapas desta peça" color="secondary">
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
                                    onClick={ () => {clothToRemove = row; alertDialog(row) } }>
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

            <AlertDialog open={isAlertDialogOpen} title="Confirmação de exclusão" message={messageAlertDialog} handleClose={closeAlertDialog} handleConfirm={ removeCloth } />
        </Container>
    );
};

export default ClothTable;