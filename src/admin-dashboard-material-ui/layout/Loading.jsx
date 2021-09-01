import * as React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import { CircularProgress, Fab, Typography } from '@material-ui/core';
import ExtensionIcon from '@material-ui/icons/Extension';
import { green } from '@material-ui/core/colors';
import { useTranslate } from 'admin-dashboard-core';

const useStyles = makeStyles(
    theme => ({
        container: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            [theme.breakpoints.up('md')]: {
                height: '100%',
            },
            [theme.breakpoints.down('lg')]: {
                height: '100vh',
                marginTop: '-3em',
            },
        },
        fullscreen:{
            '& $message':{
                backgroundColor: '#fff',
                minWidth: '20vw',
                margin: 'auto',
                opacity: 1,
                borderRadius: '0.5em',
            },
            position: 'fixed',
            zIndex: 999999999,
            left: 0,
            top: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: '#0000008c',
        },
        icon: {
            width: '9em',
            height: '9em',
        },
        message: {
            textAlign: 'center',
            fontFamily: 'Roboto, sans-serif',
            padding: theme.spacing(2),
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: 0.8,
            margin: '0 1em',
            color: theme.palette.type === 'light' ? 'inherit' : theme.palette.text.primary,
        },
        wrapper: {
            width: theme.spacing(7),
            margin: theme.spacing(4),
            position: 'relative',
        },
        fabProgress: {
            color: green[600],
            position: 'absolute',
            top: -6,
            left: -6,
            zIndex: 1,
        },
    }),
    { name: 'RaLoading' }
);

const Loading = props => {
    const {
        className,
        loadingPrimary = 'ra.page.loading',
        loadingSecondary = 'ra.message.loading',
        fullscreen,
    } = props;
    const classes = useStyles(props);
    const translate = useTranslate();
    return (
        <div className={classnames(classes.container, className, fullscreen ? classes.fullscreen : '')}>
            <div className={classes.message}>
                <div className={classes.wrapper}>
                    <Fab aria-label={translate(loadingPrimary)} color="primary">
                        <ExtensionIcon />
                    </Fab>
                    <CircularProgress size={68} className={classnames(classes.fabProgress, classes.icon)} />
                </div>
                <h1>{translate(loadingPrimary)}</h1>
                {loadingSecondary && <div>{translate(loadingSecondary)}.</div>}
            </div>
        </div>
    );
};

Loading.propTypes = {
    classes: PropTypes.object,
    className: PropTypes.string,
    loadingPrimary: PropTypes.string,
    loadingSecondary: PropTypes.string,
    fullscreen: PropTypes.bool,
};

Loading.defaultProps = {
    loadingPrimary: 'ra.page.loading',
    loadingSecondary: 'ra.message.loading',
    fullscreen: false,
};

export default Loading;
