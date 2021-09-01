import * as React from 'react';
import { memo } from 'react';
import get from 'lodash/get';
import classNames from 'classnames';

import sanitizeRestProps from './sanitizeRestProps';
import { fieldPropTypes } from './types';

import { makeStyles } from '@material-ui/core/styles';
import { IconButton, Link, Tooltip, Typography } from '@material-ui/core';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';

import { useNotify, useTranslate } from 'admin-dashboard-core';

const useStyles = makeStyles(
    theme => ({
        wrapper: {
            border: 0,
            display: 'flex',
            width: '100%',
        },
        copyIcon: {
            height: 16,
            width: 0,
            width: 16,
        },
        copyButton: {
            height: 24,
            width: 24,
            padding: 0,
            marginLeft: 'auto',
        },
    }),
);

const UrlField = memo(
    ({ className, emptyText, source, record = {}, withCopy, ...rest }) => {
        const classes = useStyles();
        const translate = useTranslate();
        const notify = useNotify();

        const label = translate(`resources.${rest.resource}.fields.${source}`);
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
            <div className={classes.wrapper}>
                <Link
                    className={className}
                    href={value}
                    target="_blank"
                    {...sanitizeRestProps(rest)}
                >
                    {value}
                </Link>
                {
                    withCopy &&
                    <Tooltip title={translate('ra.input.copy_custom', { name: label })}>
                        <IconButton
                            className={classes.copyButton}
                            aria-label={translate('ra.input.copy_custom', { name: label })}
                            onClick={() => { navigator.clipboard.writeText(value); notify('ra.input.copied_custom', 'success', { name: label }); }}
                        >
                            <FileCopyOutlinedIcon className={classNames(classes.copyIcon)} />
                        </IconButton>
                    </Tooltip>
                }
            </div >
        );
    }
);

UrlField.defaultProps = {
    addLabel: true,
};

UrlField.propTypes = fieldPropTypes;
UrlField.displayName = 'UrlField';

export default UrlField;
