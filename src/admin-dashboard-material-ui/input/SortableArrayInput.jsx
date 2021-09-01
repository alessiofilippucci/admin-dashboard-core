import React, { useCallback, useRef, useEffect, } from 'react';
import PropTypes from 'prop-types';
import {
    InputLabel,
    FormHelperText,
    FormControl,
    Grid,
    Button,
    Card,
    CardHeader,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Checkbox,
    Divider
} from '@material-ui/core';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import { makeStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import {
    Utils,
    FieldTitle,
    useInput,
    useChoices,
    useTranslate,
} from 'admin-dashboard-core';
import InputHelperText from './InputHelperText';
import Labeled from './Labeled';
import { LinearProgress } from '../layout';

const sanitizeRestProps = ({
    addLabel,
    allowEmpty,
    alwaysOn,
    basePath,
    choices,
    classNamInputWithOptionsPropse,
    componenInputWithOptionsPropst,
    crudGetMInputWithOptionsPropsatching,
    crudGetOInputWithOptionsPropsne,
    defaultValue,
    disableValue,
    filter,
    filterToQuery,
    formClassName,
    initializeForm,
    input,
    isRequired,
    label,
    limitChoicesToValue,
    loaded,
    locale,
    meta,
    onChange,
    options,
    optionValue,
    optionText,
    perPage,
    record,
    reference,
    resource,
    setFilter,
    setPagination,
    setSort,
    sort,
    source,
    textAlign,
    translate,
    translateChoice,
    validation,
    ...rest
}) => rest;

const useStyles = makeStyles(
    theme => ({
        root: {
            margin: 'auto',
        },
        cardHeader: {
            padding: theme.spacing(1, 2),
        },
        containerList: {
            heigth: '100%',
        },
        list: {
            '&isDraggingOver':{
                backgroundColor: theme.palette.primary.main,
            },
            backgroundColor: theme.palette.background.paper,
            overflow: 'auto',
        },
        listItem: {
            '&isDragging': {
                backgroundColor: theme.palette.primary.main,
            },
            backgroundColor: theme.palette.background.paper,
        },
        button: {
            margin: theme.spacing(0, 0.5),
        },
    }),
    { name: 'RaSortableArrayInput' }
);


function not(a, b) {
    return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
    return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a, b) {
    return [...a, ...not(b, a)];
}

const SortableArrayInput = props => {
    const {
        choices = [],
        classes: classesOverride,
        className,
        disableValue,
        format,
        getRecords,
        helperText,
        label,
        loaded,
        loading,
        margin = 'dense',
        onBlur,
        onChange,
        onFocus,
        options,
        optionText,
        optionValue,
        parse,
        resource,
        source,
        translateChoice,
        useCheckboxList = false,
        validate,
        variant = 'filled',
        ...rest
    } = props;
    const classes = useStyles(props);
    const translate = useTranslate();
    const inputLabel = useRef(null);

    const { getChoiceText, getChoiceValue } = useChoices({
        optionText,
        optionValue,
        disableValue,
        translateChoice,
    });

    const {
        input,
        isRequired,
        meta: { error, submitError, touched },
    } = useInput({
        format,
        onBlur,
        onChange,
        onFocus,
        parse,
        resource,
        source,
        validate,
        ...rest,
    });

    const [checked, setChecked] = React.useState([]);
    const [left, setLeft] = React.useState([]);
    const [right, setRight] = React.useState(input.value || []);

    const leftChecked = intersection(checked, left);
    const rightChecked = intersection(checked, right);

    useEffect(() => {
        if (choices)
            setLeft(not(choices.map(x => x.id), right));
    }, [choices])

    const renderMenuItemOption = useCallback(choice => getChoiceText(choice), [
        getChoiceText,
    ]);

    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    const numberOfChecked = (items) => intersection(checked, items).length;

    const handleToggleAll = (items) => () => {
        if (numberOfChecked(items) === items.length) {
            setChecked(not(checked, items));
        } else {
            setChecked(union(checked, items));
        }
    };

    const handleCheckedRight = () => {
        setRight(right.concat(leftChecked));
        setLeft(not(left, leftChecked));
        setChecked(not(checked, leftChecked));
        input.onChange(right.concat(leftChecked));
    };

    const handleCheckedLeft = () => {
        setLeft(left.concat(rightChecked));
        setRight(not(right, rightChecked));
        setChecked(not(checked, rightChecked));
        input.onChange(not(right, rightChecked));
    };

    const onDragEnd = result => {
        const { destination, source, draggableId } = result

        if (!destination || (destination.index === source.index)) return;

        const newValues = Array.from(right)
        newValues.splice(source.index, 1);
        newValues.splice(destination.index, 0, draggableId)
        setRight(newValues.concat(leftChecked));
        setChecked(not(checked, leftChecked));
        input.onChange(newValues)
    }

    if (loading) {
        return (
            <Labeled
                label={label}
                source={source}
                resource={resource}
                className={className}
                isRequired={isRequired}
            >
                <LinearProgress />
            </Labeled>
        );
    }

    const customList = (title, items, isDisabled = false) => (
        <Card>
            <CardHeader
                className={classes.cardHeader}
                avatar={
                    <Checkbox
                        onClick={handleToggleAll(items)}
                        checked={numberOfChecked(items) === items.length && items.length !== 0}
                        indeterminate={numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0}
                        disabled={items.length === 0}
                        inputProps={{ 'aria-label': translate('ra.input.sortable.all_selected') }}
                    />
                }
                title={title}
                subheader={translate('ra.input.sortable.selected', { count: `${numberOfChecked(items)}/${items.length}`})}
            />
            <Divider />
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId={"droppable-array-input"} isDropDisabled={isDisabled}>
                    {(provided, snapshot) => (
                        <List
                            className={classnames(classes.list, snapshot.isDraggingOver ? 'isDraggingOver' : '')}
                            dense
                            component="div"
                            role="list"
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                        >
                            {items.map((item, index) => {
                                const choice = choices.find(choice => getChoiceValue(choice) === item);

                                const text = renderMenuItemOption(choice);
                                const labelId = `transfer-list-all-item-${item}-label`;

                                return (
                                    <Draggable key={item} draggableId={item} index={index} isDragDisabled={isDisabled}>
                                        {(provided, snapshot) => (
                                            <ListItem                                                
                                                role="listitem"
                                                button
                                                onClick={handleToggle(item)}
                                                ref={provided.innerRef}
                                                className={classnames(classes.listItem, snapshot.isDragging ? 'isDraggingOver' : '')}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                            >
                                                <ListItemIcon>
                                                    <Checkbox
                                                        checked={checked.indexOf(item) !== -1}
                                                        tabIndex={-1}
                                                        disableRipple
                                                        inputProps={{ 'aria-labelledby': labelId }}
                                                    />
                                                </ListItemIcon>
                                                <ListItemText id={labelId} primary={text} />
                                            </ListItem>
                                        )}
                                    </Draggable>
                                );
                            })}
                            <ListItem />

                            {provided.placeholder}
                        </List>
                    )}
                </Droppable>
            </DragDropContext>
        </Card>
    );

    return (
        <FormControl
            margin={margin}
            className={classnames(classes.root, className)}
            error={touched && !!error}
            variant={variant}
            {...sanitizeRestProps(rest)}
        >
            <InputLabel
                ref={inputLabel}
                id={`${label}-outlined-label`}
                error={touched && !!(error || submitError)}
            >
                <FieldTitle
                    label={label}
                    source={source}
                    resource={resource}
                    isRequired={isRequired}
                />
            </InputLabel>
            <Grid
                container
                spacing={2}
                justify="center"
                alignItems="flex-start"
                className={classes.root}
            >
                <Grid item xs={12}>
                    <Grid container alignItems="center" justify="center">
                        <Button
                            variant="outlined"
                            size="small"
                            className={classes.button}
                            onClick={handleCheckedRight}
                            disabled={leftChecked.length === 0}
                            aria-label="move selected right"
                        >
                            &gt;
                        </Button>
                        <Button
                            variant="outlined"
                            size="small"
                            className={classes.button}
                            onClick={handleCheckedLeft}
                            disabled={rightChecked.length === 0}
                            aria-label="move selected left"
                        >
                            &lt;
                        </Button>
                    </Grid>
                </Grid>
                <Grid item xs={6} className={classes.containerList}>{customList(translate('ra.input.sortable.choices'), left, true)}</Grid>
                <Grid item xs={6} className={classes.containerList}>{customList(translate('ra.input.sortable.chosen'), right)}</Grid>
            </Grid>
            <FormHelperText error={touched && !!(error || submitError)}>
                <InputHelperText
                    touched={touched}
                    error={error || submitError}
                    helperText={helperText}
                />
            </FormHelperText>
        </FormControl>
    );
};

SortableArrayInput.propTypes = {
    choices: PropTypes.arrayOf(PropTypes.object),
    classes: PropTypes.object,
    className: PropTypes.string,
    children: PropTypes.node,
    label: PropTypes.string,
    options: PropTypes.object,
    optionText: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.func,
        PropTypes.element,
    ]).isRequired,
    optionValue: PropTypes.string.isRequired,
    disableValue: PropTypes.string,
    resource: PropTypes.string,
    source: PropTypes.string,
    translateChoice: PropTypes.bool,
};

SortableArrayInput.defaultProps = {
    options: {},
    optionText: 'name',
    optionValue: 'id',
    disableValue: 'disabled',
    translateChoice: true,
};

export default SortableArrayInput;
