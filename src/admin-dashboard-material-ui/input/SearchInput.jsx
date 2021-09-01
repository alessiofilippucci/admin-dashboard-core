import * as React from 'react';
import PropTypes from 'prop-types';
import SearchIcon from '@material-ui/icons/Search';
import { InputAdornment } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslate } from 'admin-dashboard-core';

import TextInput from './TextInput';

const useStyles = makeStyles(
    {
        input: {
            marginTop: 32,
        },
    },
    { name: 'RaSearchInput' }
);

const SearchInput = props => {
    const { classes: classesOverride, ...rest } = props;
    const translate = useTranslate();
    const classes = useStyles(props);
    if (props.label) {
        throw new Error(
            "<SearchInput> isn't designed to be used with a label prop. Use <TextInput> if you need a label."
        );
    }

    return (
        <TextInput
            hiddenLabel
            label=""
            resettable
            placeholder={translate('ra.action.search')}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <SearchIcon color="disabled" />
                    </InputAdornment>
                ),
            }}
            className={classes.input}
            {...rest}
        />
    );
};

SearchInput.propTypes = {
    classes: PropTypes.object,
};

export default SearchInput;
