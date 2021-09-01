
import React, {
    Component,
    createElement,
    useEffect,
    useRef,
    useState,
} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { withRouter } from 'react-router-dom';
import {
    createMuiTheme,
    withStyles,
    createStyles,
} from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

import { ComponentPropType } from 'admin-dashboard-core';
import defaultTheme from '../defaultTheme';
 
import compose from 'lodash/flowRight';

import DefaultAppBar from './AppBar';
import DefaultScrollToTop from './ScrollToTop';
import DefaultMenu from './Menu';
import DefaultNotification from './Notification';
import DefaultError from './Error';
import DefaultPage from './Page';
import DefaultSidebar from './Sidebar';

const styles = theme =>
    createStyles({
        root: {
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1,
            minHeight: '100vh',
            backgroundColor: theme.palette.background.default,
            position: 'relative',
            minWidth: 'fit-content',
            width: '100%',
            color: theme.palette.getContrastText(
                theme.palette.background.default
            ),
        },
        appFrame: {
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            [theme.breakpoints.up('xs')]: {
                marginTop: theme.spacing(6),
            },
            [theme.breakpoints.down('xs')]: {
                marginTop: theme.spacing(7),
            },
        },
        contentMain: {
            display: 'flex',
            flexGrow: 1,
        },
        content: {
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            flexBasis: 0,
            padding: theme.spacing(3),
            [theme.breakpoints.down('sm')]: {
                padding: 5,
            },
        },
    });

class LayoutPublicWithoutTheme extends Component {
    state = { hasError: false, errorMessage: null, errorInfo: null };

    constructor(props) {
        super(props);
        /**
         * Reset the error state upon navigation
         *
         * @see https://stackoverflow.com/questions/48121750/browser-navigation-broken-by-use-of-react-error-boundaries
         */
        props.history.listen(() => {
            if (this.state.hasError) {
                this.setState({ hasError: false });
            }
        });
    }

    componentDidCatch(errorMessage, errorInfo) {
        this.setState({ hasError: true, errorMessage, errorInfo });
    }

    render() {
        const {
            appBar,
            children,
            classes,
            className,
            error,
            dashboard,
            menu,
            notification,
            open,
            title,
            page,
            sidebar,
            // sanitize react-router props
            match,
            location,
            history,
            staticContext,
            ...props
        } = this.props;
        const { hasError, errorMessage, errorInfo } = this.state;
        return (
            <>
                <div
                    className={classnames('layout-public', classes.root, className)}
                    {...props}
                >
                    <div className={classes.appFrame}>
                        {createElement(appBar, { title, open })}
                        <main className={classes.contentMain}>
                            {createElement(sidebar, { children: createElement(menu, { title, }), })}
                            <div id="main-content" className={classes.content}>
                                {hasError && createElement(error, { error: errorMessage, errorInfo, title, })}
                                {createElement(page, { title, open })}
                            </div>
                        </main>
                        <DefaultScrollToTop />
                    </div>
                </div>
                {createElement(notification)}
            </>
        );
    }

    static propTypes = {
        appBar: ComponentPropType,
        children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
        classes: PropTypes.object,
        className: PropTypes.string,
        error: ComponentPropType,
        history: PropTypes.object.isRequired,
        menu: ComponentPropType,
        notification: ComponentPropType,
        open: PropTypes.bool,
        page: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
    };

    static defaultProps = {
        appBar: DefaultAppBar,
        error: DefaultError,
        menu: DefaultMenu,
        notification: DefaultNotification,
        page: DefaultPage,
        sidebar: DefaultSidebar,
    };
}

const mapStateToProps = state => ({
    open: state.admin.ui.sidebarOpen,
});

const EnhancedLayoutPublic = compose(
    connect(
        mapStateToProps,
        {} // Avoid connect passing dispatch in props
    ),
    withRouter,
    withStyles(styles, { name: 'RaLayoutPublic' })
)(LayoutPublicWithoutTheme);

const LayoutPublic = ({ theme: themeOverride, ...props }) => {
    const themeProp = useRef(themeOverride);
    const [theme, setTheme] = useState(createMuiTheme(themeOverride));

    useEffect(() => {
        if (themeProp.current !== themeOverride) {
            themeProp.current = themeOverride;
            setTheme(createMuiTheme(themeOverride));
        }
    }, [themeOverride, themeProp, theme, setTheme]);

    return (
        <ThemeProvider theme={theme}>
            <EnhancedLayoutPublic {...props} />
        </ThemeProvider>
    );
};

LayoutPublic.propTypes = {
    theme: PropTypes.object,
};

LayoutPublic.defaultProps = {
    theme: defaultTheme,
};

export default LayoutPublic;