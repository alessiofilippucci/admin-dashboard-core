import * as React from 'react';
import { memo } from 'react';

import useTranslate from '../i18n/useTranslate';

import getFieldLabelTranslationArgs from './getFieldLabelTranslationArgs';

export const FieldTitle = ({
    resource,
    source,
    label,
    isRequired,
    className,
}) => {
    const translate = useTranslate();
    
    if (label && typeof label !== 'string') {
        return label;
    }
    return (
        <span className={className}>
            {translate(
                ...getFieldLabelTranslationArgs({
                    label,
                    resource,
                    source,
                })
            )}
            {isRequired && ' *'}
        </span>
    );
};

// wat? TypeScript looses the displayName if we don't set it explicitly
FieldTitle.displayName = 'FieldTitle';

export default memo(FieldTitle);
