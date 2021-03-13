import React from 'react';
import Chip from '@material-ui/core/Chip';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap',
      listStyle: 'none',
      padding: theme.spacing(0.5),
      margin: 0,
    },
    chip: {
      margin: theme.spacing(4.0)
    },
  }),
);

const CategoryListOutput = ({categories}) => { 
    const classes = useStyles();

    return (
        <ul className={classes.root}>
          {categories.map((category) => {
            return (
              <li key={category.name}>
                <Chip style={{backgroundColor: category.color}}
                  label={category.name}
                />
              </li>
            );
          })}
        </ul>
      );
}

export default CategoryListOutput;