import * as React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';

import Labeled from '../input/Labeled';
import { Utils, RenderCount } from 'admin-dashboard-core';

const sanitizeRestProps = ({
    basePath,
    record,
    ...rest
}) => rest;

const useStyles = makeStyles(
    theme => ({
        input: { width: theme.spacing(32) },
    }),
    { name: 'RaFormInput' }
);

const FormInput = (props) => {
    const { input, classes: classesOverride, useBootstrap, asStandardField, showRenderCount, subscription, ...rest } = props;
    const classes = useStyles(props);
    const { id, childFieldAsFormClassName, ...inputProps } = input ? input.props : { id: undefined, childFieldAsFormClassName: undefined };
    let childrenFormClassName = null;
    
    if (!Utils.IsEmpty(childFieldAsFormClassName) && rest.record) {
        childrenFormClassName = Utils.DeepFind(rest.record, childFieldAsFormClassName);
    }
    
    return input ? (
        <div
            className={classnames(
                'ra-input',
                `ra-input-${input.props.source}`,
                input.props.formClassName,
                childrenFormClassName,
                useBootstrap && input.props.fullWidth ? 'w-100' : ''
            )}
        >
            {showRenderCount && <RenderCount />}
            {input.props.addLabel ? (
                <Labeled
                    id={id || input.props.source}
                    asStandardField={asStandardField}
                    {...inputProps}
                    {...sanitizeRestProps(rest)}
                >
                    {React.cloneElement(input, {
                        className: classnames(
                            {
                                [classes.input]: !input.props.fullWidth,
                            },
                            input.props.className
                        ),
                        id: input.props.id || input.props.source,
                        showRenderCount: showRenderCount,
                        subscription: subscription,
                        ...rest,
                    })}
                </Labeled>
            ) : (
                React.cloneElement(input, {
                    className: classnames(
                        {
                            [classes.input]: !input.props.fullWidth,
                        },
                        input.props.className
                    ),
                    id: input.props.id || input.props.source,
                    showRenderCount: showRenderCount,
                    subscription: subscription,
                    ...rest,
                })
            )}
        </div>
    ) : null;
};

FormInput.propTypes = {
    classes: PropTypes.object,
    // @ts-ignore
    input: PropTypes.node,
    showRenderCount: PropTypes.bool,
};

FormInput.defaultProps = {
    showRenderCount: false
}

// wat? TypeScript looses the displayName if we don't set it explicitly
FormInput.displayName = 'FormInput';

export default FormInput;
