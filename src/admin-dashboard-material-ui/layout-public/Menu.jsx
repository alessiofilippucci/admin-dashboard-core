import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useMediaQuery } from '@material-ui/core';
import LoginIcon from '@material-ui/icons/Lock';
import { makeStyles } from '@material-ui/core/styles';
import classnames from 'classnames';

import {
    Utils,
    MenuItemLink,
    LinearProgress,
    fetchUtils,
    fetchStart,
    fetchEnd,
    useLocale,
} from 'admin-dashboard';

const useStyles = makeStyles(
    theme => ({
        main: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            marginTop: '0.5em',
            [theme.breakpoints.only('xs')]: {
                marginTop: 0,
            },
            [theme.breakpoints.up('md')]: {
                marginTop: '1.5em',
            },
            minHeight: 'calc(100% - 56px)'
        },
    }),
    { name: 'RaMenuPublic' }
);

const Menu = props => {
    const {
        classes: classesOverride,
        className,
        dense,
        onMenuClick,
        ...rest
    } = props;

    const locale = useLocale();
    const dispatch = useDispatch();
    const classes = useStyles(props);
    const isXSmall = useMediaQuery((theme) =>
        theme.breakpoints.down('xs')
    );
    const open = useSelector((state) => state.admin.ui.sidebarOpen);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [menuPages, setMenuPages] = useState([]);

    // Used to force redraw on navigation
    useSelector((state) => state.router.location.pathname);

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
        isXSmall ?
            <div className={classnames(classes.main, className)} {...rest}>
                {
                    menuPages.map(menuPage => {
                        return (
                            <MenuItemLink
                                key={menuPage.id}
                                to={`/${menuPage.isFrontPage ? '' : menuPage.id}`}
                                primaryText={menuPage.isFrontPage ? 'HOME' : menuPage.title}
                                leftIcon={menuPage.icon ? <menuPage.icon /> : null}
                                onClick={onMenuClick}
                                dense={dense}
                                sidebarIsOpen={open}
                            />
                        )
                    })
                }
                <MenuItemLink
                    key={"login"}
                    to={'/login'}
                    primaryText={'Area Privata'}
                    leftIcon={<LoginIcon />}
                    onClick={onMenuClick}
                    dense={dense}
                    sidebarIsOpen={open}
                    style={{ marginTop: 'auto' }}
                />
            </div> :
            null
    );
};

Menu.propTypes = {
    classes: PropTypes.object,
    className: PropTypes.string,
    dense: PropTypes.bool,
    onMenuClick: PropTypes.func,
};

Menu.defaultProps = {
    onMenuClick: () => null,
};

export default Menu;
