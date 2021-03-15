import Button from '@material-ui/core/Button';
import React from 'react';
import Container from '@material-ui/core/Container';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered';
import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import CurrencyRealOutput from 'src/ui/components/base/CurrencyRealOutput';
import CategoryListOutput from 'src/ui/components/base/CategoryListOutput';
import ClothDialog from 'src/ui/dialogs/ClothDialog';
import { Cloth } from 'src/model/Cloth';
import { ServiceType } from 'src/model/ServiceType';
import AlertDialog from 'src/ui/components/base/AlertDialog';
import * as ArraysUtil from 'src/util/ArraysUtil';
import * as IdentityUtil from 'src/util/IdentityUtil';
import EmptyTableData from 'src/ui/components/base/EmptyTableData';
import ServiceRequisitionController from 'src/controller/ServiceRequisitionController';

interface RegisterSpendedTimeProps {

}

const RegisterSpendedTime = (props:RegisterSpendedTimeProps) => {    


    return(
        <></>
    );
};

export default RegisterSpendedTime;