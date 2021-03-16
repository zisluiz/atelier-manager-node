import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import Select from '@material-ui/core/Select';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

interface ComboBoxProps {
    label: string,
    idLabel: string,
    value: any,
    options: any[],
    error?: boolean,
    helperText?: string | false,
    handleChange(value: any): any
}

export default function ComboBox(props: ComboBoxProps) {

  return (
    <FormControl variant="outlined" fullWidth>
      <InputLabel id={props.idLabel}>{props.label}</InputLabel>
      <Select label={props.label}
        labelId={props.idLabel}
        value={props.value}
        onChange={ (event: React.ChangeEvent<{ value: unknown }>) => { props.handleChange(event.target.value); } }
        error={props.error}> 

        {props.options.map((option) => <MenuItem key={option.id} value={option.id}>{option.name}</MenuItem> )}
      </Select>
      <FormHelperText>{props.helperText}</FormHelperText>
  </FormControl>
  );
}