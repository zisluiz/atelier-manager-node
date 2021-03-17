import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import theme from 'src/theme';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Box from '@material-ui/core/Box';
import CardHeader from '@material-ui/core/CardHeader';

const useStyles = makeStyles({
  root: {
  }, cardContent: {
    [theme.breakpoints.up('sm')]: {
      padding: "6px 16px 6px 16px"    
    }
  }
});

interface ContentCardProps {
    header: string,
    marginTop?: number
    children: any
}

export default function ContentCard(props: ContentCardProps) {
  const classes = useStyles();

  return (
    <Box mt={props.marginTop? props.marginTop : 0}>
      <Card className={classes.root} variant="outlined">
        <CardHeader subheader={props.header} />
          <CardContent className={classes.cardContent}>
            {props.children}
          </CardContent>        
      </Card>
    </Box>
  );
}