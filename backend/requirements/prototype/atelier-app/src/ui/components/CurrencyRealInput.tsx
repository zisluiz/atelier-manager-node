import React from 'react';
import NumberFormat from 'react-number-format';
import TextField from '@material-ui/core/TextField';

const CurrencyRealInput = (props: any) => {     
    return(
        <NumberFormat {...props}
        variant="outlined"              
        customInput={TextField}
        prefix={'R$ '}
        decimalSeparator=","
        type="text"
        thousandSeparator="."
        decimalScale={2}
        fixedDecimalScale
        fullWidth  />  
    );
}

export default CurrencyRealInput;