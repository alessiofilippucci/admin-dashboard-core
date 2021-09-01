import PropTypes from 'prop-types';

export const fieldPropTypes = {
    addLabel: PropTypes.bool,
    sortBy: PropTypes.string,
    sortByOrder: PropTypes.oneOf(['ASC', 'DESC']),
    source: PropTypes.string,
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.element, PropTypes.func]),
    sortable: PropTypes.bool,
    className: PropTypes.string,
    cellClassName: PropTypes.string,
    headerClassName: PropTypes.string,
    textAlign: PropTypes.oneOf(['right', 'left']),
    emptyText: PropTypes.string,
};
