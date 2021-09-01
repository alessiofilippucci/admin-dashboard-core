import * as React from 'react';
import { memo } from 'react';
import {
    Button,
    Menu,
    MenuItem,
    Tooltip,
    IconButton,
    useMediaQuery
} from '@material-ui/core';
import SortIcon from '@material-ui/icons/Sort';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { shallowEqual } from 'react-redux';
import { useListSortContext, useTranslate } from 'admin-dashboard-core';

const SortButton = ({
    fields,
    label = 'ra.sort.sort_by',
}) => {
    const { resource, currentSort, setSort } = useListSortContext();
    const translate = useTranslate();
    const isXSmall = useMediaQuery((theme) =>
        theme.breakpoints.down('xs')
    );
    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleChangeSort = (event) => {
        const field = event.currentTarget.dataset.sort;
        setSort(
            field,
            field === currentSort.field ? inverseOrder(currentSort.order) : 'ASC'
        );
        setAnchorEl(null);
    };

    const buttonLabel = translate(label, {
        field: translate(`resources.${resource}.fields.${currentSort.field}`),
        order: translate(`ra.sort.${currentSort.order}`),
        _: label,
    });

    return (
        <>
            {isXSmall ? (
                <Tooltip title={buttonLabel}>
                    <IconButton
                        aria-label={buttonLabel}
                        color="primary"
                        onClick={handleClick}
                    >
                        <SortIcon />
                    </IconButton>
                </Tooltip>
            ) : (
                <Button
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    color="primary"
                    onClick={handleClick}
                    startIcon={<SortIcon />}
                    endIcon={<ArrowDropDownIcon />}
                    size="small"
                >
                    {buttonLabel}
                </Button>
            )}
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {fields.map(field => (
                    <MenuItem
                        onClick={handleChangeSort}
                        data-sort={field}
                        key={field}
                    >
                        {translate(`resources.${resource}.fields.${field}`)}{' '}
                        {translate(
                            `ra.sort.${
                                currentSort.field === field
                                    ? inverseOrder(currentSort.order)
                                    : 'ASC'
                            }`
                        )}
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
};

const inverseOrder = (sort) => (sort === 'ASC' ? 'DESC' : 'ASC');

const arePropsEqual = (prevProps, nextProps) =>
    shallowEqual(prevProps.fields, nextProps.fields);

export default memo(SortButton, arePropsEqual);
