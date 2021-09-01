import { useContext } from 'react';
import { EditContext } from './EditContext';

export const useEditContext = (props) => {
    // Can't find a way to specify the RecordType when CreateContext is declared
    // @ts-ignore
    const context = useContext(EditContext);

    if (!context.resource) {
        /**
         * The element isn't inside a <EditContext.Provider>
         * To avoid breakage in that case, fallback to props
         *
         * @deprecated - to be removed in 4.0
         */
        if (process.env.NODE_ENV !== 'production') {
            console.log(
                "Edit components must be used inside a <EditContext.Provider>. Relying on props rather than context to get Edit data and callbacks is deprecated and won't be supported in the next major version of react-admin."
            );
        }
        // Necessary for actions (EditActions) which expect a data prop containing the record
        // @deprecated - to be removed in 4.0d
        return {
            ...props,
            record: props.record || props.data,
            data: props.record || props.data,
        };
    }

    return context;
};
