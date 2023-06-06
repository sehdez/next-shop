import { Button, CircularProgress } from '@mui/material'

interface Props{
    isLoading: boolean;
    label    : string;
    onClick? : ( argument?: any ) => void;
    type?    : 'button' | 'submit' | 'reset';
    color?   : 'secondary' | 'inherit' | 'primary' | 'success' | 'error' | 'info' | 'warning';
}

export const ButtonWithLoader = ({ isLoading, onClick, label, type = 'button', color = 'secondary' }: Props) => {
  return (
      <Button
          color={ color }
          disabled={isLoading}
          className='circular-btn'
          onClick={type === 'button' ? onClick : () => console.log()}
          fullWidth
          type={type}
          size='large'
      >
          {
              isLoading
                  ? (<CircularProgress color='inherit' size={20} />)
                  : label
          }
      </Button>
  )
}
