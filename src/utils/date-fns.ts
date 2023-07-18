
import { format } from 'date-fns';
import { es } from 'date-fns/locale';


export const formatDate = (date: string, formato: string = 'dd MMMM yyyy' ) => {

    return format(new Date(date), formato, {locale: es});
}

