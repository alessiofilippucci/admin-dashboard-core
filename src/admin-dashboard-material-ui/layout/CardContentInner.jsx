import * as React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
    theme => ({
        root: {
            paddingTop: 0,
            paddingBottom: 0,
            '&:first-child': {
                paddingTop: 22,
            },
            paddingLeft: 15,
            paddingRight: 15,
            '&:last-child': {
                paddingBottom: 22,
                [theme.breakpoints.only('xs')]: {
                    paddingBottom: 70,
                },
            },
        },
    }),
    { name: 'RaCardContentInner' }
);

const CardContentInner = (props) => {
    const { className, children } = props;
    const classes = useStyles(props);
    return (
        <CardContent className={classnames(classes.root, className)}>
            {children}
        </CardContent>
    );
};

CardContentInner.propTypes = {
    className: PropTypes.string,
    classes: PropTypes.object,
    children: PropTypes.node,
};

export default CardContentInner;
