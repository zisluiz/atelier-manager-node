import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import CurrencyRealOutput from 'src/ui/components/base/CurrencyRealOutput';

const useStyles = makeStyles({
  root: {
   
  },
  title: {
    fontSize: 14,
  }
});

interface PriceCardProps {
    label: string,
    value: number
}

export default function PriceCard(props: PriceCardProps) {
  const classes = useStyles();

  return (
    <Card className={classes.root} elevation={3}>
      <CardContent>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
          {props.label}
        </Typography>
        <Typography variant="h5" component="h2">
            <CurrencyRealOutput value={props.value} prefix={'R$ '} />
        </Typography>
      </CardContent>
    </Card>
  );
}