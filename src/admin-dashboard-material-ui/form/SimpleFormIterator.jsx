import * as React from 'react';
import classnames from 'classnames';
import { Children, cloneElement, isValidElement, useRef } from 'react';
import PropTypes from 'prop-types';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import get from 'lodash/get';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import FormHelperText from '@material-ui/core/FormHelperText';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/RemoveCircleOutline';
import AddIcon from '@material-ui/icons/AddCircleOutline';
import { useTranslate, ValidationError, Utils } from 'admin-dashboard-core';
import classNames from 'classnames';

import FormInput from './FormInput';

const useStyles = makeStyles(
    theme => ({
        root: {
            padding: 0,
            marginBottom: 0,
            marginTop: 15,
            '& > div:last-child': {
                borderBottom: 'none',
            },
        },
        line: {
            display: 'flex',
            borderBottom: `solid 1px ${theme.palette.divider}`,
            [theme.breakpoints.down('xs')]: { display: 'block' },
            '&.no-border': {
                border: 'none',
            },
            '&.fade-enter': {
                opacity: 0.01,
                transform: 'translateX(100vw)',
            },
            '&.fade-enter-active': {
                opacity: 1,
                transform: 'translateX(0)',
                transition: 'all 500ms ease-in',
            },
            '&.fade-exit': {
                opacity: 1,
                transform: 'translateX(0)',
            },
            '&.fade-exit-active': {
                opacity: 0.01,
                transform: 'translateX(100vw)',
                transition: 'all 500ms ease-in',
            },
        },
        index: {
            width: '3em',
            paddingTop: '1em',
            [theme.breakpoints.down('sm')]: { display: 'none' },
        },
        form: { 
            position: 'relative',
            flex: 2
         },
        action: {
            paddingTop: theme.spacing(2),
            paddingBottom: theme.spacing(2),
        },
        leftIcon: {
            marginRight: theme.spacing(1),
        },
        inSidebar: {
            width: '100%'
        },
        spanTopEnd: {
            position: 'absolute',
            right: theme.spacing(.5),
            top: theme.spacing(1),
            width: 25,
            height: 25,
            padding: 0,
        },
        buttonTopEnd: {
            '& svg': {
                marginRight: '0',
            },
            width: '100%',
            minWidth: 'auto',
            padding: 0,
            margin: 0,
            position: 'absolute',
            top: 0,
        },
        spanAddFull: {},
        buttonAddFull: {
            '& svg': {
                marginRight: '0',
            },
            width: '100%'
        }
    }),
    { name: 'RaSimpleFormIterator' }
);

const DefaultAddButton = props => {
    const classes = useStyles(props);
    const translate = useTranslate();
    return (
        <Button size="small" {...props}>
            <AddIcon className={classes.leftIcon} />
            {
                !Utils.IsEmpty(props.label) && (
                    props.label ? translate(props.label) : translate('ra.action.add')
                )
            }
        </Button>
    );
};

const DefaultRemoveButton = props => {
    const classes = useStyles(props);
    const translate = useTranslate();
    return (
        <Button size="small" {...props}>
            <CloseIcon className={classes.leftIcon} />
            {
                !Utils.IsEmpty(props.label) && (
                    props.label ? translate(props.label) : translate('ra.action.remove')
                )
            }
        </Button>
    );
};

const SimpleFormIterator = props => {
    const {
        addButton = <DefaultAddButton />,
        removeButton = <DefaultRemoveButton />,
        addButtonLabel,
        removeButtonLabel,
        basePath,
        children,
        className,
        fields,
        meta: { error, submitFailed },
        record,
        resource,
        source,
        disabled,
        disableAdd,
        disableRemove,
        variant,
        margin,
        TransitionProps,
        defaultValue,
        useBootstrap,
        showIndex,
        hideBorders,
        lineClassName,
        addActionClassName,
        removeActionClassName,
        formClassName,
        inSidebar,
        fieldsFilter,
        removePosition,
        onlyChild,
        showRenderCount,
        subscription,
    } = props;
    const classes = useStyles(props);
    const nodeRef = useRef(null);

    // We need a unique id for each field for a proper enter/exit animation
    // so we keep an internal map between the field position and an auto-increment id
    const nextId = useRef(
        fields && fields.length
            ? fields.length
            : defaultValue
                ? defaultValue.length
                : 0
    );

    // We check whether we have a defaultValue (which must be an array) before checking
    // the fields prop which will always be empty for a new record.
    // Without it, our ids wouldn't match the default value and we would get key warnings
    // on the CssTransition element inside our render method
    const ids = useRef(
        nextId.current > 0 ? Array.from(Array(nextId.current).keys()) : []
    );

    const removeField = index => () => {
        ids.current.splice(index, 1);
        fields.remove(index);
    };

    // Returns a boolean to indicate whether to disable the remove button for certain fields.
    // If disableRemove is a function, then call the function with the current record to
    // determining if the button should be disabled. Otherwise, use a boolean property that
    // enables or disables the button for all of the fields.
    const disableRemoveField = (record, disableRemove) => {
        if (typeof disableRemove === 'boolean') {
            return disableRemove;
        }
        return disableRemove && disableRemove(record);
    };

    const addField = () => {
        ids.current.push(nextId.current++);
        fields.push(undefined);
    };

    // add field and call the onClick event of the button passed as addButton prop
    const handleAddButtonClick = originalOnClickHandler => event => {
        addField();
        if (originalOnClickHandler) {
            originalOnClickHandler(event);
        }
    };

    // remove field and call the onClick event of the button passed as removeButton prop
    const handleRemoveButtonClick = (
        originalOnClickHandler,
        index
    ) => event => {
        removeField(index)();
        if (originalOnClickHandler) {
            originalOnClickHandler(event);
        }
    };

    const records = get(record, source);

    const renderForm = (member, index) => {
        return Children.map(
            children,
            (input, index2) =>
                isValidElement(input) ? (
                    <FormInput
                        basePath={input.props.basePath || basePath}
                        input={cloneElement(input, {
                            source: input.props.source ? `${member}.${input.props.source}` : member,
                            index: input.props.source ? undefined : index2,
                            label: typeof input.props.label === 'undefined' ? input.props.source ? `resources.${resource}.fields.${input.props.source}` : undefined : input.props.label,
                            disabled,
                            formClassName: classnames(input.props.formClassName, useBootstrap && !onlyChild ? 'row' : ''),
                        })}
                        record={(records && records[index]) || {}}
                        resource={resource}
                        variant={variant}
                        margin={margin}
                        useBootstrap={useBootstrap}
                        rowIndex={index}
                        showRenderCount={showRenderCount}
                        subscription={subscription}
                    />
                ) : null
        )
    }

    return fields ? (
        onlyChild ? 
            fields.map((member, index) => {
                return renderForm(member, index)
            }).filter(x => x !== null) :
        <div className={classNames(classes.root, className, inSidebar ? classes.inSidebar : '')}>
            {submitFailed && typeof error !== 'object' && error && (
                <FormHelperText error>
                    <ValidationError error={error} />
                </FormHelperText>
            )}
            <TransitionGroup component={null}>
                {fields.map((member, index) => {
                    if (fields.value && fields.value[index]) {
                        const toShow = fieldsFilter(fields.value[index]);
                        if (!toShow) return null;
                    }

                    return (
                        <CSSTransition
                            nodeRef={nodeRef}
                            key={ids.current[index] || index}
                            timeout={500}
                            classNames="fade"
                            {...TransitionProps}
                        >
                            <div className={classNames(classes.line, lineClassName, hideBorders ? 'no-border' : '')}>
                                {!disabled && removePosition === 'start' && !disableRemoveField((records && records[index]) || {}, disableRemove) && (
                                    <span className={classNames(classes.action, removeActionClassName)}>
                                        {cloneElement(removeButton, {
                                            onClick: handleRemoveButtonClick(
                                                removeButton.props.onClick,
                                                index
                                            ),
                                            className: classNames(
                                                'button-remove',
                                                `button-remove-${source}-${index}`
                                            ),
                                            label: removeButtonLabel,
                                        })}
                                    </span>
                                )}
                                {
                                    showIndex && <Typography variant="body1" className={classes.index}>
                                        {index + 1}
                                    </Typography>
                                }
                                {
                                    <section className={classNames(classes.form, useBootstrap ? 'container-fluid' : '', formClassName)}>
                                        {renderForm(member, index)}
                                        {!disabled && removePosition === 'topEnd' && !disableRemoveField((records && records[index]) || {}, disableRemove) && (
                                            <span className={classNames(classes.action, removeActionClassName, classes.spanTopEnd)}>
                                                {cloneElement(removeButton, {
                                                    onClick: handleRemoveButtonClick(
                                                        removeButton.props.onClick,
                                                        index
                                                    ),
                                                    className: classNames(
                                                        'button-remove',
                                                        `button-remove-${source}-${index}`, 
                                                        classes.buttonTopEnd
                                                    ),
                                                    label: removeButtonLabel,
                                                })}
                                            </span>
                                        )}
                                    </section>
                                }
                                {!disabled && removePosition === 'end' && !disableRemoveField((records && records[index]) || {}, disableRemove) && (
                                    <span className={classNames(classes.action, removeActionClassName)}>
                                        {cloneElement(removeButton, {
                                            onClick: handleRemoveButtonClick(
                                                removeButton.props.onClick,
                                                index
                                            ),
                                            className: classNames(
                                                'button-remove',
                                                `button-remove-${source}-${index}`
                                            ),
                                            label: removeButtonLabel,
                                        })}
                                    </span>
                                )}
                            </div>
                        </CSSTransition>
                    )
                }
                ).filter(x => x !== null)}
            </TransitionGroup>
            {!disabled && !disableAdd && (
                <div className={classNames(classes.line, lineClassName, hideBorders ? 'no-border' : '')}>
                        <span className={classNames(classes.action, 'container-fluid', addActionClassName, removePosition === 'topEnd' ? classes.spanAddFull : '')}>
                        {cloneElement(addButton, {
                            onClick: handleAddButtonClick(
                                addButton.props.onClick
                            ),
                            className: classNames(
                                'button-add',
                                `button-add-${source}`,
                                removePosition === 'topEnd' ? classes.buttonAddFull : ''
                            ),
                            label: addButtonLabel,
                        })}
                    </span>
                </div>
            )}
        </div>
    ) : null;
};

SimpleFormIterator.defaultProps = {
    disableAdd: false,
    disableRemove: false,
    fieldsFilter: () => true,
    onlyChild: false,
    removePosition: 'end'
};

SimpleFormIterator.propTypes = {
    defaultValue: PropTypes.any,
    addButton: PropTypes.element,
    removeButton: PropTypes.element,
    addButtonLabel: PropTypes.string,
    removeButtonLabel: PropTypes.string,
    basePath: PropTypes.string,
    children: PropTypes.node,
    classes: PropTypes.object,
    className: PropTypes.string,
    fields: PropTypes.object,
    meta: PropTypes.object,
    record: PropTypes.object,
    source: PropTypes.string,
    resource: PropTypes.string,
    translate: PropTypes.func,
    disableAdd: PropTypes.bool,
    disableRemove: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
    TransitionProps: PropTypes.shape({}),
    useBootstrap: PropTypes.bool,
    showIndex: PropTypes.bool,
    hideBorders: PropTypes.bool,
    lineClassName: PropTypes.string,
    addActionClassName: PropTypes.string,
    removeActionClassName: PropTypes.string,
    formClassName: PropTypes.string,
    inSidebar: PropTypes.bool,
    fieldsFilter: PropTypes.func,
    onlyChild: PropTypes.bool,
    removePosition: PropTypes.oneOf(['start', 'end', 'topEnd']),
};

export default SimpleFormIterator;
