import React from 'react';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: {
    flexGrow: 1
  },
});

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

interface TabProps {
  tabIndex: number,
  ariaLabel: string,
  tabs: any,
  tabPanels: any,
  handleChange(event: React.ChangeEvent<{}>, value: any): any
}

export function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (          
        <Box p={3}>
          {children}
        </Box>
      )}
    </div>
  );
}

export function a11yPropsTab(index: any) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export function TabComponent(props:TabProps) {    
  const classes = useStyles();

  return (
    <Paper square className={classes.root}>
      <Tabs      
        value={props.tabIndex}
        onChange={props.handleChange}
        variant="fullWidth"
        indicatorColor="secondary"
        textColor="secondary"
        aria-label={props.ariaLabel}>

        {props.tabs}

      </Tabs>

      {props.tabPanels}
    </Paper> 
  );
}