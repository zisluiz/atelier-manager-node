import React, { useRef } from 'react';
import Grid from '@material-ui/core/Grid';
import Autocomplete from '@material-ui/lab/Autocomplete';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import AddBoxIcon from '@material-ui/icons/AddBox';
import { Customer } from 'src/model/Customer';

interface CustomerInputProps {
    value: Customer | null,
    options: Customer[],
    errorExpression: boolean | undefined,
    helperText: string | false | undefined,
    onChange(event: any, value: string | Customer | null): any,
    handleAddCustomer(customer: Customer): any
}

const CustomerInput = (props: CustomerInputProps) => {   
    const inputCustomerRef = useRef<HTMLInputElement>();

    return(
        <Grid container>
            <Grid item xs={11}>            
                <Autocomplete
                id="autocomplete-customers"  
                noOptionsText="Cliente não encontrado!"                    
                freeSolo={true}   
                value={props.value}
                onChange={(event: any, value: string | Customer | null) => { props.onChange(event, value); }}          
                options={props.options}                    
                getOptionLabel={(option) => option.name}
                renderInput={(params) => <TextField {...params} inputRef={inputCustomerRef} label="Cliente:" variant="outlined" required
                    error={props.errorExpression}
                    helperText={props.helperText} />}
                />
            </Grid>
            <Grid item xs={1}>      
            <IconButton aria-label="add" title="Criar novo cliente" color="secondary" 
                onClick={() => { if (!inputCustomerRef.current) return; let newCustomer = { name: inputCustomerRef.current.value}; props.handleAddCustomer(newCustomer); }} >
                <AddBoxIcon fontSize="large" />
            </IconButton> 
            </Grid>
        </Grid>
    );
}

export default CustomerInput;