import * as React from 'react';
import { createContext, useContext, useMemo } from 'react';
import pick from 'lodash/pick';

/**
 * Context to store the current record.
 *
 * Use the useRecordContext() hook to read the context. That's what the Edit and Show components do in react-admin.
 *
 * @example
 *
 * import { useEditController, EditContext } from 'ra-core';
 *
 * const Edit = props => {
 *     const { record }= useEditController(props);
 *     return (
 *         <RecordContextProvider value={record}>
 *             ...
 *         </RecordContextProvider>
 *     );
 * };
 */
export const RecordContext = createContext(
    undefined
);

export const RecordContextProvider = ({ children, value, }) => (
    <RecordContext.Provider value={value}>{children}</RecordContext.Provider>
);
RecordContext.displayName = 'RecordContext';

export const usePickRecordContext = (context) => {
    const value = useMemo(() => pick(context, ['record']), [context.record]); // eslint-disable-line
    return value;
};

/**
 * Hook to read the record from a RecordContext.
 *
 * Must be used within a <RecordContext> such as provided by the <EditContextProvider>
 * (e.g. as a descendent of <Edit> or <EditBase>) or within a <ShowContextProvider>
 * (e.g. as a descendent of <Show> or <ShowBase>)
 *
 * @returns {Record} The record context
 */
export const useRecordContext = (props) => {
    // Can't find a way to specify the RecordType when CreateContext is declared
    // @ts-ignore
    const context = useContext(RecordContext);

    if (!context) {
        // As the record could very well be undefined because not yet loaded
        // We don't display a deprecation warning yet
        // @deprecated - to be removed in 4.0
        return props;
    }

    return context;
};