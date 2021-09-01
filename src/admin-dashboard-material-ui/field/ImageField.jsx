import * as React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import classnames from 'classnames';

import sanitizeRestProps from './sanitizeRestProps';
import { fieldPropTypes } from './types';

import { Utils, useGetOne } from 'admin-dashboard-core';

const useStyles = makeStyles(
    {
        root: { display: 'inline-block' },
        list: {
            display: 'flex',
            listStyleType: 'none',
        },
        image: {
            margin: '0.5rem',
            maxHeight: '10rem',
        },
    },
    { name: 'RaImageField' }
);

const ImageField = props => {
    const {
        className,
        emptyText,
        record,
        source,
        title,
        src,
        target,
        download,
        ping,
        rel,
        onClick,
        ...rest
    } = props;
    let sourceValue = get(record, source);
    let _target = target;
    const classes = useStyles(props);

    if (!sourceValue) {
        return emptyText ? (
            <Typography
                component="span"
                variant="body2"
                className={className}
                {...sanitizeRestProps(rest)}
            >
                {emptyText}
            </Typography>
        ) : (
            <div
                className={classnames(classes.root, className)}
                {...sanitizeRestProps(rest)}
            />
        );
    }

    if (Array.isArray(sourceValue)) {
        return (
            <ul
                className={classnames(classes.list, className)}
                {...sanitizeRestProps(rest)}
            >
                {sourceValue.map((file, index) => {
                    const fileTitleValue = get(file, title) || title;
                    let srcValue = get(file, src) || title;
                    let thisOnClick = null;
                    if (srcValue.startsWith("data:")) {
                        let tempData = srcValue;
                        thisOnClick = () => Utils.ShowBase64Image(tempData);
                        srcValue = "#";
                    }
                    else if (Utils.IsFunction(onClick) && !srcValue.startsWith("blob:")) {
                        let tempData = srcValue;
                        thisOnClick = (e) => { e.preventDefault(); onClick(tempData) };
                        sourceValue = "";
                        _target = null;
                    }

                    return (
                        <li key={index}>
                            <a
                                href={srcValue}
                                onClick={thisOnClick}
                                title={fileTitleValue}
                                target={_target}
                                download={download}
                                ping={ping}
                                rel={rel}
                            >
                                <img
                                    alt={fileTitleValue}
                                    title={fileTitleValue}
                                    src={srcValue}
                                    className={classes.image}
                                />
                            </a>
                        </li>
                    );
                })}
            </ul>
        );
    }

    const titleValue = get(record, title) || title;
    let thisOnClick = null;

    if (sourceValue.startsWith("data:")) {
        thisOnClick = () => Utils.ShowBase64Image(sourceValue);
    } else if (Utils.IsFunction(onClick) && !sourceValue.startsWith("blob:")) {
        thisOnClick = (e) => { e.preventDefault(); onClick(sourceValue) };
    }

    return (
        <div
            className={classnames(classes.root, className)}
            {...sanitizeRestProps(rest)}
        >
            <a
                href={sourceValue}
                onClick={thisOnClick}
                title={titleValue}
                target={_target}
                download={download}
                ping={ping}
                rel={rel}
            >
                <img
                    title={titleValue}
                    alt={titleValue}
                    src={sourceValue}
                    className={classes.image}
                />
            </a>
        </div>
    );
};

// wat? TypeScript looses the displayName if we don't set it explicitly
ImageField.displayName = 'ImageField';

ImageField.defaultProps = {
    addLabel: true,
};

ImageField.propTypes = {
    ...fieldPropTypes,
    src: PropTypes.string,
    title: PropTypes.string,
    target: PropTypes.string,
    download: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    ping: PropTypes.string,
    rel: PropTypes.string,
};

export default ImageField;
