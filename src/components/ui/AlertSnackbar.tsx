import { Snackbar, Alert } from '@mui/material'
import { Dispatch, FC, SetStateAction } from 'react';


interface Props{
    alertSnackbar: { open: boolean, message: string, severity: string };
    setAlertSnackbar: Dispatch<SetStateAction<{ open: boolean; message: string; severity: string; }>>
}

export const AlertSnackbar: FC<Props> = ({ alertSnackbar, setAlertSnackbar }) => {

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setAlertSnackbar({...alertSnackbar, open: false  })
    }
    return (
        <Snackbar
            open={alertSnackbar.open}
            autoHideDuration={6000}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            sx={{ mt: 7 }}
        >
            <Alert onClose={handleClose} severity={ alertSnackbar.severity as any } sx={{ width: '100%' }} >
                { alertSnackbar.message }
            </Alert>
        </Snackbar>
    )
}
