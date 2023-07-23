import { Button, CircularProgress, SxProps, Theme } from '@mui/material'
import { ReactNode } from 'react';

interface Props{
    isLoading   : boolean;
    label       : string;
    onClick?    : ( argument?: any ) => void;
    type?       : 'button' | 'submit' | 'reset';
    color?      : 'secondary' | 'inherit' | 'primary' | 'success' | 'error' | 'info' | 'warning';
    startIcon?  : ReactNode;
    fullWidth?  : boolean;
    sx?         : SxProps<Theme> | undefined}

export const ButtonWithLoader = ({ isLoading, onClick, label, type = 'button', color = 'secondary', startIcon, fullWidth, sx }: Props) => {
  return (
      <Button
        startIcon= { (startIcon && !isLoading) ? startIcon : undefined } 
        color={ color }
        disabled={isLoading}
        // className='circular-btn'
        onClick={type === 'button' ? onClick : () => ''}
        fullWidth={ fullWidth }
        type={type}
        sx={sx}
        // size='large'
      >
          {
              isLoading
                  ? (<CircularProgress color='inherit' size={20} />)
                  : label
          }
      </Button>
  )
}
