import React, {
    forwardRef,
    cloneElement,
    useCallback,
} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { NavLink } from 'react-router-dom';
import { MenuItem, ListItemIcon, Tooltip, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const NavLinkRef = forwardRef((props, ref) => (
    <NavLink innerRef={ref} {...props} />
));

const useStyles = makeStyles(
    theme => ({
        root: {
            color: theme.palette.text.secondary,
        },
        active: {
            color: theme.palette.text.primary,
        },
        icon: {
            minWidth: theme.spacing(5),
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },
    }),
    { name: 'RaMenuItemLink' }
);

const MenuItemLink = forwardRef((props, ref) => {
    const {
        classes: classesOverride,
        className,
        primaryText,
        title,
        alias,
        leftIcon,
        onClick,
        sidebarIsOpen,
        notInSidebar = false,
        ...rest
    } = props;
    const classes = useStyles(props);

    const handleMenuTap = useCallback(
        e => { onClick && onClick(e); },
        [onClick]
    );
    
    const renderMenuItem = () => {
        const menuItem = <MenuItem
            className={classnames(classes.root, className)}
            activeClassName={classes.active}
            component={NavLinkRef}
            ref={ref}
            {...rest}
            onClick={handleMenuTap}
        >
            {leftIcon && (
                <ListItemIcon className={classes.icon}>
                    {
                        leftIcon.type.muiName === "SvgIcon" ?
                            cloneElement(leftIcon, {
                                titleAccess: alias || primaryText,
                            }) :
                            cloneElement(leftIcon)
                    }
                </ListItemIcon>
            )}
            <Typography variant="inherit" noWrap>
                {alias || primaryText}
            </Typography>
        </MenuItem>;

        return (
            (primaryText.length > 18 || alias) && !notInSidebar ?
                <Tooltip title={title || primaryText} placement="right">
                    {menuItem}
                </Tooltip> :
                menuItem
        )
    };

    if (sidebarIsOpen || notInSidebar) {
        return renderMenuItem();
    }

    return (
        <Tooltip title={primaryText} placement="right">
            {renderMenuItem()}
        </Tooltip>
    );
});

MenuItemLink.propTypes = {
    classes: PropTypes.object,
    className: PropTypes.string,
    leftIcon: PropTypes.element,
    onClick: PropTypes.func,
    primaryText: PropTypes.node,
    staticContext: PropTypes.object,
    to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
    sidebarIsOpen: PropTypes.bool,
    notInSidebar: PropTypes.bool,
};

export default MenuItemLink;
