import React from 'react';
import NumberFormat from 'react-number-format';
import TextField from '@material-ui/core/TextField';

const IntegerInput = (props: any) => {     
    return(
        <NumberFormat {...props}
            variant="outlined"              
            customInput={TextField}                
            type="text"
            thousandSeparator="."
            decimalSeparator=","
            decimalScale={0}
            allowNegative={false}
            fullWidth  />  
    );
}

export default IntegerInput;