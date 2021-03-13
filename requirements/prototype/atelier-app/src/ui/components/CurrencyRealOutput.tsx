import React from 'react';
import NumberFormat from 'react-number-format';

const CurrencyRealOutput = (props: any) => {     
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