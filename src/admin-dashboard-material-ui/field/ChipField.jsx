import * as React from 'react';
import { memo } from 'react';
import get from 'lodash/get';
import Chip from '@material-ui/core/Chip';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import classnames from 'classnames';

import sanitizeRestProps from './sanitizeRestProps';
import { fieldPropTypes } from './types';

const useStyles = makeStyles(
    {
        chip: { margin: 4, marginBottom: 8, cursor: 'inherit' },
    },
    { name: 'RaChipField' }
);

export const ChipField = memo(props => {
    const {
        className,
        source,
        record = {},
        emptyText,
        asStandardField,
        ...rest
    } = props;
    const classes = useStyles(props);
    const value = get(record, source);

    if (value == null && emptyText) {
        return (
            <Typography
                component="span"
                variant="body2"
                className={className}
                {...sanitizeRestProps(rest)}
            >
                {emptyText}
            </Typography>
        );
    }

    return (
        <Chip
            className={classnames(classes.chip, className)}
            label={value}
            {...sanitizeRestProps(rest)}
        />
    );
});

ChipField.defaultProps = {
    addLabel: false,
};

ChipField.propTypes = {
    ...ChipField.propTypes,
    ...fieldPropTypes,
};

export default ChipField;
