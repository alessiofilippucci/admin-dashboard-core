import * as React from 'react';
import { createContext, useRef } from 'react';

export const SideEffectContext = createContext({});

export const SideEffectContextProvider = ({ children, value }) => (
    <SideEffectContext.Provider value={value}>
        {children}
    </SideEffectContext.Provider>
);

/**
 * Get modifiers for a save() function, and the way to update them.
 *
 * Used in useCreateController and useEditController.
 *
 * @example
 *
 * const {
 *     onSuccessRef,
 *     setOnSuccess,
 *     onFailureRef,
 *     setOnFailure,
 *     transformRef,
 *     setTransform,
 * } = useSaveModifiers({ onSuccess, onFailure, transform });
 */
export const useSaveModifiers = ({
    onSuccess,
    onFailure,
    transform,
}) => {
    const onSuccessRef = useRef(onSuccess);
    const setOnSuccess = onSuccess => {
        onSuccessRef.current = response => {
            // reset onSuccess for next submission
            onSuccessRef.current = undefined;
            return onSuccess(response);
        };
    };

    const onFailureRef = useRef(onFailure);
    const setOnFailure = onFailure => {
        onFailureRef.current = error => {
            // reset onFailure for next submission
            onFailureRef.current = undefined;
            return onFailure(error);
        };
    };

    const transformRef = useRef(transform);
    const setTransform = transform => {
        transformRef.current = data => {
            // reset transform for next submission
            transformRef.current = undefined;
            return transform(data);
        };
    };

    return {
        onSuccessRef,
        setOnSuccess,
        onFailureRef,
        setOnFailure,
        transformRef,
        setTransform,
    };
};