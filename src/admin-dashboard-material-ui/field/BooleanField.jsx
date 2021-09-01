import * as React from 'react';
import { memo } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import classnames from 'classnames';
import DoneIcon from '@material-ui/icons/Done';
import ClearIcon from '@material-ui/icons/Clear';
import { Tooltip, Typography, FormGroup, FormControlLabel, Switch, Checkbox, } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslate, FieldTitle } from 'admin-dashboard-core';

import { fieldPropTypes } from './types';
import sanitizeRestProps from './sanitizeRestProps';
import { green, red } from '@material-ui/core/colors';

const useStyles = makeStyles(
    theme => ({
        root: {
            display: 'flex',
        },
        rootInline: {
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: theme.spacing(2.25),
        },
        toggle: {
            height: '100%',
        },
        trueColor: {
            color: green[600]
        },
        falseColor: {
            color: red[500]
        },
        fieldTitle: {
            marginTop: theme.spacing(.25),
        }
    }),
    {
        name: 'RaBooleanField',
    }
);

export const BooleanField = memo(
    props => {
        const {
            className,
            classes: classesOverride,
            emptyText,
            source,
            record = {},
            valueLabelTrue,
            valueLabelFalse,
            TrueIcon,
            FalseIcon,
            asToggle,
            label,
            fieldTitle,
            colored,
            inline,
            asStandardField,
            useCheckbox,
            rowIndex,
            showRenderCount,
            ...rest
        } = props;
        const translate = useTranslate();
        const classes = useStyles(props);
        const value = get(record, source);
        let ariaLabel = value ? valueLabelTrue : valueLabelFalse;

        if (!ariaLabel) {
            ariaLabel = value === false ? 'ra.boolean.false' : 'ra.boolean.true';
        }
        if (value === false || value === true) {
            if (asToggle) {
                return (
                    <FormGroup aria-label="position" row className={classnames(classes.toggle, className)} >
                        <FormControlLabel
                            control={<Switch checked={value} color="primary" />}
                            label={""}
                            labelPlacement={inline ? "start" : "top"}
                            disabled
                        />
                    </FormGroup>
                )
            }

            if (useCheckbox) {
                return (
                    <FormGroup aria-label="position" row className={classnames(classes.toggle, className)} >
                        <FormControlLabel
                            control={<Checkbox checked={value} readOnly />}
                            label={<FieldTitle
                                label={label}
                                source={source}
                                resource={rest.resource}
                                isRequired={rest.isRequired}
                            />}
                            labelPlacement={inline ? "end" : "top"}
                        />
                    </FormGroup>
                )
            }
            
            if (inline) {
                let finalFieldTitle = fieldTitle;

                if(!fieldTitle && label){
                    finalFieldTitle = <FieldTitle
                        label={label}
                        source={source}
                        resource={rest.resource}
                        isRequired={rest.isRequired}
                    />;
                }

                return (
                    <Typography
                        component="span"
                        variant="body2"
                        className={classnames(classes.root, className, classes.rootInline)}
                        {...sanitizeRestProps(rest)}
                    >
                        {
                            finalFieldTitle &&
                            React.cloneElement(finalFieldTitle, {
                                className: classnames(finalFieldTitle.props.className, classes.fieldTitle),
                                label: label
                            })
                        }
                        <Tooltip title={translate(ariaLabel, { _: ariaLabel })}>
                            {value === true ? (
                                <span>
                                    <TrueIcon data-testid="true" fontSize="small" className={colored ? classes.trueColor : ''} />
                                </span>
                            ) : (
                                <span>
                                    <FalseIcon data-testid="false" fontSize="small" className={colored ? classes.falseColor : ''} />
                                </span>
                            )}
                        </Tooltip>
                    </Typography>
                );
            }

            return (
                <Typography
                    component="span"
                    variant="body2"
                    className={classnames(classes.root, className)}
                    {...sanitizeRestProps(rest)}
                >
                    <Tooltip title={translate(ariaLabel, { _: ariaLabel })}>
                        {value === true ? (
                            <span>
                                <TrueIcon data-testid="true" fontSize="small" className={colored ? classes.trueColor : ''} />
                            </span>
                        ) : (
                             <span>
                                <FalseIcon data-testid="false" fontSize="small" className={colored ? classes.falseColor : ''} />
                            </span>
                        )}
                    </Tooltip>
                </Typography>
            );
        }

        return (
            <Typography
                component="span"
                variant="body2"
                className={className}
                {...sanitizeRestProps(rest)}
            >
                {fieldTitle && React.cloneElement(fieldTitle, {
                    className: classnames(fieldTitle.props.className, classes.fieldTitle)
                })}
                {emptyText}
            </Typography>
        );
    }
);

BooleanField.defaultProps = {
    addLabel: true,
    TrueIcon: DoneIcon,
    FalseIcon: ClearIcon,
    colored: false,
    inline: false,
};

BooleanField.propTypes = {
    ...Typography.propTypes,
    ...fieldPropTypes,
    valueLabelFalse: PropTypes.string,
    valueLabelTrue: PropTypes.string,
    TrueIcon: PropTypes.elementType,
    FalseIcon: PropTypes.elementType,
    colored: PropTypes.bool,
    inline: PropTypes.bool,
};

export default BooleanField;
