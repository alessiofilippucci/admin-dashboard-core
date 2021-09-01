import React, {
    Children,
    cloneElement,
    isValidElement,
} from 'react';
import PropTypes from 'prop-types';
import { shallowEqual } from 'react-redux';
import { useDropzone, } from 'react-dropzone';
import { makeStyles } from '@material-ui/core/styles';
import FormHelperText from '@material-ui/core/FormHelperText';
import classnames from 'classnames';
import { Utils, useInput, useNotify, useTranslate, } from 'admin-dashboard-core';



import Labeled from './Labeled';
import FileInputPreview from './FileInputPreview';
import sanitizeInputRestProps from './sanitizeInputRestProps';
import InputHelperText from './InputHelperText';

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
            maxWidth: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
        },
        removeButton: {},
    }),
    { name: 'RaFileInput' }
);

const FileInput = props => {
    const {
        accept,
        children,
        className,
        classes: classesOverride,
        format,
        helperText,
        label,
        labelMultiple = 'ra.input.file.upload_several',
        labelSingle = 'ra.input.file.upload_single',
        noLabel,
        maxSize,
        minSize,
        multiple = false,
        options: {
            inputProps: inputPropsOptions,
            ...options
        } = {},
        parse,
        placeholder,
        dropZoneClassName,
        resource,
        source,
        validate,
        ...rest
    } = props;
    const translate = useTranslate();
    const notify = useNotify();
    const classes = useStyles(props);

    // turn a browser dropped file structure into expected structure
    const transformFile = file => {
        if (!(file instanceof File)) {
            return file;
        }

        const { source, title } = (Children.only(children)).props;

        const preview = URL.createObjectURL(file);
        const transformedFile = {
            rawFile: file,
            [source]: preview,
        };

        if (title) {
            transformedFile[title] = file.name;
        }

        return transformedFile;
    };

    const transformFiles = (files) => {
        if (!files) {
            return multiple ? [] : null;
        }

        if (Array.isArray(files)) {
            return files.map(transformFile);
        }

        return transformFile(files);
    };

    const {
        id,
        input: { onChange, value, ...inputProps },
        meta,
        isRequired,
    } = useInput({
        format: format || transformFiles,
        parse: parse || transformFiles,
        source,
        type: 'file',
        validate,
        ...rest,
    });
    const { touched, error } = meta;
    const files = value ? (Array.isArray(value) ? value : [value]) : [];
    
    const onDrop = (newFiles, rejectedFiles, event) => {
        const updatedFiles = multiple ? [...files, ...newFiles] : (rejectedFiles.length > 0 ? [...files] : [...newFiles]);

        if (rejectedFiles.length > 0) {
            rejectedFiles.forEach(rejectedFile => {
                const { errors = [] } = rejectedFile;
                if (errors.length > 0) {
                    errors.forEach(({ code, message }) => {
                        let params = {};
                        let errorMessage;

                        switch (code) {
                            case 'file-invalid-type':
                                params.messageSuffix = accept;
                                params.smart_count = accept.split(",").length;
                                break;
                            case 'file-too-large':
                                params.maxSize = Utils.FormatBytes(maxSize);
                                break;
                            case 'file-too-small':
                                params.minSize = Utils.FormatBytes(minSize);
                                break;
                            case 'too-many-files':
                                break;
                            default:
                                params = null;
                                break;
                        }
                        console.log(params)
                        errorMessage = params ? translate(`ra.validation.dropZone.${code}`, params) : message;

                        notify(errorMessage, 'warning');
                    });
                }
            });
        }

        if (multiple) { onChange(updatedFiles); } else { onChange(updatedFiles[0]); }
        if (options.onDrop) { options.onDrop(newFiles, rejectedFiles, event); }
    };

    const onRemove = file => () => {
        if (multiple) {
            const filteredFiles = files.filter(stateFile => !shallowEqual(stateFile, file));
            onChange(filteredFiles);
        } else { onChange(null); }
        if (options.onRemove) { options.onRemove(file); }
    };

    const childrenElement = children && isValidElement(Children.only(children)) ? (Children.only(children)) : undefined;

    const { getRootProps, getInputProps } = useDropzone({
        ...options,
        accept,
        maxSize,
        minSize,
        multiple,
        onDrop,
    });

    const dropZoneContent = (
        <>
            <input
                id={id}
                {...getInputProps({
                    ...inputProps,
                    ...inputPropsOptions,
                })}
            />
            {
                placeholder ?
                    cloneElement(placeholder, {
                        hasFiles: files.length > 0,
                    }) :
                    multiple ?
                        (<p>{translate(labelMultiple)}</p>) :
                        (<p>{translate(labelSingle)}</p>)
            }
        </>
    );
    
    const dropZoneArea = (
        <>
            <div
                data-testid="dropzone"
                className={classnames(dropZoneClassName ? dropZoneClassName : classes.dropZone, files.length > 0 ? 'withfiles' : '' )}
                {...getRootProps()}
            >
                {dropZoneContent}
            </div>
            <FormHelperText>
                <InputHelperText
                    touched={touched}
                    error={error}
                    helperText={helperText}
                />
            </FormHelperText>
            {children && (
                <div className="previews">
                    {files.map((file, index) => (
                        <FileInputPreview
                            key={index}
                            file={file}
                            onRemove={onRemove(file)}
                            className={classnames(classes.removeButton, "d-flex align-items-center")}
                        >
                            {cloneElement(childrenElement, {
                                record: file,
                                className: classes.preview,
                            })}
                        </FileInputPreview>
                    ))}
                </div>
            )}
        </>
    )

    if (noLabel) {
        return (dropZoneArea)
    }
    else {
        return (
            <Labeled
                id={id}
                label={label}
                className={classnames(classes.root, className)}
                source={source}
                resource={resource}
                isRequired={isRequired}
                meta={meta}
                {...sanitizeInputRestProps(rest)}
            >
                {dropZoneArea}
            </Labeled>
        );
    }
};

FileInput.propTypes = {
    accept: PropTypes.string,
    children: PropTypes.element,
    classes: PropTypes.object,
    className: PropTypes.string,
    id: PropTypes.string,
    isRequired: PropTypes.bool,
    label: PropTypes.string,
    labelMultiple: PropTypes.string,
    labelSingle: PropTypes.string,
    noLabel: PropTypes.bool,
    maxSize: PropTypes.number,
    minSize: PropTypes.number,
    multiple: PropTypes.bool,
    options: PropTypes.object,
    resource: PropTypes.string,
    source: PropTypes.string,
    placeholder: PropTypes.node,
    dropZoneClassName: PropTypes.string,
};

FileInput.defaultProps = {
    maxSize: parseInt(Utils.GetENV('MAX_FILEUPLOAD_SIZE', 5242880))
}

export default FileInput;
