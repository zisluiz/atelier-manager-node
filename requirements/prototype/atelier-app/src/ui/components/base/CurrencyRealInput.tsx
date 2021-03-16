import React from 'react';
import NumberFormat, { NumberFormatProps } from 'react-number-format';
import TextField from '@material-ui/core/TextField';

const CurrencyRealInput = (props: NumberFormatProps) => {  
    const handleFocus = (event: any) => event.target.select();

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
            allowNegative={false}
            onFocus={handleFocus}
            fullWidth
          />  
    );
}

export default CurrencyRealInput;