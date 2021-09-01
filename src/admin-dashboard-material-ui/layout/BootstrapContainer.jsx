import React, { Children, cloneElement } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { FormInput } from '../form';

const BootstrapContainer = props => {
    const classes = useStyles(props);
    const { 
        basePath, 
        children, 
        margin, 
        record, 
        resource, 
        useBootstrap, 
        inSidebar, 
        variant, 
        noPadding, 
        asStandardField, 
        className,
        showRenderCount, 
        subscription,
        ...rest 
    } = props;

    const renderChild = (child) =>{
        const { noInput, ...childProps } = child.props;
        const filteredChild = { ...child, props: childProps };
        const input = cloneElement(filteredChild);

        return !noInput ?
            <FormInput
                basePath={basePath}
                input={input}
                record={record}
                resource={resource}
                variant={input.props.variant || variant}
                margin={input.props.margin || margin}
                useBootstrap={useBootstrap}
                asStandardField={asStandardField}
                showRenderCount={showRenderCount}
                subscription={subscription}
            /> :
            input;
    }

    return (
        <div className={classNames(classes.container, 'container-fluid', className, noPadding ? 'p-0' : '')}>
            <div className={classNames(classes.row, 'row', inSidebar ? 'pt-0' : '')}>
                {
                    Children.map(
                        children,
                        (child) => {
                            if (child) {
                                if (child.type.displayName === "GroupedLayout") {
                                    const { noInput, ...childProps } = child.props;
                                    const innerChildren = Children.toArray(child.props.children).length > 0 ? Children.map(child.props.children, renderChild) : [];
                                    const rowChild = React.createElement('div', { className: 'row', children: innerChildren },);
                                    const filteredChild = { ...child, props: { ...childProps, children: rowChild  } };
                                    return renderChild(filteredChild);
                                }
                                return renderChild(child);
                            }
                            else
                                return null
                        }
                    )
                }
            </div>
        </div>
    )
}

const useStyles = makeStyles(
    (theme) => ({
        container: {},
        row: {},
    }),
    { name: 'BootstrapContainer' }
);

BootstrapContainer.propTypes = {
    basePath: PropTypes.string,
    children: PropTypes.node,
    className: PropTypes.string,
    record: PropTypes.object,
    resource: PropTypes.string,
    inSidebar: PropTypes.bool,
    noPadding: PropTypes.bool,
    noInput: PropTypes.bool,
};

BootstrapContainer.defaultProps = {
    record: {},
    noInput: false
};

export default BootstrapContainer;