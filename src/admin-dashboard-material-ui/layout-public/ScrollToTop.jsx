import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { Fab, Tooltip, Zoom, useScrollTrigger } from "@material-ui/core";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";

import { useTranslate } from 'admin-dashboard-core';

const useStyles = makeStyles(theme => ({
    root: {
        position: "fixed",
        bottom: theme.spacing(2),
        right: theme.spacing(2)
    },
    icon: {
        backgroundColor: theme.palette.primary.link,
        color: theme.palette.primary.contrastText,
        '&:hover': {
            backgroundColor: theme.palette.primary.link,
            color: theme.palette.primary.contrastText
        }
    }
}));

function ScrollTop(props) {
    const classes = useStyles();
    const translate = useTranslate();
    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 100
    });

    const handleClick = event => {
        const anchor = (event.target.ownerDocument || document).querySelector(
            "#root"
        );

        if (anchor) {
            anchor.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    };

    return (
        <Zoom in={trigger}>
            <div onClick={handleClick} role="presentation" className={classes.root}>
                <Tooltip title={translate('ra.action.scroll_to_top')}>
                    <Fab size="small" aria-label={translate('ra.action.scroll_to_top')} className={classes.icon}>
                        <KeyboardArrowUpIcon />
                    </Fab>
                </Tooltip>
            </div>
        </Zoom>
    );
}

ScrollTop.propTypes = {
};

export default ScrollTop;