import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import ActionDelete from '@material-ui/icons/Delete';
import classnames from 'classnames';
import inflection from 'inflection';
import {
    useTranslate,
    useDeleteWithConfirmController,
    useResourceContext,
} from 'admin-dashboard-core';

import Confirm from '../layout/Confirm';
import Button from './Button';

const DeleteWithConfirmButton = props => {
    const {
        basePath,
        classes: classesOverride,
        className,
        confirmTitle = 'ra.message.delete_title',
        confirmContent = 'ra.message.delete_content',
        icon = defaultIcon,
        label = 'ra.action.delete',
        mutationMode,
        onClick,
        record,
        redirect = 'list',
        onSuccess,
        onFailure,
        resource,
        ...rest
    } = props;
    const translate = useTranslate();
    const classes = useStyles(props);
    
    const {
        open,
        loading,
        handleDialogOpen,
        handleDialogClose,
        handleDelete,
    } = useDeleteWithConfirmController({
        resource,
        record,
        redirect,
        basePath,
        mutationMode,
        onClick,
        onSuccess,
        onFailure,
    });
    //const resource = useResourceContext(props);

    return (
        <Fragment>
            <Button
                onClick={handleDialogOpen}
                label={label}
                className={classnames(
                    'ra-delete-button',
                    classes.deleteButton,
                    className
                )}
                key="button"
                {...rest}
            >
                {icon}
            </Button>
            <Confirm
                isOpen={open}
                loading={loading}
                title={confirmTitle}
                content={confirmContent}
                translateOptions={{
                    name: translate(`resources.${resource}.forcedCaseName`, {
                        smart_count: 1,
                        _: inflection.humanize(
                            translate(`resources.${resource}.name`, {
                                smart_count: 1,
                                _: inflection.singularize(resource),
                            }),
                            true
                        ),
                    }),
                    id: record.id,
                }}
                onConfirm={handleDelete}
                onClose={handleDialogClose}
            />
        </Fragment>
    );
};

const defaultIcon = <ActionDelete />;

const useStyles = makeStyles(
    theme => ({
        deleteButton: {
            color: theme.palette.error.main,
            '&:hover': {
                backgroundColor: fade(theme.palette.error.main, 0.12),
                // Reset on mouse devices
                '@media (hover: none)': {
                    backgroundColor: 'transparent',
                },
            },
        },
    }),
    { name: 'RaDeleteWithConfirmButton' }
);

DeleteWithConfirmButton.propTypes = {
    basePath: PropTypes.string,
    classes: PropTypes.object,
    className: PropTypes.string,
    confirmTitle: PropTypes.string,
    confirmContent: PropTypes.string,
    label: PropTypes.string,
    record: PropTypes.any,
    redirect: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool,
        PropTypes.func,
    ]),
    resource: PropTypes.string,
    icon: PropTypes.element,
};

export default DeleteWithConfirmButton;