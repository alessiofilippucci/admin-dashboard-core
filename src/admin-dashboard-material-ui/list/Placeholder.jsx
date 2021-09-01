import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import classnames from 'classnames';

const useStyles = makeStyles(
    theme => ({
        root: {
            backgroundColor: theme.palette.grey[300],
            display: 'flex',
        },
    }),
    { name: 'RaPlaceholder' }
);

const Placeholder = props => {
    const classes = useStyles(props);
    return (
        <div className={classnames(classes.root, props.className)}>&nbsp;</div>
    );
};

export default Placeholder;
