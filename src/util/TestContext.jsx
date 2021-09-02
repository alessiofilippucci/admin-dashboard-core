import * as React from 'react';
import { Component } from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import merge from 'lodash/merge';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

import createAdminStore from '../core/createAdminStore';
import { convertLegacyDataProvider } from '../dataProvider';

export const defaultStore = {
    admin: {
        resources: {},
        references: { possibleValues: {} },
        ui: { viewVersion: 1 },
    },
};

const dataProviderDefaultResponse = { data: null };

class TestContext extends Component {
    storeWithDefault = null;
    history = null;

    constructor(props) {
        super();
        this.history = props.history || createMemoryHistory();
        const { initialState = {}, enableReducers = false } = props;

        this.storeWithDefault = enableReducers
            ? createAdminStore({
                  initialState: merge({}, defaultStore, initialState),
                  dataProvider: convertLegacyDataProvider(() =>
                      Promise.resolve(dataProviderDefaultResponse)
                  ),
                  history: createMemoryHistory(),
              })
            : createStore(() => merge({}, defaultStore, initialState));
    }

    renderChildren = () => {
        const { children } = this.props;
        return typeof children === 'function'
            ? (children)({
                  store: this.storeWithDefault,
                  history: this.history,
              })
            : children;
    };

    render() {
        return (
            <Provider store={this.storeWithDefault}>
                <Router history={this.history}>{this.renderChildren()}</Router>
            </Provider>
        );
    }
}

export default TestContext;
