import React, { createElement } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
//import * as ReactIconsAll from "react-icons/all";
import { FaCarAlt, FaTruck, FaMotorcycle, FaRocket, } from "react-icons/fa";

const Icon = props => {
    const classes = useStyles(props);
    const { iconName, size, color, className } = props;

    let icon = null;

    switch (iconName) {
        case 'FaCarAlt':
            icon = <FaCarAlt />;
            break;
        case 'FaTruck':
            icon = <FaTruck />;
            break;
        case 'FaMotorcycle':
            icon = <FaMotorcycle />;
            break;
        case 'FaRocket':
            icon = <FaRocket />;
            break;
    
        default:
            break;
    }

    if (icon) {
        return <div className={classNames(classes.icon, classes[`${size}Icon`], className)} style={{ color: color }}>{icon}</div>;
    }
    else{
        return null;
    }
};

const useStyles = makeStyles(
    (theme) => ({
        icon: {
            color: theme.palette.grey[500],
            padding: theme.spacing(2),
        },
        smallIcon: {
            fontSize: '1.25rem',
        },
        mediumIcon: {
            fontSize: '1.5rem',
        },
        largeIcon: {
            fontSize: '2.25rem',
        },
    }),
    { name: 'RaIcon' }
);

Icon.propTypes = {
    iconName: PropTypes.string,
    size: PropTypes.oneOf(['small', 'medium', 'large']),
    color: PropTypes.string,
};

Icon.defaultProps = {
    name: null,
    size: 'small',
    color: '',
};

export default Icon;