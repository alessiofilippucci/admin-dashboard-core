import React from 'react';
import { memo } from 'react';
import PropTypes from 'prop-types';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import get from 'lodash/get';

import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';

import { useInput, } from 'admin-dashboard'; // eslint-disable-line import/no-unresolved

const useSliderStyles = makeStyles({
    label: {
        color: '#999999',
        fontSize: 14,
        paddingLeft: 15
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

const SliderField = memo(
    props => {
        const {
            label,
            min,
            max,
            step,
            marks,
            defaultValue,
            source,
            record,
            disabled = true,
            ...rest
        } = props;
        const classes = useSliderStyles();
        const value = get(record, source);

        return (
            <>
                <Typography gutterBottom className={classes.label}>
                    {label}
                </Typography>
                <MySlider
                    min={min}
                    max={max}
                    step={step}
                    marks={marks}
                    defaultValue={defaultValue}
                    value={value}
                    aria-labelledby="discrete-slider-custom"
                    valueLabelDisplay="auto"
                    className={rest.value === 0 ? 'empty' : ''}
                    {...rest}
                />
            </>
        );
    }
);

SliderField.propTypes = {
    marks: PropTypes.arrayOf(PropTypes.object),
    min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    step: PropTypes.number,
    defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

SliderField.defaultProps = {
    marks: [0, 1, 2],
    min: 0,
    max: 2,
    step: 1,
    defaultValue: 0,
};

SliderField.displayName = 'SliderField';

export default SliderField;