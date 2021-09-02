import { useCallback } from 'react';
import inflection from 'inflection';

import useVersion from '../useVersion';
import { useCheckMinimumRequiredProps } from '../checkMinimumRequiredProps';
import {
    useNotify,
    useRedirect,
    useRefresh,
} from '../../sideEffect';
import { useGetOne, useUpdate } from '../../dataProvider';
import { useTranslate } from '../../i18n';
import { CRUD_GET_ONE, CRUD_UPDATE } from '../../actions';
import { useSaveModifiers, } from '../saveModifiers';
import { useResourceContext } from '../../core';

/**
 * Prepare data for the Edit view
 *
 * @param {Object} props The props passed to the Edit component.
 *
 * @return {Object} controllerProps Fetched data and callbacks for the Edit view
 *
 * @example
 *
 * import { useEditController } from 'react-admin';
 * import EditView from './EditView';
 *
 * const MyEdit = props => {
 *     const controllerProps = useEditController(props);
 *     return <EditView {...controllerProps} {...props} />;
 * }
 */
export const useEditController = (props) => {
    useCheckMinimumRequiredProps('Edit', ['basePath', 'resource'], props);
    const {
        basePath,
        hasCreate,
        hasEdit,
        hasList,
        hasShow,
        id,
        successMessage,
        // @deprecated use mutationMode: undoable instead
        undoable = true,
        onSuccess,
        onFailure,
        mutationMode = undoable ? 'undoable' : undefined,
        transform,
    } = props;
    const resource = useResourceContext(props);
    const translate = useTranslate();
    const notify = useNotify();
    const redirect = useRedirect();
    const refresh = useRefresh();
    const version = useVersion();

    if (process.env.NODE_ENV !== 'production' && successMessage) {
        console.log(
            '<Edit successMessage> prop is deprecated, use the onSuccess prop instead.'
        );
    }

    const {
        onSuccessRef,
        setOnSuccess,
        onFailureRef,
        setOnFailure,
        transformRef,
        setTransform,
    } = useSaveModifiers({ onSuccess, onFailure, transform });

    const { data: record, loading, loaded } = useGetOne(
        resource,
        id,
        {
            action: CRUD_GET_ONE,
            onFailure: () => {
                notify('ra.notification.item_doesnt_exist', 'warning');
                redirect('list', basePath);
                refresh();
            },
        }
    );

    const resourceName = translate(`resources.${resource}.name`, {
        smart_count: 1,
        _: inflection.humanize(inflection.singularize(resource)),
    });
    const defaultTitle = translate('ra.page.edit', {
        name: `${resourceName}`,
        id,
        record,
    });

    const [update, { loading: saving }] = useUpdate(
        resource,
        id,
        {}, // set by the caller
        record
    );

    const save = useCallback(
        (
            data,
            redirectTo = DefaultRedirect,
            {
                onSuccess: onSuccessFromSave,
                onFailure: onFailureFromSave,
                transform: transformFromSave,
            } = {}
        ) =>
            Promise.resolve(
                transformFromSave
                    ? transformFromSave(data)
                    : transformRef.current
                        ? transformRef.current(data)
                        : data
            ).then(data =>
                update(
                    { payload: { data } },
                    {
                        action: CRUD_UPDATE,
                        onSuccess: onSuccessFromSave
                            ? onSuccessFromSave
                            : onSuccessRef.current
                                ? onSuccessRef.current
                                : () => {
                                    notify(
                                        successMessage ||
                                        'ra.notification.updated',
                                        'info',
                                        {
                                            smart_count: 1,
                                        },
                                        mutationMode === 'undoable'
                                    );
                                    redirect(redirectTo, basePath, data.id, data);
                                },
                        onFailure: onFailureFromSave
                            ? onFailureFromSave
                            : onFailureRef.current
                                ? onFailureRef.current
                                : error => {
                                    notify(
                                        typeof error === 'string'
                                            ? error
                                            : error.message ||
                                            'ra.notification.http_error',
                                        'warning',
                                        {
                                            _:
                                                typeof error === 'string'
                                                    ? error
                                                    : error && error.message
                                                        ? error.message
                                                        : undefined,
                                        }
                                    );
                                    if (
                                        mutationMode === 'undoable' ||
                                        mutationMode === 'pessimistic'
                                    ) {
                                        refresh();
                                    }
                                },
                        mutationMode,
                    }
                )
            ),
        [
            transformRef,
            update,
            onSuccessRef,
            onFailureRef,
            notify,
            successMessage,
            redirect,
            basePath,
            refresh,
            mutationMode,
        ]
    );

    return {
        loading,
        loaded,
        saving,
        defaultTitle,
        hasCreate,
        hasEdit,
        hasList,
        hasShow,
        onSuccessRef,
        onFailureRef,
        transformRef,
        save,
        setOnSuccess,
        setOnFailure,
        setTransform,
        resource,
        basePath,
        record,
        redirect: DefaultRedirect,
        version,
    };
};

const DefaultRedirect = 'list';
