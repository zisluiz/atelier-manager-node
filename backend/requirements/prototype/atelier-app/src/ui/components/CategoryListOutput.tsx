import React from 'react';
import Box from '@material-ui/core/Box';
import Chip from '@material-ui/core/Chip';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { redirect } from 'next/dist/next-server/server/api-utils';

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

const CategoryListOutput = ({data}) => { 
    const classes = useStyles();

    return (
        <Box component="ul" className={classes.root}>
          {data.map((data) => {
            return (
              <li key={data.name}>
                <Chip style={{backgroundColor: data.color}}
                  label={data.name}
                />
              </li>
            );
          })}
        </Box>
      );
}

export default CategoryListOutput;