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

interface CategoryListOutputProps {
  categories: any[]
}

const CategoryListOutput = (props: CategoryListOutputProps) => { 
    const classes = useStyles();

    if (!props.categories || props.categories.length == 0)
      return null;

    return (
        <ul className={classes.root}>
          {props.categories.map((category: any) => {
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