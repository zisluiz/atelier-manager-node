import React from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

interface RadioButtonsGroupProps {
    label: string,
    ariaLabel: string,
    name: string,
    options: any[],
    selected: any,
    handleChange: Function
}

export default function RadioButtonsGroup(props: RadioButtonsGroupProps) {

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.handleChange((event.target as HTMLInputElement).value);
  };

  return (
    <FormControl component="fieldset" variant="outlined">
      <FormLabel component="legend">{props.label}</FormLabel>
      <RadioGroup aria-label={props.ariaLabel} row name={props.name} value={props.selected} onChange={handleChange}>
          {props.options && props.options.length > 0 && props.options.map((option) => {                            
            return <FormControlLabel key={option.value} value={option.value} control={<Radio />} label={option.label}/>
          })}
      </RadioGroup>
    </FormControl>
  );
}