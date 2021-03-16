import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import CurrencyRealOutput from 'src/ui/components/base/CurrencyRealOutput';
import HelpIcon from '@material-ui/icons/Help';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles({
  root: {
   
  },
  title: {
    fontSize: 14,
  },
  toolTip: {
    top: "4px",
    marginTop: "-10px",    
    padding: "4px"
  }
});

interface PriceCardProps {
    label: string,
    value: number,
    toolTip?: string
}

export default function PriceCard(props: PriceCardProps) {
  const classes = useStyles();

  return (
    <Card className={classes.root} elevation={3}>      
      <CardContent>        
        <Typography className={classes.title} color="textSecondary" component="span" >
          {props.label}
        </Typography>
        {props.toolTip && 
        <Tooltip title={props.toolTip} className={classes.toolTip}>   
          <IconButton aria-label={props.toolTip}>
            <HelpIcon />
          </IconButton>        
        </Tooltip>}  

      <Typography variant="h5" component="h2">
          <CurrencyRealOutput value={props.value} prefix={'R$ '} />
      </Typography>

      </CardContent>
    </Card>
  );
}