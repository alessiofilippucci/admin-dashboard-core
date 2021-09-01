import * as React from 'react';
import { Children, cloneElement, isValidElement, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslate, useAuthenticatedUser } from 'admin-dashboard-core';

import {
    Tooltip,
    IconButton,
    Menu,
    Button,
    Avatar,
    Typography,
    useMediaQuery,
} from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';

import AccountCircle from '@material-ui/icons/AccountCircle';

const useStyles = makeStyles(
    theme => ({
        user: {},
        userButton: {
            textTransform: 'none',
        },
        avatar: {
            width: theme.spacing(4),
            height: theme.spacing(4),
        },
    }),
    { name: 'RaUserMenu' }
);

const AnchorOrigin = {
    vertical: 'bottom',
    horizontal: 'right',
};

const TransformOrigin = {
    vertical: 'top',
    horizontal: 'right',
};

const UserMenu = props => {
    const classes = useStyles(props);
    const isXSmall = useMediaQuery(theme => theme.breakpoints.down('xs'));
    const [anchorEl, setAnchorEl] = useState(null);
    const translate = useTranslate();
    const { loaded, authenticatedUser } = useAuthenticatedUser();

    const { children, label, icon, logout } = props;
    if (!logout && !children) return null;
    const open = Boolean(anchorEl);

    const handleMenu = event => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    return (
        <div>
            {loaded && authenticatedUser?.displayName ? (
                <>
                    <Button
                        aria-label={label && translate(label, { _: label })}
                        className={classes.userButton}
                        color="inherit"
                        startIcon={
                            authenticatedUser.avatar ? (
                                <Avatar
                                    className={classes.avatar}
                                    src={authenticatedUser.avatar}
                                    alt={authenticatedUser.displayName}
                                />
                            ) : (
                                icon
                            )
                        }
                        onClick={handleMenu}
                    >
                        <>
                            <Typography variant="body1">
                                {authenticatedUser.displayName}
                            </Typography>
                            {authenticatedUser.role && (
                                <Typography variant="body2" className="ml-2">
                                    ({authenticatedUser.role})
                                </Typography>
                            )}
                        </>
                    </Button>
                </>
            ) : (
                <Tooltip title={label && translate(label, { _: label })}>
                    <IconButton
                        aria-label={label && translate(label, { _: label })}
                        aria-owns={open ? 'menu-appbar' : null}
                        aria-haspopup={true}
                        color="inherit"
                        onClick={handleMenu}
                    >
                        {icon}
                    </IconButton>
                </Tooltip>
            )}
            <Menu
                id="menu-appbar"
                disableScrollLock
                anchorEl={anchorEl}
                anchorOrigin={AnchorOrigin}
                transformOrigin={TransformOrigin}
                getContentAnchorEl={null}
                open={open}
                onClose={handleClose}
            >
                {Children.map(children, menuItem =>
                    isValidElement(menuItem)
                        ? cloneElement(menuItem, {
                              onClick: handleClose,
                          })
                        : null
                )}
                {logout}
            </Menu>
        </div>
    );
};

UserMenu.propTypes = {
    children: PropTypes.node,
    label: PropTypes.string.isRequired,
    logout: PropTypes.element,
    icon: PropTypes.node,
};

UserMenu.defaultProps = {
    label: 'ra.auth.user_menu',
    icon: <AccountCircle />,
};

export default UserMenu;
