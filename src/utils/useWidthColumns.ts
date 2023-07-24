import { useEffect, useState } from "react";


export const useWidthColumns = () :number[] => {
    const [columnWidths, setColumnWidths] = useState<number[]>([0,0]);
    // UseEffect para calcular el tamaño de las columnas
    useEffect(() => {

        const calculateColumnWidths = () => {
            /**
             * EL CONTENEDOR DE LA TABLA MIDE UN MÁXIMO DE 1440PX, Y HAY DOS COLUMNAS ESTÁTICAS DE 100PX MAS 60 PX DE PADDING
             * EN ESTE CASO SÓLO SE HIZO EL CALCULO PARA 2 COLUMNAS QUE VAN A TENER EL 48% DEL CONTENEDOR - LAS 2 CULUMNAS
             */
            const screenWidth = window.innerWidth > 1500 ? 1140 : window.innerWidth - 360;
            const columnWidths = [
                screenWidth * 0.47,
                screenWidth * 0.47,
            ];
            setColumnWidths(columnWidths);
        };

        calculateColumnWidths();

        // Agrega un event listener para recalcular los anchos cuando cambie el tamaño de la ventana
        window.addEventListener('resize', calculateColumnWidths);

        // Limpia el event listener cuando el componente se desmonte
        return () => {
            window.removeEventListener('resize', calculateColumnWidths);
        };
    }, []);

    return columnWidths

}