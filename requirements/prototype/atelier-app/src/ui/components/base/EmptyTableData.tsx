import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Typography from '@material-ui/core/Typography';

interface EmptyTableDataProps {
    message: string,
    data: any[],
    colSpan: number
}

export default function EmptyTableData(props: EmptyTableDataProps) {
    if (props.data && props.data.length > 0)
        return null;

    return (
        <TableRow>
            <TableCell colSpan={props.colSpan}>                           
                <Typography variant="h6" align="center" gutterBottom>
                {props.message}
                </Typography> 
            </TableCell>
        </TableRow>                                    
    );
}