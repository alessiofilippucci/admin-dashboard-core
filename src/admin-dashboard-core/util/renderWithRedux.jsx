import * as React from 'react';
import { render } from '@testing-library/react';

import TestContext from './TestContext';

export default (
    component,
    initialState = {},
    options = {}
) => {
    let dispatch;
    let reduxStore;
    const renderResult = render(
        <TestContext initialState={initialState} enableReducers>
            {({ store }) => {
                dispatch = jest.spyOn(store, 'dispatch');
                reduxStore = store;
                return component;
            }}
        </TestContext>,
        options
    );

    return {
        ...renderResult,
        rerender: newComponent => {
            return renderResult.rerender(
                <TestContext initialState={initialState} enableReducers>
                    {({ store }) => {
                        dispatch = jest.spyOn(store, 'dispatch');
                        reduxStore = store;
                        return newComponent;
                    }}
                </TestContext>
            );
        },
        dispatch,
        reduxStore,
    };
};
