import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Field, Form } from 'react-final-form';
import Recaptcha from "react-recaptcha";
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslate, useResetPassword, useNotify, useRedirect, useSafeSetState, Utils, } from 'admin-dashboard-core';

const useStyles = makeStyles(
    (theme) => ({
        form: {
            padding: '0 1em 1em 1em',
        },
        input: {
            marginTop: '1em',
        },
        button: {
            width: '100%',
        },
        icon: {
            marginRight: theme.spacing(1),
        },
    }),
    { name: 'RaResetPasswordForm' }
);

const Input = ({
    meta: { touched, error }, // eslint-disable-line react/prop-types
    input: inputProps, // eslint-disable-line react/prop-types
    ...props
}) => (
    <TextField
        error={!!(touched && error)}
        helperText={touched && error}
        {...inputProps}
        {...props}
        fullWidth
    />
);

const ResetPasswordForm = props => {
    const { redirectTo, routePrefix } = props;
    const [loading, setLoading] = useSafeSetState(false);
    const resetPassword = useResetPassword();
    const translate = useTranslate();
    const notify = useNotify();
    const redirect = useRedirect();
    const classes = useStyles(props);
    const [verified, setVerified] = useState(false);
    const captchaKey = Utils.GetENV('CAPTCHA_KEY', null);

    const validate = (values) => {
        const errors = { userName: undefined };

        if (!values.userName) {
            errors.userName = translate('ra.validation.required');
        }
        return errors;
    };

    const submit = values => {
        setLoading(true);
        resetPassword(values)
            .then(() => {
                setLoading(false);
                redirect('/login');
                notify('ra.auth.reset_password_success');
            })
            .catch(error => {
                setLoading(false);
                let errorMessage = 'ra.auth.reset_password_error';

                switch (typeof error) {
                    case 'string':
                        errorMessage = error;
                        break;
                    case 'undefined':
                    case 'object':
                    default:
                        if (error && error.message) {
                            errorMessage = error.message;
                        }
                        break;
                }
                notify(errorMessage, 'warning');
            });
    };

    const recaptchaLoaded = () => {
        setVerified(false);
    }

    const verifyCallback = (response) => {
        if (response && response !== verified)
            setVerified(true);
    }

    return (
        <Form
            onSubmit={submit}
            validate={validate}
            render={({ handleSubmit }) => (
                <form onSubmit={handleSubmit} noValidate>
                    <div className={classes.form}>
                        <div className={classes.input}>
                            <Field
                                id="userName"
                                name="userName"
                                component={Input}
                                label={translate('ra.auth.userName')}
                                disabled={loading}
                            />
                        </div>
                        {
                            captchaKey &&
                            <div className={classes.input}>
                                <Recaptcha
                                    sitekey={captchaKey}
                                    render="explicit"
                                    verifyCallback={verifyCallback}
                                    onloadCallback={recaptchaLoaded}
                                />
                            </div>
                        }
                    </div>
                    <CardActions>
                        <Button
                            variant="contained"
                            type="submit"
                            color="primary"
                            disabled={loading || !verified}
                            className={classes.button}
                        >
                            {loading && (
                                <CircularProgress
                                    className={classes.icon}
                                    size={18}
                                    thickness={2}
                                />
                            )}
                            {translate('ra.auth.reset_password')}
                        </Button>
                    </CardActions>
                </form>
            )}
        />
    );
};

ResetPasswordForm.propTypes = {
    redirectTo: PropTypes.string,
};

export default ResetPasswordForm;
