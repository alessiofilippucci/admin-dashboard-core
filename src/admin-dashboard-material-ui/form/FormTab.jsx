import * as React from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import MuiTab from '@material-ui/core/Tab';
import classnames from 'classnames';
import {
    FormGroupContextProvider,
    useTranslate,
    useFormGroup,
} from 'admin-dashboard-core';

import FormInput from './FormInput';
import { FormTabHeader } from './FormTabHeader';

const hiddenStyle = { display: 'none' };

const FormTab = ({
    basePath,
    className,
    classes,
    contentClassName,
    children,
    hidden,
    icon,
    intent,
    label,
    margin,
    path,
    record,
    resource,
    useBootstrap,
    variant,
    value,
    ...rest
}) => {
    const renderHeader = () => (
        <FormTabHeader
            label={label}
            value={value}
            icon={icon}
            className={className}
            classes={classes}
            {...rest}
        />
    );

    const renderContent = () => (
        <FormGroupContextProvider name={value}>
            {
                useBootstrap ?
                    <div style={hidden ? hiddenStyle : null} className={classnames(contentClassName, 'container-fluid')}>
                        <div className={'row'}>
                            {React.Children.map(
                                children,
                                (input) =>
                                    input && (
                                        <FormInput
                                            basePath={basePath}
                                            input={input}
                                            record={record}
                                            resource={resource}
                                            variant={input.props.variant || variant}
                                            margin={input.props.margin || margin}
                                            useBootstrap={useBootstrap}
                                        />
                                    )
                            )}
                        </div>
                    </div> :
                    <span style={hidden ? hiddenStyle : null} className={contentClassName} id={`tabpanel-${value}`} aria-labelledby={`tabheader-${value}`}>
                        {React.Children.map(
                            children,
                            (input) =>
                                input && (
                                    <FormInput
                                        basePath={basePath}
                                        input={input}
                                        record={record}
                                        resource={resource}
                                        variant={input.props.variant || variant}
                                        margin={input.props.margin || margin}
                                    />
                                )
                        )}
                    </span>
            }
        </FormGroupContextProvider>
    );

    return intent === 'header' ? renderHeader() : renderContent();
};

FormTab.propTypes = {
    basePath: PropTypes.string,
    className: PropTypes.string,
    contentClassName: PropTypes.string,
    children: PropTypes.node,
    intent: PropTypes.oneOf(['header', 'content']),
    hidden: PropTypes.bool,
    icon: PropTypes.element,
    label: PropTypes.string.isRequired,
    margin: PropTypes.oneOf(['none', 'dense', 'normal']),
    path: PropTypes.string,
    // @ts-ignore
    record: PropTypes.object,
    resource: PropTypes.string,
    useBootstrap: PropTypes.bool,
    value: PropTypes.string,
    variant: PropTypes.oneOf(['standard', 'outlined', 'filled']),
};

FormTab.displayName = 'FormTab';

export default FormTab;
