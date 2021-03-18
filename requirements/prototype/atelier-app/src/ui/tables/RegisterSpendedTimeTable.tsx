import React, {useRef, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import theme from 'src/theme';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { useFormik } from 'formik';
import moment from 'moment';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import {Color as AlertColor} from '@material-ui/lab/Alert';
import AlertDialog from 'src/ui/components/base/AlertDialog';
import * as ArraysUtil from 'src/util/ArraysUtil';
import * as IdentityUtil from 'src/util/IdentityUtil';
import EmptyRowDataTable from 'src/ui/components/base/EmptyRowDataTable';
import { ClothInstance } from 'src/model/ClothInstance';
import { Step } from 'src/model/Step';
import { SpendTime } from 'src/model/SpendTime';

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

const validate = (values: RegisterSpendedTimeInputs) => {    
    let errors = {};

    const isManuallySubmition = values.submitionType == "manual";
  
    if (!values.selectedClothInstances || values.selectedClothInstances.length == 0)
        errors = {...errors, selectedClothInstances: "Uma ou mais peças são requeridas!"};

    if (!values.selectedSteps || values.selectedSteps.length == 0)
        errors = {...errors, selectedSteps: "Uma ou mais etapas são requeridas!"};

    if (isManuallySubmition) {
        if (!values.manualSpendTimeDate)
            errors = {...errors, manualSpendTimeDate: "Informe uma data!"};

        if (!values.inputManualStartSpendTime)
            errors = {...errors, inputManualStartSpendTime: "Informe a hora inicial!"};

        if (!values.inputManualEndSpendTime)
            errors = {...errors, inputManualEndSpendTime: "Informe a hora fim!"};

        if (values.inputManualStartSpendTime && values.inputManualEndSpendTime) {
            if (moment(values.inputManualStartSpendTime, "HH:mm").isAfter(moment(values.inputManualEndSpendTime, "HH:mm"), "day"))
            errors = {...errors, inputManualEndSpendTime: "Hora fim deve ser maior que a hora inicial!"};
        }  
    } else {
        if (values.autoSelectedSpendedTime != null && !moment(values.autoSelectedSpendedTime.date, "").isSame(new Date(), "day"))
            errors = {...errors, manualSpendTimeDate: "Não é possível usar o cronômetro para finalizar outro dia! Utilize o recurso manual."};

        if (values.autoSelectedSpendedTime && values.autoSelectedSpendedTime.endTime) 
            errors = {...errors, inputManualEndSpendTime: "Horário fim já informado. Utilize a opção manual para atualizar as horas despendidas."};
    }

    return errors;
  };  

interface RegisterSpendedTimeProps {
    clothInstances: ClothInstance[] | null,
    serviceSpendedTimes: SpendTime[] | null,
    disabled?: boolean,
    updateSpendedTimes(newSpendTime: SpendTime[]):any,
    showSnackAlert(message: string, severity: AlertColor):any
}

interface RegisterSpendedTimeInputs {
    selectedClothInstances: ClothInstance[], 
    optionsSteps: Step[], 
    selectedSteps: Step[], 
    manualSelectedSpendedTime: SpendTime | null,
    autoSelectedSpendedTime: SpendTime | null,
    manualSpendTimeDate: string, 
    inputManualStartSpendTime: string, 
    inputManualEndSpendTime: string, 
    submitionType: string
}

const RegisterSpendedTime = (props:RegisterSpendedTimeProps) => {
    if (!props.clothInstances)
        return null;

    const [spendTimeToRemove, setSpendTimeToRemove] = React.useState<SpendTime | null>(null);
    const [messageAlertDialog, setMessageAlertDialog] = React.useState("");
    const [isAlertDialogOpen, setIsAlertDialogOpen] = React.useState(false);
    const formRef = React.createRef<HTMLFormElement>();
    const timer = useRef<NodeJS.Timeout | nul>(null); 
    const classes = useStyles();
    
    const formik = useFormik<RegisterSpendedTimeInputs>({    
        initialValues: { 
            selectedClothInstances: [],
            optionsSteps: [],
            selectedSteps: [],
            manualSelectedSpendedTime: null,
            autoSelectedSpendedTime: null,
            manualSpendTimeDate: moment(new Date()).format("yyyy-MM-DD"),
            inputManualStartSpendTime: "",
            inputManualEndSpendTime: "",
            submitionType: ""
        },
        validate: validate,
        onSubmit: (values: RegisterSpendedTimeInputs) => {
            const clothes = formik.values.selectedClothInstances;
            const steps = formik.values.selectedSteps;
            
            let date = null;
            let startTime = null;
            let endTime = null;
            
            const isManualSubmition = values.submitionType == "manual";

            const edittingSpendedTime = isManualSubmition ? formik.values.manualSelectedSpendedTime : formik.values.autoSelectedSpendedTime;

            if (isManualSubmition) {
                date = moment(values.manualSpendTimeDate, "yyyy-MM-DD").toDate();
                startTime = values.inputManualStartSpendTime;
                endTime = values.inputManualEndSpendTime;
            } else {
                date = new Date();

                const timeNow = moment(date).format("HH:mm");
        
                startTime = edittingSpendedTime ? edittingSpendedTime.startTime : timeNow;
                endTime = edittingSpendedTime ? timeNow : "";
            }

            saveSpendedTime(isManualSubmition, edittingSpendedTime, clothes, steps, date, startTime, endTime);
        }
    });

    function saveSpendedTime(isManualSubmition: boolean, edittingSpendedTime: SpendTime | null, clothes: ClothInstance[], steps: Step[], date: Date, startTime: string, endTime: string) {
        const id = edittingSpendedTime ? edittingSpendedTime.id : IdentityUtil.generateId();
        const spendedTime = new SpendTime(id, clothes, steps, date, startTime, endTime);

        if (!props.serviceSpendedTimes)
            throw new Error("Error!");

        const newSpendedTimes = edittingSpendedTime ? ArraysUtil.updateObject(props.serviceSpendedTimes, edittingSpendedTime, spendedTime) :
        ArraysUtil.addObject(props.serviceSpendedTimes, spendedTime);        
        setSelectedSpendedTime(isManualSubmition, spendedTime);                        
        props.updateSpendedTimes(newSpendedTimes);
        props.showSnackAlert("Horas adicionadas com sucesso!", "success");
    }

    function updateSelectedCloths(values: ClothInstance[]) {
        formik.setFieldValue('selectedClothInstances', values);

        let steps: Step[] = [];

        if (values) {
            values.forEach((clothInstance: ClothInstance) => {
                clothInstance.cloth.steps && clothInstance.cloth.steps.forEach((step: Step) => {
                    if (!steps.includes(step))
                        steps.push(step);
                });                
            });
        }

        formik.setFieldValue('optionsSteps', steps);

        let selectedSteps = formik.values.selectedSteps;
        let possiblyNewSelectedSteps: Step[] = [];

        if (selectedSteps) {
            selectedSteps.forEach((step: Step) => {
                if (!steps.includes(step))
                    possiblyNewSelectedSteps.push(step);
            });
        }        

        if (selectedSteps && selectedSteps.length != possiblyNewSelectedSteps.length)
            formik.setFieldValue('optionsSteps', possiblyNewSelectedSteps);
    }

    function clearInputs() {
        formik.handleReset(null);
    }

    function setSelectedSpendedTime(isManualSubmition:boolean, spendedTime: SpendTime | null) { 
        if (isManualSubmition) {
            formik.setFieldValue("manualSelectedSpendedTime", null, false);            
        } else {
            formik.setFieldValue("autoSelectedSpendedTime", !spendedTime || spendedTime.endTime ? null : spendedTime, false);
            formik.setFieldValue("manualSelectedSpendedTime", null, false);
        }
    }    

    function editSpendedTime(spendedTime: SpendTime | null) {        
        formik.setValues({
            optionsSteps: formik.values.optionsSteps,
            submitionType: "",
            selectedClothInstances: spendedTime ? spendedTime.clothes : [],
            manualSelectedSpendedTime: spendedTime,
            autoSelectedSpendedTime: null,
            selectedSteps: spendedTime ? spendedTime.steps : [],
            manualSpendTimeDate: spendedTime ?  moment(spendedTime.date).format("yyyy-MM-DD") : moment(new Date()).format("yyyy-MM-DD"),
            inputManualStartSpendTime: spendedTime ? spendedTime.startTime : "",
            inputManualEndSpendTime: spendedTime ? spendedTime.endTime : "" 
        }, false);
    }

    function alertDialog(row:SpendTime) {
        setSpendTimeToRemove(row);
        setMessageAlertDialog(`Deseja realmente o tempo \"${row.getSpendedTime()}\"?`);
        setIsAlertDialogOpen(true);
    }

    function removeSpendedTime() {
        if (!props.serviceSpendedTimes)
            return;

        const newSpendedTimes = ArraysUtil.removeObject(props.serviceSpendedTimes, spendTimeToRemove);        
        props.updateSpendedTimes(newSpendedTimes);
        closeAlertDialog();
    }

    function closeAlertDialog() {        
        setIsAlertDialogOpen(false);
    }

    function callSubmit(type: string) {
        formik.setFieldValue("submitionType",type, false); //.then(...)
        //use promise when formik fix their api, promise when submitionType is setted (button click)
        timer.current = setTimeout(async function () {
            formik.handleSubmit();
        }, 100);
    }

    useEffect(() => {
        // clear timeout on component unmount
        return () => {
            if (timer.current)
                clearInterval(timer.current);
        };
      }, []);    

    return(
        <>
    <form ref={formRef} id="formSpendTime" onSubmit={formik.handleSubmit} noValidate>        
        <Grid container spacing={2}>
            <Grid item xs={12} sm={5}>
                <Autocomplete                        
                        value={formik.values.selectedClothInstances}
                        onChange={(event, values) => { updateSelectedCloths(values); }}
                        disabled={props.disabled}
                        multiple
                        filterSelectedOptions
                        id="autocomplete-cloth-instances"
                        noOptionsText="Peça não encontrada!"                  
                        options={props.clothInstances}
                        getOptionLabel={(option) => option.name}
                        renderInput={(params) => <TextField {...params} label="Peças:" required placeholder="Peças" variant="outlined"                        
                                    name="selectedClothInstances"  
                                    error={formik.touched.selectedClothInstances && Boolean(formik.errors.selectedClothInstances)}
                                    helperText={formik.touched.selectedClothInstances && formik.errors.selectedClothInstances} />} />            
            </Grid>
            <Grid item xs={12} sm={5}>
                <Autocomplete                        
                        value={formik.values.selectedSteps}
                        onChange={(event, values) => { formik.setFieldValue('selectedSteps', values); }}
                        disabled={props.disabled}
                        multiple
                        filterSelectedOptions
                        id="autocomplete-steps-instances"
                        noOptionsText="Etapa não encontrada!"                  
                        options={formik.values.optionsSteps}
                        getOptionLabel={(option) => option.name}
                        renderInput={(params) => <TextField {...params} label="Etapas:" required placeholder="Etapas" variant="outlined"                        
                                    name="selectedClothInstances"  
                                    error={formik.touched.selectedSteps && Boolean(formik.errors.selectedSteps)}
                                    helperText={formik.touched.selectedSteps && formik.errors.selectedSteps} />} />            
            </Grid>        
            <Grid item xs={12} sm={2}>            
                <Button color="primary" variant="contained" title="Limpar os campos de entrada das horas despendidas"
                    onClick={ () => clearInputs() } disabled={props.disabled}>Limpar</Button>
            </Grid>
            <Grid item xs={12}>            
                <Button color="primary" variant="contained" type="button" disabled={props.disabled}
                    onClick={ (e: any) => { callSubmit("auto"); } }>
                    {formik.values.autoSelectedSpendedTime == null ? "Iniciar" : "Parar"} cronômetro</Button>
            </Grid> 
            <Grid item xs={12} sm={3}>            
                <Typography variant="h6" align="center">
                    Inclusão manual:
                </Typography>            
            </Grid> 
            <Grid item xs={12} sm={2}>            
                <TextField
                        id="inputManualSpendTimeDate"
                        label="Data:"
                        value={formik.values.manualSpendTimeDate}
                        disabled={props.disabled}
                        onChange={ (event) => { formik.setFieldValue('manualSpendTimeDate', event.target.value); } }  
                        error={formik.touched.manualSpendTimeDate && Boolean(formik.errors.manualSpendTimeDate)}
                        helperText={formik.touched.manualSpendTimeDate && formik.errors.manualSpendTimeDate}              
                        variant="outlined"
                        type="date"
                        fullWidth
                        InputLabelProps={{
                            shrink: true,
                        }}
                        />                       
            </Grid>
            <Grid item xs={6} sm={2}>            
                <TextField
                        id="inputManualStartSpendTime"
                        name="inputManualStartSpendTime"
                        label="Início:"                
                        type="time"            
                        value={formik.values.inputManualStartSpendTime}
                        disabled={props.disabled}
                        onChange={ formik.handleChange }     
                        error={formik.touched.inputManualStartSpendTime && Boolean(formik.errors.inputManualStartSpendTime)}
                        helperText={formik.touched.inputManualStartSpendTime && formik.errors.inputManualStartSpendTime}                          
                        fullWidth
                        variant="outlined"                          
                        InputLabelProps={{
                            shrink: true,
                        }}
                        inputProps={{
                            step: 300, // 5 min
                        }} />                      
            </Grid>
            <Grid item xs={6} sm={2}>            
                <TextField
                        id="inputManualEndSpendTime"
                        name="inputManualEndSpendTime"
                        label="Fim:"                
                        type="time"            
                        value={formik.values.inputManualEndSpendTime}
                        disabled={props.disabled}
                        onChange={ formik.handleChange }     
                        error={formik.touched.inputManualEndSpendTime && Boolean(formik.errors.inputManualEndSpendTime)}
                        helperText={formik.touched.inputManualEndSpendTime && formik.errors.inputManualEndSpendTime}                          
                        fullWidth
                        variant="outlined"                          
                        InputLabelProps={{
                            shrink: true,
                        }}
                        inputProps={{
                            step: 300, // 5 min
                        }} />                      
            </Grid>                 
            <Grid item xs={12} sm={2}>            
                <Button color="primary" variant="contained" type="button" disabled={props.disabled} 
                    title={"Incluir/atualizar manualmente os horários despendidos"}
                    onClick={ (e: any) => { callSubmit("manual"); } }>{formik.values.manualSelectedSpendedTime == null ? "Incluir" : "Atualizar"}</Button>
            </Grid> 
            <Grid item xs={12}>
                <TableContainer component={Paper} className={classes.root}>                      
                    <Table size="medium" aria-label="Lista de horas despendidas">
                    <TableHead>
                        <TableRow>
                        <TableCell>Peças</TableCell>
                        <TableCell align="center">Etapas</TableCell>
                        <TableCell align="center">Tempo</TableCell>
                        <TableCell align="center" className={classes.columnOption}>Opções</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <EmptyRowDataTable data={props.serviceSpendedTimes} message="Nenhum tempo despendido!" colSpan={4} />

                        {props.serviceSpendedTimes && props.serviceSpendedTimes.length > 0 && props.serviceSpendedTimes.map((row) => (
                        <TableRow key={row.id}>
                            <TableCell scope="row">
                                {row.getClothNames()}
                            </TableCell>
                            <TableCell>{row.getStepNames()}</TableCell>
                            <TableCell align="center">{row.getSpendedTime()}</TableCell>
                            <TableCell align="center">
                                <Grid container>
                                    <Grid item xs={12} sm={6}>
                                    <IconButton aria-label="edit" title="Editar tempo despendido" color="secondary" disabled={props.disabled}
                                        onClick={ () => editSpendedTime(row) }>
                                        <EditIcon />
                                    </IconButton> 
                                    </Grid>
                                    <Grid item xs={12} sm={6}>                                
                                        <IconButton aria-label="delete" title="Excluir recurso" color="secondary" disabled={props.disabled} 
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
                    handleClose={closeAlertDialog} handleConfirm={ () => removeSpendedTime() } />        
            </Grid>                               
        </Grid>
    </form>
    </>
    );
};

export default RegisterSpendedTime;