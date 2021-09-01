import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import FileInput from './FileInput';

const useStyles = makeStyles(
    theme => ({
        root: { width: '100%' },
        dropZone: {
            borderRadius: 10,
            cursor: 'pointer',
            padding: theme.spacing(1),
            textAlign: 'center',
            background: '#e4e4e4',
            color: theme.palette.getContrastText('#e4e4e4'),
            '& p': {
                margin: 0,
            }
        },
        preview: {
            display: 'inline-block',
        },
        removeButton: {
            display: 'inline-block',
            position: 'relative',
            float: 'left',
            '& button': {
                position: 'absolute',
                top: theme.spacing(1),
                right: theme.spacing(1),
                minWidth: theme.spacing(2),
                opacity: 0,
            },
            '&:hover button': {
                opacity: 1,
            },
        },
    }),
    { name: 'RaImageInput' }
);

const ImageInput = (props) => {
    const classes = useStyles(props);

    return (
        <FileInput
            labelMultiple="ra.input.image.upload_several"
            labelSingle="ra.input.image.upload_single"
            classes={classes}
            {...props}
        />
    );
};

export default ImageInput;
