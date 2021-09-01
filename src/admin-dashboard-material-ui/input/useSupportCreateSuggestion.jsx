import * as React from 'react';
import {
    createContext,
    isValidElement,
    ReactElement,
    useContext,
    useState,
} from 'react';
import { useTranslate } from 'admin-dashboard-core';

/**
 * This hook provides support for suggestion creation in inputs which have choices.
 *
 * @param options The hook option
 * @param {ReactElement} options.create A react element which will be rendered when users choose to create a new choice. This component must call the `useCreateSuggestionContext` hook which provides `onCancel`, `onCreate` and `filter`. See the examples.
 * @param {String} options.createLabel Optional. The label for the choice item allowing users to create a new choice. Can be a translation key. Defaults to `ra.action.create`.
 * @param {String} options.createItemLabel Optional. The label for the choice item allowing users to create a new choice when they already entered a filter. Can be a translation key. The translation will receive an `item` parameter. Defaults to `ra.action.create_item`.
 * @param {any} options.createValue Optional. The value for the choice item allowing users to create a new choice. Defaults to `@@ra-create`.
 * @param {String} options.filter Optional. The filter users may have already entered. Useful for autocomplete inputs for example.
 * @param {OnCreateHandler} options.onCreate Optional. A function which will be called when users choose to create a new choice, if the `create` option wasn't provided.
 * @param handleChange: a function to pass to the input. Receives the same parameter as the original event handler and an additional newItem parameter if a new item was create.
 * @returns {UseSupportCreateValue} An object with the following properties:
 * - getCreateItem: a function which will return the label of the choice for create a new choice.
 * - createElement: a React element to render after the input. It will be rendered when users choose to create a new choice. It renders null otherwise.
 */
export const useSupportCreateSuggestion = (    options) => {
    const {
        create,
        createLabel = 'ra.action.create',
        createItemLabel = 'ra.action.create_item',
        createValue = '@@ra-create',
        filter,
        handleChange,
        onCreate,
    } = options;
    const translate = useTranslate();
    const [renderOnCreate, setRenderOnCreate] = useState(false);

    const context = {
        filter,
        onCancel: () => setRenderOnCreate(false),
        onCreate: item => {
            setRenderOnCreate(false);
            handleChange(undefined, item);
        },
    };

    return {
        getCreateItem: () => {
            return {
                id: createValue,
                name:
                    filter && createItemLabel
                        ? translate(createItemLabel, {
                            item: filter,
                            _: createItemLabel,
                        })
                        : translate(createLabel, { _: createLabel }),
            };
        },
        handleChange: async eventOrValue => {
            const value = eventOrValue.target?.value || eventOrValue;
            const finalValue = Array.isArray(value) ? [...value].pop() : value;

            if (eventOrValue?.preventDefault) {
                eventOrValue.preventDefault();
                eventOrValue.stopPropagation();
            }
            if (finalValue?.id === createValue || finalValue === createValue) {
                if (!isValidElement(create)) {
                    const newSuggestion = await onCreate(filter);

                    if (newSuggestion) {
                        handleChange(eventOrValue, newSuggestion);
                        return;
                    }
                } else {
                    setRenderOnCreate(true);
                    return;
                }
            }
            handleChange(eventOrValue, undefined);
        },
        createElement:
            renderOnCreate && isValidElement(create) ? (
                <CreateSuggestionContext.Provider value={context}>
                    {create}
                </CreateSuggestionContext.Provider>
            ) : null,
    };
};

const CreateSuggestionContext = createContext(undefined);

export const useCreateSuggestionContext = () => useContext(CreateSuggestionContext);