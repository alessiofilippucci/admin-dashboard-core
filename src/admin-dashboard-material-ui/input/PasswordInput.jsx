import * as React from 'react';
import { useState } from 'react';
import { useTranslate } from 'admin-dashboard-core';
import { InputAdornment, IconButton } from '@material-ui/core';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

import TextInput from './TextInput';

const PasswordInput = ({
    initiallyVisible = false,
    ...props
}) => {
    const [visible, setVisible] = useState(initiallyVisible);
    const translate = useTranslate();

    const handleClick = () => {
        setVisible(!visible);
    };

    return (
        <TextInput
            {...props}
            type={visible ? 'text' : 'password'}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton
                            aria-label={translate(
                                visible
                                    ? 'ra.input.password.toggle_visible'
                                    : 'ra.input.password.toggle_hidden'
                            )}
                            onClick={handleClick}
                        >
                            {visible ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                    </InputAdornment>
                ),
            }}
        />
    );
};

export default PasswordInput;
