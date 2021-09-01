import React, { memo, useEffect, useState } from 'react';
import get from 'lodash/get';
import { makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

const useStyles = makeStyles({
    color: {
        height: 26,
        borderRadius: 4,
    },
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

const ColorField = memo(
    ({ className, source, record = {}, emptyText, ...rest }) => {
        const classes = useStyles();
        const [selected, setSelected] = useState({})
        const value = get(record, source);

        useEffect(() => {
            const item = value ? classesColors.find(x => x.className === value) || {} : {};
            setSelected(item);
        }, [])

        return (
            <div className={classNames(classes.color, 'd-flex justify-content-center align-items-center p-2', selected.className || '')}>
                {selected.value && "Testo"}
            </div>
        );
    }
);

export default ColorField;