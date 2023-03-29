import { UiState } from './'

type UiActionType =
    | { type: '[UI] - toggleMenu' }

export const uiReducer = (state: UiState, action: UiActionType): UiState => {
    switch (action.type) {
        case '[UI] - toggleMenu':
            return {
                ...state,
                isMenuOpen: !state.isMenuOpen
            }

        default: return state
    }
}