import * as React from 'react';
import { createContext, useContext, useMemo } from 'react';
import pick from 'lodash/pick';

export const SaveContext = createContext(undefined);

export const SaveContextProvider = ({ children, value }) => (
    <SaveContext.Provider value={value}>{children}</SaveContext.Provider>
);

/**
 * Get the save() function and its status
 *
 * Used in forms.
 *
 * @example
 *
 * const {
 *     save,
 *     saving
 * } = useSaveContext();
 */
export const useSaveContext = (props) => {
    const context = useContext(SaveContext);
    
    if (!context || !context.save || !context.setOnFailure) {
        /**
         * The element isn't inside a <SaveContextProvider>
         * To avoid breakage in that case, fallback to props
         *
         * @deprecated - to be removed in 4.0
         */
        if (process.env.NODE_ENV !== 'production') {
            console.log(
                "Edit or Create child components must be used inside a <SaveContextProvider>. Relying on props rather than context to get persistence related data and callbacks is deprecated and won't be supported in the next major version of react-admin."
            );
        }

        return props;
    }

    return context;
};

export const usePickSaveContext = (context) => {
    const value = useMemo(
        () =>
            pick(context, [
                'save',
                'saving',
                'setOnFailure',
                'setOnSuccess',
                'setTransform',
                'onSuccessRef',
                'onFailureRef',
                'transformRef',
            ]),
        /* eslint-disable react-hooks/exhaustive-deps */
        [
            context.save,
            context.saving,
            context.setOnFailure,
            context.setOnSuccess,
            context.setTransform,
            context.setTransform,
            context.onFailureRef,
            context.onSuccessRef,
            context.transformRef,
        ]
        /* eslint-enable react-hooks/exhaustive-deps */
    );

    return value;
};