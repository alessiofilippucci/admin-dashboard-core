import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useInput } from 'admin-dashboard-core';
import * as ReactColor from 'react-color';
import { makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

const useStyles = makeStyles({
    root: {
        marginTop: 8,
        marginBottom: 4,
        position: 'relative',
    },
    color: {
        height: 26,
        borderRadius: 2,
        padding: '0px 5px',
    },
    swatch: {
        width: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderBottom: '1px solid rgba(0, 0, 0, 0.42)',
        padding: '14px 12px 6px',
        background: '#fff',
        borderRadius: 1,
        display: 'inline-block',
        cursor: 'pointer',
    },
    popup: {
        position: 'absolute',
        zIndex: 2,
        width: '100%',
    },
    cover: {
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
    }
});

const classesColors = [
    { value: '#E53935', className: "bg-danger text-white", },
    { value: '#FB6340', className: "bg-warning text-white", },
    { value: '#FFD600', className: "bg-yellow text-dark", },
    { value: '#2DCE89', className: "bg-success text-white", },
    { value: '#11CDEF', className: "bg-info text-white", },
    { value: '#2196F3', className: "bg-primary text-white", },
    { value: '#5E72E4', className: "bg-blue text-white", },
    { value: '#2BFFC6', className: "bg-cyan text-white", },
    { value: '#11CDEF', className: "bg-teal text-white", },
    { value: '#00BDBD', className: "bg-mds-dashboard-lightblue text-white", },
    { value: '#F3A4B5', className: "bg-pink text-dark", },
    { value: '#8965E0', className: "bg-purple text-dark", },
    { value: '#E9ECEF', className: "bg-lighter text-dark", },
    { value: '#212529', className: "bg-dark text-white", },
]

const ColorInput = (props) => {
    const classes = useStyles();
    const {
        label,
        format,
        helperText,
        onBlur,
        onFocus,
        onChange,
        options,
        parse,
        resource,
        source,
        validate,
        rowIndex,
        hideError,
        className,
        picker,
        disabled,
        variant = 'filled',
        margin = 'dense',
        ...rest
    } = props;
    const [show, setShow] = useState(false);
    const [selected, setSelected] = useState({})

    const {
        id,
        input,
        isRequired,
        meta: { error, touched },
    } = useInput({
        format,
        onBlur,
        onChange,
        onFocus,
        parse,
        resource,
        source,
        type: 'text',
        validate,
        ...rest,
    });

    useEffect(() => {
        const item = input.value ? classesColors.find(x => x.className === input.value) || {} : {};
        setSelected(item);
    }, [])

    const handleOnChange = ({ hex }) => {
        const item = classesColors.find(x => x.value === hex.toUpperCase()) || {};
        setSelected(item);
        input.onChange(item.className);
    };

    const handleClick = () => setShow(true);
    const closePicker = () => setShow(false);

    const Picker = ReactColor[`${picker}Picker`];

    return (
        <div className={classes.root}>
            <div className={classes.swatch} onClick={handleClick}>
                <div className={classNames(classes.color, selected.className || '')}>
                    {selected.value && "Testo"}
                </div>
            </div>
            {
                show ?
                    <div className={classes.popup}>
                        <div className={classes.cover} onClick={closePicker}></div>
                        <Picker
                            {...options}
                            color={selected.value}
                            onChange={handleOnChange}
                        />
                    </div>
                    : null
            }
        </div>
    )
}

ColorInput.propTypes = {
    label: PropTypes.string,
    options: PropTypes.object,
    source: PropTypes.string,
    input: PropTypes.object,
    helperText: PropTypes.string,
    meta: PropTypes.shape({
        touched: PropTypes.bool,
        error: PropTypes.string,
    }),
    className: PropTypes.string,
    picker: (props, propName, componentName) =>
        !ReactColor[`${props[propName]}Picker`] &&
        new Error(`Invalid prop \`${propName}\` supplied to \`${componentName}\`.`)
};

ColorInput.defaultProps = {
    picker: 'Github',
    options: {
        width: 137,
        colors: classesColors.map(c => c.value),
        disableAlpha: true
    },
};

export default ColorInput;