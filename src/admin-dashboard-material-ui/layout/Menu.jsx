import * as React from 'react';
import PropTypes from 'prop-types';
import { shallowEqual, useSelector } from 'react-redux';
import inflection from 'inflection';
import { useMediaQuery } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import DefaultIcon from '@material-ui/icons/ViewList';
import classnames from 'classnames';
import { getResources, useTranslate } from 'admin-dashboard-core';

import DashboardMenuItem from './DashboardMenuItem';
import MenuItemLink from './MenuItemLink';

const useStyles = makeStyles(
    theme => ({
        main: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            marginTop: '0.5em',
            [theme.breakpoints.only('xs')]: {
                marginTop: 0,
            },
            [theme.breakpoints.up('md')]: {
                marginTop: '1.5em',
            },
        },
    }),
    { name: 'RaMenu' }
);

const translatedResourceName = (resource, translate) =>
    translate(`resources.${resource.name}.name`, {
        smart_count: 2,
        _:
            resource.options && resource.options.label
                ? translate(resource.options.label, {
                      smart_count: 2,
                      _: resource.options.label,
                  })
                : inflection.humanize(inflection.pluralize(resource.name)),
    });

const Menu = props => {
    const {
        classes: classesOverride,
        className,
        dense,
        hasDashboard,
        onMenuClick,
        logout,
        ...rest
    } = props;
    const translate = useTranslate();
    const classes = useStyles(props);
    const isXSmall = useMediaQuery((theme) =>
        theme.breakpoints.down('xs')
    );
    const open = useSelector((state) => state.admin.ui.sidebarOpen);
    const resources = useSelector(getResources, shallowEqual);

    // Used to force redraw on navigation
    useSelector((state) => state.router.location.pathname);

    return (
        <div className={classnames(classes.main, className)} {...rest}>
            {hasDashboard && (
                <DashboardMenuItem
                    onClick={onMenuClick}
                    dense={dense}
                    sidebarIsOpen={open}
                />
            )}
            {resources
                .filter(r => r.hasList)
                .map(resource => (
                    <MenuItemLink
                        key={resource.name}
                        to={`/${resource.name}`}
                        primaryText={translatedResourceName(
                            resource,
                            translate
                        )}
                        leftIcon={
                            resource.icon ? <resource.icon /> : <DefaultIcon />
                        }
                        onClick={onMenuClick}
                        dense={dense}
                        sidebarIsOpen={open}
                    />
                ))}
            {isXSmall && logout}
        </div>
    );
};

Menu.propTypes = {
    classes: PropTypes.object,
    className: PropTypes.string,
    dense: PropTypes.bool,
    hasDashboard: PropTypes.bool,
    logout: PropTypes.element,
    onMenuClick: PropTypes.func,
};

Menu.defaultProps = {
    onMenuClick: () => null,
};

export default Menu;
