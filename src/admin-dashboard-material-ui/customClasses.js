const commonStyles = (theme) => ({
    buttonMobile: {
        backgroundColor: '#747475',
        color: '#fff',
        borderRadius: 10,
        margin: 8,
        padding: 5,
        minWidth: 'inherit',
        flex: 1,
        '& svg': {
            fontSize: 18,
            marginRight: 0,
        },
        '&.back': {
            backgroundColor: 'var(--light)',
        },
        '&.add': {
            backgroundColor: '#ffeb3b',
            color: theme.palette.getContrastText('#ffeb3b'),
        },
        '&.danger': {
            backgroundColor: 'var(--red)',
        },
        '&.demandsAndNeeds': {
            backgroundColor: 'var(--primary)',
        },
        '&.moreInfoPrivati': {
            backgroundColor: 'var(--success)',
        },
    },
    bottomToolbar: {
        backgroundColor: 'rgba(248, 246, 249, 1)',
        border: '1px solid rgba(204, 204, 204, 1)',
        borderBottom: 'none',
        borderLeft: 'none',
        borderRight: 'none',
        fontSize: 18,
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: '15px 0px',
        fontWeight: '400'
    },
    validInput: {
        backgroundColor: theme.palette.success.light,
        '&:hover': {
            backgroundColor: theme.palette.success.main,
        },
    },
    notValidInput: {
        backgroundColor: theme.palette.error.light,
        '&:hover': {
            backgroundColor: theme.palette.error.main,
        },
    },
}
)

export default {
    list: (theme, rest) => ({
        text: {
            maxWidth: '20em',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
        },
        hiddenOnSmallScreens: {
            [theme.breakpoints.down('md')]: {
                display: 'none',
            },
        },
        bool: { justifyContent: 'center' },
        toolbar: {
            alignItems: 'center',
            justifyContent: 'flex-end',
            display: 'flex',
            marginTop: -1,
            marginBottom: -1,
        },
        ...commonStyles(theme),
        ...rest
    }),
    create: (theme, rest) => ({
        ...commonStyles(theme),
        ...rest
    }),
    edit: (theme, rest) => ({
        ...commonStyles(theme),
        ...rest
    }),
    show: (theme, rest) => ({
        ...commonStyles(theme),
        ...rest
    }),
    showExpand: (theme, rest) => ({
        ...commonStyles(theme),
        ...rest
    }),
    mobileList: (theme, rest) => ({
        root: { margin: '1em' },
        card: {
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            margin: '0.5rem 0',
        },
        cardTitleContent: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'baseline',
            justifyContent: 'space-between',
        },
        cardContent: {
            ...theme.typography.body1,
            display: 'flex',
            flexDirection: 'column',
        },
        ...commonStyles(theme),
        ...rest
    }),
};
