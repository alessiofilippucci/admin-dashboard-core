import * as React from 'react';
import { RecordContextProvider, usePickRecordContext } from '../RecordContext';
import { CreateContext } from './CreateContext';
import { SaveContextProvider, usePickSaveContext } from './SaveContext';

/**
 * Create a Create Context.
 *
 * @example
 *
 * const MyCreate = (props) => {
 *     const controllerProps = useCreateController(props);
 *     return (
 *         <CreateContextProvider value={controllerProps}>
 *             <MyCreateView>
 *         </CreateContextProvider>
 *     );
 * };
 *
 * const MyCreateView = () => {
 *     const { record } = useRecordContext();
 *     // or, to rerender only when the save operation change but not data
 *     const { saving } = useCreateContext();
 * }
 *
 * @see CreateContext
 * @see RecordContext
 */
export const CreateContextProvider = ({    children,    value,}) => (
    <CreateContext.Provider value={value}>
        <SaveContextProvider value={usePickSaveContext(value)}>
            <RecordContextProvider value={usePickRecordContext(value)}>
                {children}
            </RecordContextProvider>
        </SaveContextProvider>
    </CreateContext.Provider>
);
