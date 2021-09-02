import * as React from 'react';
import { render } from '@testing-library/react';

import renderWithRedux from './renderWithRedux';

const TestHook = ({ children, hook }) => {
    return children(hook());
};

function renderHook(hook, withRedux, reduxState);
function renderHook(hook, withRedux = false);
function renderHook(hook, withRedux = true, reduxState) {
    let hookValue = null;
    const children = props => {
        hookValue = props;
        return <p>child</p>;
    };
    const childrenMock = jest.fn().mockImplementation(children);
    const result = withRedux
        ? renderWithRedux(
              <TestHook children={childrenMock} hook={hook} />,
              reduxState
          )
        : render(<TestHook children={childrenMock} hook={hook} />);

    return {
        ...result,
        hookValue,
        childrenMock,
        rerender: newHook => {
            result.rerender(
                <TestHook children={childrenMock} hook={newHook} />
            );
        },
    };
}

export default renderHook;
