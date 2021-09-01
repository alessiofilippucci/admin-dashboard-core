import React, {
    useRef,
    useEffect,
    useMemo,
    createElement,
} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Card } from '@material-ui/core';
import { createMuiTheme, makeStyles } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { useHistory } from 'react-router-dom';
import { useCheckAuth } from 'admin-dashboard-core';

import defaultTheme from '../defaultTheme';
import DefaultNotification from '../layout/Notification';

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
    }),
    { name: 'RaHomePage' }
);

const HomePage = props => {
    const {
        theme,
        title,
        className,
        children,
        notification,
        staticContext,
        backgroundImage,
        ...rest
    } = props;
    const containerRef = useRef();
    const classes = useStyles(props);
    const muiTheme = useMemo(() => createMuiTheme(theme), [theme]);
    let backgroundImageLoaded = false;
    const checkAuth = useCheckAuth();
    const history = useHistory();

    useEffect(() => {
        checkAuth({}, false)
            .then(() => {
                // already authenticated, redirect to the home page
                history.push('/');
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
                    {children}
                </Card>
                {notification ? createElement(notification) : null}
            </div>
        </ThemeProvider>
    );
};

HomePage.propTypes = {
    backgroundImage: PropTypes.string,
    children: PropTypes.node,
    classes: PropTypes.object,
    className: PropTypes.string,
    theme: PropTypes.object,
    staticContext: PropTypes.object,
};

HomePage.defaultProps = {
    theme: defaultTheme,
    notification: DefaultNotification,
};

export default HomePage;
