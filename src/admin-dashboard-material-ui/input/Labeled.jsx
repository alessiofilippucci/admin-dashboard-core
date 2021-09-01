import * as React from 'react';
import { FunctionComponent, ReactElement } from 'react';
import PropTypes from 'prop-types';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import { makeStyles } from '@material-ui/core/styles';
import { FieldTitle } from 'admin-dashboard-core';
import classnames from 'classnames';

const useStyles = makeStyles(
    theme => ({
        label: {
            position: 'relative',
            marginBottom: '0.2rem',
        },
        value: {
            fontFamily: theme.typography.fontFamily,
            color: 'currentColor',
            padding: `${theme.spacing(1) / 2}px 0 ${theme.spacing(1) / 2}px`,
            border: 0,
            boxSizing: 'content-box',
            verticalAlign: 'middle',
            background: 'none',
            margin: 0, // Reset for Safari
            display: 'block',
            width: '100%',
            minHeight: 24,
            '&.asStandard::before': {
                left: 0,
                right: 0,
                bottom: 0,
                content: '""',
                position: 'absolute',
                transition: 'border-bottom-color 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
                borderBottom: '1px solid rgba(0, 0, 0, 0.42)',
                pointerEvents: 'none'
            },
            '&.asStandard:hover::before': {
                borderBottom: '2px solid rgba(0, 0, 0, 0.87)',
            }
        },
    }),
    { name: 'RaLabeled' }
);

/**
 * Use any component as read-only Input, labeled just like other Inputs.
 *
 * Useful to use a Field in the Edit or Create components.
 * The child component will receive the current record.
 *
 * This component name doesn't have a typo. We had to choose between
 * the American English "Labeled", and the British English "Labelled".
 * We flipped a coin.
 *
 * @example
 * <Labeled label="Comments">
 *     <FooComponent source="title" />
 * </Labeled>
 */
const Labeled = props => {
    const {
        children,
        className,
        classes: classesOverride,
        fullWidth,
        id,
        input,
        isRequired,
        label,
        margin = 'dense',
        meta,
        resource,
        source,
        asStandardField,
        noAsStandardField = false,
        ...rest
    } = props;
    const classes = useStyles(props);
    if (!label && !source) {
        // @ts-ignore
        const name = children && children.type && children.type.name;

        throw new Error(
            `Cannot create label for component <${name}>: You must set either the label or source props. You can also disable automated label insertion by setting 'addLabel: false' in the component default props`
        );
    }

    const { inline = false } = children.props;

    const restProps = fullWidth ? { ...rest, fullWidth } : rest;

    if (inline) {
        //console.log(source, inline, label, source, resource, isRequired, asStandardField)
        restProps.fieldTitle = <FieldTitle
            label={label}
            source={source}
            resource={resource}
            isRequired={isRequired}
        />;
    }
    return (
        <FormControl
            className={className}
            fullWidth={fullWidth}
            error={meta && meta.touched && !!(meta.error || meta.submitError)}
            margin={margin}
        >
            {
                <InputLabel htmlFor={id} shrink className={classes.label}>
                    {!inline && <FieldTitle
                            label={label}
                            source={source}
                            resource={resource}
                            isRequired={isRequired}
                        />}
                </InputLabel>
            }
            <div className={classnames(classes.value, asStandardField && !noAsStandardField ? 'asStandard' : '' )}>
                {children && typeof children.type !== 'string'
                    ? React.cloneElement(children, {
                        input,
                        resource,
                        ...restProps,
                    })
                    : children}
            </div>
        </FormControl>
    );
};

Labeled.propTypes = {
    basePath: PropTypes.string,
    children: PropTypes.element,
    className: PropTypes.string,
    classes: PropTypes.object,
    fullWidth: PropTypes.bool,
    id: PropTypes.string,
    input: PropTypes.object,
    isRequired: PropTypes.bool,
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    meta: PropTypes.object,
    onChange: PropTypes.func,
    record: PropTypes.object,
    resource: PropTypes.string,
    source: PropTypes.string,
    labelStyle: PropTypes.object,
    asStandardField: PropTypes.bool,
    noAsStandardField: PropTypes.bool,
};

export default Labeled;