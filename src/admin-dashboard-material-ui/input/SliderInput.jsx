import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';

import { useInput, } from 'admin-dashboard'; // eslint-disable-line import/no-unresolved

const useSliderStyles = makeStyles({
    label: {
        color: '#999999',
        fontSize: 14,
    }
});

const MySlider = withStyles({
    root: {
        color: '#009901',
        '&.empty .MuiSlider-thumb': {
            backgroundColor: '#747475',
            border: '2px solid #747475',
        }
    },
    thumb: {
        height: 20,
        width: 20,
        backgroundColor: 'currentColor',
        border: '2px solid currentColor',
        marginTop: -8,
        marginLeft: -10,
        '&:focus, &:hover, &$active': {
            boxShadow: 'inherit',
        },
    },
    active: {},
    valueLabel: {
        left: 'calc(-50%)',
    },
    track: {
        borderRadius: 4,
    },
    rail: {
        backgroundColor: '#cccccc',
        borderRadius: 4,
    },
    mark: {
        width: 4
    },
})(Slider);

const SliderInput = props => {
    const {
        basePath,
        formClassName,
        fullWidth,
        label,
        min,
        max,
        step,
        marks,
        defaultValue,
        rowIndex,
        showRenderCount,
        labelDisplay,
        valuePosition,
        valueColNum,
        ...rest
    } = props;
    const classes = useSliderStyles();
    const {
        input: { name, onChange, value },
        meta: { touched, error },
        isRequired,
    } = useInput(rest);
    const [tempValue, setTempValue] = useState(value || defaultValue);

    const handleChange = (event, newValue) => {
        setTempValue(newValue);
    };

    return (
        <>
            <Typography gutterBottom className={classes.label}>
                {label}
            </Typography>
            <Grid container spacing={2}>
                {
                    valuePosition === 'start' &&
                    <Grid item>
                        <Typography>
                            {value}
                        </Typography>
                    </Grid>
                }
                <Grid item xs className="pl-0">
                    <MySlider
                        name={name}
                        min={min}
                        max={max}
                        step={step}
                        marks={marks}
                        defaultValue={value || defaultValue}
                        value={tempValue}
                        onChange={handleChange}
                        onChangeCommitted={(event, value) => {
                            event.target.value = value;
                            onChange(event)
                        }}
                        valueLabelDisplay={labelDisplay}
                        className={rest.value === 0 ? 'empty' : ''}
                        {...rest}
                    />
                </Grid>
                {
                    valuePosition === 'end' &&
                    <Grid item xs={valueColNum} className="text-right pr-0">
                        <Typography>
                            {value || defaultValue}
                        </Typography>
                    </Grid>
                }
            </Grid>
        </>
    );
};

SliderInput.propTypes = {
    marks: PropTypes.oneOfType([PropTypes.bool, PropTypes.arrayOf(PropTypes.object)]),
    min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    step: PropTypes.number,
    defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    labelDisplay: PropTypes.oneOf(['on', 'auto', 'off']),
    valuePosition: PropTypes.oneOf(['start', 'end', 'none']),
    valueColNum: PropTypes.number,
};

SliderInput.defaultProps = {
    marks: false,
    min: 0,
    max: 2,
    step: 1,
    defaultValue: 0,
    labelDisplay: 'auto',
    valuePosition: 'none',
    valueColNum: 2,
};

export default SliderInput;