import * as React from 'react';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import {
    Avatar,
    Card,
    CardActions,
} from '@material-ui/core';
import { createMuiTheme, makeStyles } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import LockIcon from '@material-ui/icons/Lock';
import { useTranslate, useNotify, useGetAuthenticatedUser, useRedirect,
    fetchStart, fetchEnd, required, useDataProvider, SaveButton,Notification, 
    FormWithRedirect, PasswordInput,} from 'admin-dashboard';

import { lightTheme } from './themes';

const useStyles = makeStyles(theme => ({
    main: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundImage:
            'radial-gradient(circle at 50% 14em, #313264 0%, #00023b 60%, #00023b 100%)',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
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
    avatarIcon: {
        backgroundColor: theme.palette.secondary.main,
    },
    icon: {
        marginRight: theme.spacing(1),
    },
    button: {
        width: '100%',
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        padding: '0 1em 1em 1em',
    },
}));


const ChangePassword = () => {
    const [loading, setLoading] = useState(false);
    const translate = useTranslate();
    const classes = useStyles();
    const notify = useNotify();
    const getAuthenticatedUser = useGetAuthenticatedUser();
    const redirect = useRedirect();
    const dataProvider = useDataProvider();
    const dispatch = useDispatch();

    const handleSubmit = async values => {
        setLoading(true);
        dispatch(fetchStart()); 
        const _user = await getAuthenticatedUser();

        return dataProvider
            .update('users/changepassword', { id: _user.id, data: values })
            .then(response => {
                if (response.data) {
                    if (response.data.success) {
                        notify(translate('userprofile.action.updated'));
                        setTimeout(redirect('/'), 1500);
                    }
                    else {
                        notify(translate('userprofile.action.wrong'), 'warning')
                    }
                }
                else {
                    notify('Failed request', 'warning')
                }
                setLoading(false);
                dispatch(fetchEnd());
            })
            .catch(error => {
                notify(translate('userprofile.action.not_updated'), 'warning')
            });
    };

    return (
        <FormWithRedirect
            resource="users/changepassword"
            save={handleSubmit}
            validate={values => {
                const errors = {};
                if (values.newPassword !== values.confirmNewPassword) {
                    errors.confirmNewPassword = "userprofile.validation.confirmNewPassword";
                }
                return errors;
            }}
            render={({
                handleSubmitWithRedirect,
                pristine,
                saving
            }) => (
                <div className={classes.main}>
                    <Card className={classes.card}>
                        <div className={classes.avatar}>
                            <Avatar className={classes.avatarIcon}>
                                <LockIcon />
                            </Avatar>
                        </div>
                        <div className={classes.form}>
                            <div>
                                <PasswordInput label="resources.userprofile.fields.oldPassword" source="oldPassword" validate={required()} fullWidth />
                            </div>
                            <div>
                                <PasswordInput label="resources.userprofile.fields.newPassword" source="newPassword" validate={required()} fullWidth />
                            </div>
                            <div>
                                <PasswordInput label="resources.userprofile.fields.confirmNewPassword" source="confirmNewPassword" validate={required()} fullWidth />
                            </div>
                        </div>
                        <CardActions>
                        <SaveButton
                            handleSubmitWithRedirect={handleSubmitWithRedirect}
                            pristine={pristine}
                            saving={saving}
                            disabled={loading}
                            color="primary"
                            submitOnEnter={true}
                            className={classes.button}
                        />
                        </CardActions>
                    </Card>
                    <Notification />
                </div>
            )}
        />
    );
};

ChangePassword.propTypes = {
    authProvider: PropTypes.func,
    previousRoute: PropTypes.string,
};

// We need to put the ThemeProvider decoration in another component
// Because otherwise the useStyles() hook used in ChangePassword won't get
// the right theme
const ChangePasswordWithTheme = (props) => (
    <ThemeProvider theme={createMuiTheme(lightTheme)}>
        <ChangePassword {...props} />
    </ThemeProvider>
);

export default ChangePasswordWithTheme;
