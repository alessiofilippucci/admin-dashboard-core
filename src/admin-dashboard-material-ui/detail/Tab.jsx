import * as React from 'react';
import { isValidElement } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import MuiTab from '@material-ui/core/Tab';
import { Utils, useTranslate } from 'admin-dashboard-core';
import classnames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';

import Labeled from '../input/Labeled';

const useStyles = makeStyles(
    theme => ({
        fixPadding: {
            padding: '22px 15px'
        },
        selected: {
            border: '1px solid #e0e0e3',
            backgroundColor: '#ffffff',
            borderBottom: 'none',
            borderRadius: '10px 10px 0 0',
            marginLeft: 15,
        }
    }),
    { name: 'RaTab' }
);

/**
 * Tab element for the SimpleShowLayout.
 *
 * The `<Tab>` component accepts the following props:
 *
 * - label: The string displayed for each tab
 * - icon: The icon to show before the label (optional). Must be a component.
 * - path: The string used for custom urls
 *
 * @example
 *     // in src/posts.js
 *     import * as React from "react";
 *     import FavoriteIcon from '@material-ui/icons/Favorite';
 *     import PersonPinIcon from '@material-ui/icons/PersonPin';
 *     import { Show, TabbedShowLayout, Tab, TextField } from 'react-admin';
 *
 *     export const PostShow = (props) => (
 *         <Show {...props}>
 *             <TabbedShowLayout>
 *                 <Tab label="Content" icon={<FavoriteIcon />}>
 *                     <TextField source="title" />
 *                     <TextField source="subtitle" />
 *                </Tab>
 *                 <Tab label="Metadata" icon={<PersonIcon />} path="metadata">
 *                     <TextField source="category" />
 *                </Tab>
 *             </TabbedShowLayout>
 *         </Show>
 *     );
 *
 *     // in src/App.js
 *     import * as React from "react";
 *     import { Admin, Resource } from 'react-admin';
 *
 *     import { PostShow } from './posts';
 *
 *     const App = () => (
 *         <Admin dataProvider={...}>
 *             <Resource name="posts" show={PostShow} />
 *         </Admin>
 *     );
 *     export default App;
 */
const Tab = ({
    basePath,
    children,
    contentClassName,
    context,
    className,
    icon,
    label,
    record,
    resource,
    value,
    useBootstrap,
    asStandardField,
    fixPadding,
    tabClassName,
    stateData,
    ...rest
}) => {
    const classes = useStyles();
    const translate = useTranslate();

    let finalValue = {
        pathname: value,
        state: stateData
    };

    const renderHeader = () => (
        <MuiTab
            key={label}
            label={translate(label, { _: label })}
            value={value}
            icon={icon}
            className={classnames('show-tab', tabClassName, className)}
            classes={{
                selected: classes.selected
            }}
            {...({ component: Link, to: finalValue })} // to avoid TypeScript screams, see https://github.com/mui-org/material-ui/issues/9106#issuecomment-451270521
            {...rest}
        />
    );

    const renderField = (field) => {
        return <div
            key={field.props.source}
            className={classnames(
                'ra-field',
                `ra-field-${field.props.source}`,
                field.props.className,
                field.props.formClassName,
            )}
        >
            {field.props.addLabel ? (
                <Labeled
                    label={field.props.label}
                    source={field.props.source}
                    basePath={basePath}
                    record={record}
                    resource={resource}
                    asStandardField={asStandardField}
                    className={useBootstrap && field.props.fullWidth ? 'w-100' : ''}
                >
                    {field}
                </Labeled>
            ) : typeof field.type === 'string' ? (
                field
            ) : (
                React.cloneElement(field, {
                    basePath,
                    record,
                    resource,
                })
            )}
        </div>;
    }

    const renderContent = () => (
        <div className={classnames(contentClassName, useBootstrap ? 'row' : '', fixPadding ? classes.fixPadding : '')}>
            {React.Children.map(children, field => {
                if (field && isValidElement(field)) {
                    if (field.type.displayName === "GroupedLayout") {
                        const { noInput, ...fieldProps } = field.props;
                        const innerChildren = React.Children.toArray(field.props.children).length > 0 ? React.Children.map(field.props.children, renderField) : [];
                        const rowChild = React.createElement('div', { className: 'row', children: innerChildren },);
                        const filteredChild = { ...field, props: { ...fieldProps, children: rowChild } };
                        return renderField(filteredChild);
                    }
                    return renderField(field);
                }
                else {
                    return null
                }
            }
            )}
        </div>
    );

    return context === 'header' ? renderHeader() : renderContent();
};

Tab.propTypes = {
    className: PropTypes.string,
    contentClassName: PropTypes.string,
    children: PropTypes.node,
    context: PropTypes.oneOf(['header', 'content']),
    icon: PropTypes.element,
    label: PropTypes.string.isRequired,
    path: PropTypes.string,
    value: PropTypes.string,
    asStandardField: PropTypes.bool,
    stateData: PropTypes.object,
};

Tab.defaultProps = {
    stateData: {},
};

export default Tab;
