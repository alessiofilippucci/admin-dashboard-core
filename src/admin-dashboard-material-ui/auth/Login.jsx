import React, {
    useRef,
    useEffect,
    useMemo,
    createElement,
    cloneElement,
} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Card, Avatar, } from '@material-ui/core';
import { createMuiTheme, makeStyles } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import LockIcon from '@material-ui/icons/Lock';
import HomeIcon from '@material-ui/icons/Home';
import HistoryIcon from '@material-ui/icons/History';
import { useHistory } from 'react-router-dom';
import { useCheckAuth } from 'admin-dashboard-core';
import { MenuItemLink, useTranslate } from 'admin-dashboard';

import defaultTheme from '../defaultTheme';
import DefaultNotification from '../layout/Notification';
import DefaultLoginForm from './LoginForm';

const useStyles = makeStyles(
    (theme) => ({
        main: {
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            height: '1px',
            alignItems: 'center',
            justifyContent: 'flex-start',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundImage:
                'radial-gradient(circle at 50% 14em, #313264 0%, #00023b 60%, #00023b 100%)',
        },
        card: {
            minWidth: 300,
            marginTop: '6em',
        },
        avatar: {
            margin: '1em',
            display: 'flex',
            justifyContent: 'center',
        },
        icon: {
            backgroundColor: theme.palette.secondary[500],
        },
        link: {
            marginTop: '2em',
            marginBottom: '1em',
        },
    }),
    { name: 'RaLogin' }
);

const Login = props => {
    const {
        theme,
        title,
        className,
        children,
        notification,
        staticContext,
        backgroundImage,
        routePrefix,
        hasResetPassword,
        ...rest
    } = props;
    const containerRef = useRef();
    const classes = useStyles(props);
    const translate = useTranslate();
    const muiTheme = useMemo(() => createMuiTheme(theme), [theme]);
    let backgroundImageLoaded = false;
    const checkAuth = useCheckAuth();
    const history = useHistory();

    useEffect(() => {
        checkAuth({}, false)
            .then((resp) => {
                if (resp !== "guest") {
                    console.log(resp)
                    // already authenticated, redirect to the admin home page
                    history.push(routePrefix);
                }
            })
            .catch(() => {
                // not authenticated, stay on the login page
            });
    }, [checkAuth, history]);

    const updateBackgroundImage = () => {
        if (!backgroundImageLoaded && containerRef.current) {
            containerRef.current.style.backgroundImage = `url(${backgroundImage})`;
            backgroundImageLoaded = true;
        }
    };

    // Load background image asynchronously to speed up time to interactive
    const lazyLoadBackgroundImage = () => {
        if (backgroundImage) {
            const img = new Image();
            img.onload = updateBackgroundImage;
            img.src = backgroundImage;
        }
    };

    useEffect(() => {
        if (!backgroundImageLoaded) {
            lazyLoadBackgroundImage();
        }
    });

    return (
        <ThemeProvider theme={muiTheme}>
            <div
                className={classnames(classes.main, className)}
                {...rest}
                ref={containerRef}
            >
                <Card className={classes.card}>
                    <div className={classes.avatar}>
                        <Avatar className={classes.icon}>
                            <LockIcon />
                        </Avatar>
                    </div>
                    {
                        cloneElement(children, { routePrefix })
                    }
                    {
                        hasResetPassword &&
                        <MenuItemLink
                            key={"resetPassword"}
                            to={'/resetPassword'}
                            primaryText={translate('ra.auth.forgot_password')}
                            leftIcon={<HistoryIcon />}
                            dense={true}
                            className="justify-content-center"
                            notInSidebar={true}
                        />
                    }
                    <MenuItemLink
                        key={"homepage"}
                        to={'/'}
                        primaryText={translate('ra.auth.back_to_homepage')}
                        leftIcon={<HomeIcon />}
                        dense={true}
                        className="justify-content-center"
                        notInSidebar={true}
                    />
                </Card>
                {notification ? createElement(notification) : null}
            </div>
        </ThemeProvider>
    );
};

Login.propTypes = {
    backgroundImage: PropTypes.string,
    children: PropTypes.node,
    classes: PropTypes.object,
    className: PropTypes.string,
    theme: PropTypes.object,
    staticContext: PropTypes.object,
};

Login.defaultProps = {
    theme: defaultTheme,
    children: <DefaultLoginForm />,
    notification: DefaultNotification,
};

export default Login;
