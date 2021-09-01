import * as React from 'react';
import { memo } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import Typography from '@material-ui/core/Typography';
import sanitizeRestProps from './sanitizeRestProps';
import { fieldPropTypes } from './types';

export const removeTags = (input) =>
    input ? input.replace(/<[^>]+>/gm, '') : '';

const RichTextField = memo(
    ({ className, emptyText, source, record = {}, stripTags, ...rest }) => {
        const value = get(record, source);

        return (
            <Typography
                className={className}
                variant="body2"
                component="span"
                {...sanitizeRestProps(rest)}
            >
                {value == null && emptyText ? (
                    emptyText
                ) : stripTags ? (
                    removeTags(value)
                ) : (
                    <span dangerouslySetInnerHTML={{ __html: value }} />
                )}
            </Typography>
        );
    }
);

RichTextField.defaultProps = {
    addLabel: true,
    stripTags: false,
};

RichTextField.propTypes = {
    ...Typography.propTypes,
    ...fieldPropTypes,
    stripTags: PropTypes.bool,
};

RichTextField.displayName = 'RichTextField';

export default RichTextField;
