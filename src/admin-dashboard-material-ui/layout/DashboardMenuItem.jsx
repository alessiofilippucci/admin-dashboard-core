import * as React from 'react';
import PropTypes from 'prop-types';
import DashboardIcon from '@material-ui/icons/Dashboard';
import { useTranslate } from 'admin-dashboard-core';

import MenuItemLink from './MenuItemLink';

const DashboardMenuItem = ({
    locale,
    onClick,
    routePrefix,
    ...props
}) => {
    const translate = useTranslate();
    return (
        <MenuItemLink
            onClick={onClick}
            to={`/${routePrefix}`}
            primaryText={translate('ra.page.dashboard')}
            leftIcon={<DashboardIcon />}
            exact
            {...props}
        />
    );
};

DashboardMenuItem.propTypes = {
    classes: PropTypes.object,
    locale: PropTypes.string,
    onClick: PropTypes.func,
    dense: PropTypes.bool,
    sidebarIsOpen: PropTypes.bool,
};

export default DashboardMenuItem;
