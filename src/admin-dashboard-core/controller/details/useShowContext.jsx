import { useContext } from 'react';
import { ShowContext } from './ShowContext';

export const useShowContext = (props) => {
    // Can't find a way to specify the RecordType when CreateContext is declared
    // @ts-ignore
    const context = useContext(ShowContext);

    if (!context.resource) {
        /**
         * The element isn't inside a <ShowContext.Provider>
         * To avoid breakage in that case, fallback to props
         *
         * @deprecated - to be removed in 4.0
         */
        if (process.env.NODE_ENV !== 'production') {
            console.log(
                "Show components must be used inside a <ShowContext.Provider>. Relying on props rather than context to get Show data and callbacks is deprecated and won't be supported in the next major version of react-admin."
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
