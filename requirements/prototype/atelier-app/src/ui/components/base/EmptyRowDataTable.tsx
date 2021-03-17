import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Typography from '@material-ui/core/Typography';

interface EmptyRowDataTableProps {
    message: string,
    data: any[] | null,
    colSpan: number
}

export default function EmptyRowDataTable(props: EmptyRowDataTableProps) {
    if (props.data && props.data.length > 0)
        return null;

    return (
        <TableRow>
            <TableCell colSpan={props.colSpan}>                           
                <Typography variant="subtitle1" align="center" gutterBottom>
                {props.message}
                </Typography> 
            </TableCell>
        </TableRow>                                    
    );
}