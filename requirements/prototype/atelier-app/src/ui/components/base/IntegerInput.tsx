import React from 'react';
import NumberFormat, { NumberFormatProps } from 'react-number-format';
import TextField from '@material-ui/core/TextField';

const IntegerInput = (props: NumberFormatProps) => {     
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