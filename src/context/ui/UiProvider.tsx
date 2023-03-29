import { FC, useReducer, PropsWithChildren } from 'react';
import { UiContext, uiReducer } from "./";

export interface UiState {
    isMenuOpen: boolean;
}

const UI_INITIAL_STATE: UiState = {
    isMenuOpen: false
}

export const UiProvider: FC<PropsWithChildren> = ({ children }) => {
    const [state, dispatch] = useReducer(uiReducer, UI_INITIAL_STATE);

    const toggleSideMenu = () => {
        dispatch({ type: '[UI] - toggleMenu' })
    }
    return (
        <UiContext.Provider value={{
            ...state,
            // métodos
            toggleSideMenu
        }}
        >
            {children}
        </UiContext.Provider >
    )
}
