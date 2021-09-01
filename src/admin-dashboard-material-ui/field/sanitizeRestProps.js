const sanitizeRestProps = ({
    addLabel,
    allowEmpty,
    basePath,
    cellClassName,
    className,
    emptyText,
    formClassName,
    fullWidth,
    headerClassName,
    label,
    linkType,
    link,
    locale,
    record,
    resource,
    sortable,
    sortBy,
    sortByOrder,
    source,
    textAlign,
    translateChoice,
    showRenderCount,
    ...props
}) => props;

export default sanitizeRestProps;