import * as React from 'react';
import { useField } from 'react-final-form';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import { useChoices } from 'admin-dashboard-core';
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
    root: {
        flexBasis: 0,
        flexGrow: 1,
        maxWidth: '100%',
        paddingLeft: 15,
        paddingRight: 15,
    },
    label: {
        width: '100%',
        height: '100%'
    },
}));


const RadioButtonGroupInputItem = ({
    choice,
    optionText,
    optionValue,
    source,
    translateChoice,
    onChange,
    itemAsCol,
    hideInput,
}) => {
    const classes = useStyles();
    const { getChoiceText, getChoiceValue } = useChoices({
        optionText,
        optionValue,
        translateChoice,
    });
    const label = getChoiceText(choice);
    const value = getChoiceValue(choice);
    const {
        input: { type, ...inputProps },
    } = useField(source, {
        type: 'radio',
        value,
    });

    const nodeId = `${source}_${value}`;

    return (
        <FormControlLabel
            label={label}
            htmlFor={nodeId}
            classes={itemAsCol ? classes : {}}
            control={
                <Radio
                    id={nodeId}
                    color="primary"
                    {...inputProps}
                    className={hideInput ? 'd-none' : ''}
                    onChange={(_, isActive) => isActive && onChange(value)}
                />
            }
        />
    );
};

export default RadioButtonGroupInputItem;
