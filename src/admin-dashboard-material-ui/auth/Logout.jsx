import * as React from 'react';
import { useCallback } from 'react';
import PropTypes from 'prop-types';
import { ListItemIcon, MenuItem, useMediaQuery } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import ExitIcon from '@material-ui/icons/PowerSettingsNew';
import classnames from 'classnames';
import { useTranslate, useLogout } from 'admin-dashboard-core';

const useStyles = makeStyles(
    (theme) => ({
        menuItem: {
            color: theme.palette.text.secondary,
        },
        icon: { minWidth: theme.spacing(5), justifyContent: 'center' },
    }),
    { name: 'RaLogout' }
);

const LogoutWithRef = React.forwardRef(function Logout(props, ref) {
    const {
        className,
        redirectTo,
        icon,
        ...rest
    } = props;
    const classes = useStyles(props);
    const isXSmall = useMediaQuery((theme) =>
        theme.breakpoints.down('xs')
    );
    const translate = useTranslate();
    const logout = useLogout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleClick = useCallback(() => logout(null, redirectTo, false), [
        redirectTo,
        logout,
    ]);
    return (
        <MenuItem
            className={classnames('logout', classes.menuItem, className)}
            onClick={handleClick}
            ref={ref}
            component={isXSmall ? 'span' : 'li'}
            {...rest}
        >
            <ListItemIcon className={classes.icon}>
                {icon ? icon : <ExitIcon />}
            </ListItemIcon>
            {translate('ra.auth.logout')}
        </MenuItem>
    );
});

LogoutWithRef.propTypes = {
    className: PropTypes.string,
    redirectTo: PropTypes.string,
    icon: PropTypes.element,
};

export default LogoutWithRef;
