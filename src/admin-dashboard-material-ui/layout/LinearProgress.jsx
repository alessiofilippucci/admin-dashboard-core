import * as React from 'react';
import Progress from '@material-ui/core/LinearProgress';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import classnames from 'classnames';

const useStyles = makeStyles(
    theme => ({
        root: {
            margin: `${theme.spacing(3.5)}px 0`,
            width: `${theme.spacing(20)}px`,
        },
    }),
    { name: 'RaLinearProgress' }
);

const LinearProgress = props => {
    const { classes: classesOverride, className, fullWidth, ...rest } = props;
    const classes = useStyles(props);
    return (
        <Progress className={classnames(classes.root, className, fullWidth ? 'w-100' : '')} {...rest} />
    );
};
LinearProgress.propTypes = {
    classes: PropTypes.object,
    className: PropTypes.string,
};
// wat? TypeScript looses the displayName if we don't set it explicitly
LinearProgress.displayName = 'LinearProgress';

export default LinearProgress;
