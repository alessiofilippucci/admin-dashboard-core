import * as React from 'react';
import { memo } from 'react';
import get from 'lodash/get';
import Typography from '@material-ui/core/Typography';

import sanitizeRestProps from './sanitizeRestProps';
import { fieldPropTypes } from './types';

const TextField = memo(
    ({ className, source, record = {}, emptyText, ...rest }) => {
        const value = get(record, source);

        return (
            <Typography
                component="span"
                variant="body2"
                className={className}
                {...sanitizeRestProps(rest)}
            >
                {value != null && typeof value !== 'string'
                    ? JSON.stringify(value)
                    : value || emptyText}
            </Typography>
        );
    }
);

// what? TypeScript looses the displayName if we don't set it explicitly
TextField.displayName = 'TextField';

TextField.defaultProps = {
    addLabel: true,
};

TextField.propTypes = {
    ...Typography.propTypes,
    ...fieldPropTypes,
};

export default TextField;
