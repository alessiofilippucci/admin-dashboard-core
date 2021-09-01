import * as React from 'react';
import { cloneElement } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { useTranslate, warning } from 'admin-dashboard-core';

const Title = ({
    className,
    defaultTitle,
    record,
    title,
    resource,
    ...rest
}) => {
    const translate = useTranslate();
    const container = typeof document !== 'undefined' ? document.getElementById('react-admin-title') : null;
    if (!container) return null;
    warning(!defaultTitle && !title, 'Missing title prop in <Title> element');

    const titleElement = !title ? (
        title === undefined ? (
            <span className={className} {...rest}>
                {defaultTitle}
            </span>
        ) : ''
    ) : typeof title === 'string' ? (
        <span className={className} {...rest}>
            {translate(title, { _: title })}
        </span>
    ) : (cloneElement(title, { className, record, resource, ...rest }));
    return createPortal(titleElement, container);
};

export const TitlePropType = PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
]);

Title.propTypes = {
    defaultTitle: PropTypes.string,
    className: PropTypes.string,
    record: PropTypes.any,
    title: TitlePropType,
    resource: PropTypes.string,
};

export default Title;
