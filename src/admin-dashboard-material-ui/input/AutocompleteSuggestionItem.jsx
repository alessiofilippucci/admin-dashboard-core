import * as React from 'react';
import { isValidElement, cloneElement } from 'react';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import { MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import classnames from 'classnames';

const useStyles = makeStyles(
    theme => ({
        root: {
            fontWeight: 400,
            whiteSpace: 'break-spaces'
        },
        selected: {
            fontWeight: 500,
        },
        suggestion: {
            display: 'block',
            fontFamily: theme.typography.fontFamily,
            minHeight: 24,
        },
        suggestionText: { fontWeight: 300 },
        highlightedSuggestionText: { fontWeight: 500 },
    }),
    { name: 'RaAutocompleteSuggestionItem' }
);

const AutocompleteSuggestionItem = props => {
    const {
        suggestion,
        index,
        highlightedIndex,
        isSelected,
        filterValue,
        classes: classesOverride,
        getSuggestionText,
        onMouseMove,
        ...rest
    } = props;
    const classes = useStyles(props);
    const isHighlighted = highlightedIndex === index;
    const suggestionText = getSuggestionText(suggestion);
    let matches;
    let parts;

    if (!isValidElement(suggestionText)) {
        matches = match(suggestionText, filterValue);
        parts = parse(suggestionText, matches);
    }

    return (
        <MenuItem
            key={suggestionText}
            selected={isHighlighted}
            className={classnames(classes.root, {
                [classes.selected]: isSelected,
            })}
            {...rest}
        >
            {isValidElement(suggestionText) ? (
                cloneElement(suggestionText, { filterValue })
            ) : (
                    <div className={classes.suggestion}>
                        {parts.map((part, index) => {
                            return part.highlight ? (
                                <span
                                    key={index}
                                    className={classes.highlightedSuggestionText}
                                >
                                    {part.text}
                                </span>
                            ) : (
                                    <strong
                                        key={index}
                                        className={classes.suggestionText}
                                    >
                                        {part.text}
                                    </strong>
                                );
                        })}
                    </div>
                )}
        </MenuItem>
    );
};

export default AutocompleteSuggestionItem;
