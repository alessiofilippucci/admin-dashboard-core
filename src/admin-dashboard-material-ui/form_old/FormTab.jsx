import * as React from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import MuiTab from '@material-ui/core/Tab';
import classnames from 'classnames';
import { useTranslate } from 'admin-dashboard-core';

import FormInput from './FormInput';

const hiddenStyle = { display: 'none' };

const FormTab = ({
    basePath,
    className,
    contentClassName,
    children,
    hidden,
    icon,
    intent,
    label,
    margin,
    record,
    resource,
    useBootstrap,
    variant,
    value,
    ...rest
}) => {
    const translate = useTranslate();
    const location = useLocation();

    const renderHeader = () => (
        <MuiTab
            key={label}
            label={translate(label, { _: label })}
            value={value}
            icon={icon}
            className={classnames('form-tab', className)}
            component={Link}
            to={{ ...location, pathname: value }}
            {...rest}
        />
    );

    const renderContent = () => (
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
            <span style={hidden ? hiddenStyle : null} className={contentClassName}>
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
    record: PropTypes.object,
    resource: PropTypes.string,
    value: PropTypes.string,
    variant: PropTypes.oneOf(['standard', 'outlined', 'filled']),
};

FormTab.displayName = 'FormTab';

export default FormTab;
