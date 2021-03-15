import React from 'react';
import NumberFormat, { NumberFormatProps } from 'react-number-format';

const CurrencyRealOutput = (props: NumberFormatProps) => {     
    return(
        <NumberFormat {...props}
            decimalSeparator=","
            displayType="text"
            thousandSeparator="."
            decimalScale={2}
            fixedDecimalScale />
    );
}

export default CurrencyRealOutput;