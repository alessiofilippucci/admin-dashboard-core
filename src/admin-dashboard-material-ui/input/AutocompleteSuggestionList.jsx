import * as React from 'react';
import classnames from 'classnames';
import { Paper, Popper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
    {
        suggestionsContainer: {
            zIndex: 9999,
        },
        suggestionsPaper: {
            maxHeight: '25vh',
            overflowY: 'auto',
        },
    },
    { name: 'RaAutocompleteSuggestionList' }
);

const AutocompleteSuggestionList = props => {
    const {
        children,
        className,
        isOpen,
        menuProps,
        inputEl,
        suggestionsContainerProps,
    } = props;
    const classes = useStyles(props);
    
    if (inputEl === undefined)
        return null;

    return (
        <Popper
            open={isOpen}
            anchorEl={inputEl}
            className={classnames(classes.suggestionsContainer, className)}
            modifiers={{
                flip: {
                    enabled: false,
                },
                preventOverflow: {
                    enabled: false,
                    boundariesElement: 'scrollParent',
                },
            }}
            placement='bottom-start'
            {...suggestionsContainerProps}
        >
            <div {...(isOpen ? menuProps : {})}>
                <Paper
                    square
                    style={{
                        marginTop: 8,
                        minWidth: inputEl ? inputEl.clientWidth : null,
                        maxWidth: inputEl ? '50vw' : null,
                    }}
                    className={classes.suggestionsPaper}
                >
                    {children}
                </Paper>
            </div>
        </Popper>
    );
};

export default AutocompleteSuggestionList;