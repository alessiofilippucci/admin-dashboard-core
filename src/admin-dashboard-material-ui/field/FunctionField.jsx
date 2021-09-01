import * as React from 'react';
import { memo } from 'react';
import Typography from '@material-ui/core/Typography';

import sanitizeRestProps from './sanitizeRestProps';
import { fieldPropTypes } from './types';

/**
 * Field using a render function
 *
 * @example
 * <FunctionField
 *     source="last_name" // used for sorting
 *     label="Name"
 *     render={record => record && `${record.first_name} ${record.last_name}`}
 * />
 */
const FunctionField = memo(
    ({ className, record, source = '', render, rowIndex, ...rest }) =>
        record ? (
            <Typography
                component="span"
                variant="body2"
                className={className}
                {...sanitizeRestProps(rest)}
            >
                {render(record, source)}
            </Typography>
        ) : null
);

FunctionField.defaultProps = {
    addLabel: true,
};

FunctionField.propTypes = {
    ...Typography.propTypes,
    ...fieldPropTypes,
};

export default FunctionField;
