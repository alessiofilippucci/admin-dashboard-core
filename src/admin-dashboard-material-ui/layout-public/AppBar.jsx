import React, { Children, useEffect, useState, cloneElement, memo } from "react";
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { Link as RouterLink } from "react-router-dom";
import classNames from 'classnames';

import {
    AppBar as MuiAppBar,
    IconButton,
    Toolbar,
    Tooltip,
    Typography,
    useMediaQuery,
    Link,
    MenuItem,
} from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';

import {
    Utils,
    HideOnScroll,
    Error,
    LinearProgress,
    useNotify,
    useTranslate,
    fetchUtils,
    fetchStart,
    fetchEnd,
    useLocale,
    toggleSidebar,
} from 'admin-dashboard';

const useStyles = makeStyles(
    theme => ({
        toolbar: {
            paddingRight: 24,
        },
        menuButton: {
            marginLeft: '0.5em',
            marginRight: '0.5em',
        },
        menuButtonIconClosed: {
            transition: theme.transitions.create(['transform'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            transform: 'rotate(0deg)',
        },
        menuButtonIconOpen: {
            transition: theme.transitions.create(['transform'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            transform: 'rotate(180deg)',
        },
        title: {
            flex: 1,
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textAlign: 'center',
        },
    }),
    { name: 'RaAppBarPublic' }
);

const AppBar = (props) => {
    const {
        children,
        classes: classesOverride,
        className,
        color = 'secondary',
        open,
        title,
        ...rest
    } = props;
    const classes = useStyles(props);
    const locale = useLocale();
    const dispatch = useDispatch();
    const notify = useNotify();
    const isXSmall = useMediaQuery(theme => theme.breakpoints.down('xs'));
    const translate = useTranslate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [menuPages, setMenuPages] = useState([]);

    useEffect(() => {
        let mounted = true;
        dispatch(fetchStart()); // start the global loading indicator 

        const headers = new Headers({ Accept: 'application/json' });
        headers.set("Content-Language", locale);

        const url = `${Utils.GetENV('API_ENDPOINT')}/public/menu`;
        const options = { method: 'GET', headers };

        fetchUtils.fetchJson(url, options)
            .then((response) => { const { json } = response; if (mounted) setMenuPages(json.publicPages); })
            .catch(setError)
            .finally(() => {
                if (mounted) setLoading(false);
                dispatch(fetchEnd());
            });

        return function cleanup() {
            mounted = false
        }
    }, []);

    if (loading) { return <LinearProgress />; }

    return (
        <HideOnScroll>
            <MuiAppBar className={className} color={color} {...rest}>
                <Toolbar
                    disableGutters
                    variant={isXSmall ? 'regular' : 'dense'}
                    className={classes.toolbar}
                >
                    {
                        isXSmall ?
                            <>
                                <Tooltip
                                    title={translate(
                                        open
                                            ? 'ra.action.close_menu'
                                            : 'ra.action.open_menu',
                                        {
                                            _: 'Open/Close menu',
                                        }
                                    )}
                                    enterDelay={500}
                                >
                                    <IconButton
                                        color="inherit"
                                        onClick={() => dispatch(toggleSidebar())}
                                        className={classNames(classes.menuButton)}
                                    >
                                        <MenuIcon
                                            classes={{
                                                root: open
                                                    ? classes.menuButtonIconOpen
                                                    : classes.menuButtonIconClosed,
                                            }}
                                        />
                                    </IconButton>
                                </Tooltip>
                                <Typography variant="h6" color="inherit" className={classes.title} id="react-admin-title">
                                    {title || "App Title"}
                                </Typography>
                                <Tooltip title="">
                                    <IconButton className={classNames(classes.menuButton)} />
                                </Tooltip>
                            </> :
                            <>
                                {menuPages.length > 0 ?
                                    menuPages.map(menuPage => {
                                        return (
                                            <Link
                                                {...{
                                                    component: RouterLink,
                                                    to: `/${menuPage.isFrontPage ? '' : menuPage.id}`,
                                                    color: "inherit",
                                                    style: { textDecoration: "none" },
                                                    key: menuPage.id,
                                                }}
                                            >
                                                <MenuItem>{menuPage.isFrontPage ? 'HOME' : menuPage.title}</MenuItem>
                                            </Link>
                                        )
                                    }) :
                                    <Typography variant="h6" color="inherit" className={classes.title} id="react-admin-title">
                                        {title || "App Title"}
                                    </Typography>
                                }
                                <Link
                                    {...{
                                        component: RouterLink,
                                        to: `/login`,
                                        color: "inherit",
                                        style: { textDecoration: "none", marginLeft: 'auto' },
                                        key: "login",
                                    }}
                                >
                                    <MenuItem>Area Privata</MenuItem>
                                </Link>
                            </>
                    }
                </Toolbar>
            </MuiAppBar>
        </HideOnScroll>
    );
};

AppBar.propTypes = {
    children: PropTypes.node,
    classes: PropTypes.object,
    className: PropTypes.string,
    color: PropTypes.oneOf([
        'default',
        'inherit',
        'primary',
        'secondary',
        'transparent',
    ]),
    open: PropTypes.bool,
};

AppBar.defaultProps = {
};

export default memo(AppBar);