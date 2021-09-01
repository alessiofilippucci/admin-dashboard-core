import { useSelector } from 'react-redux';

const useIsAutomaticRefreshEnabled = () => {
    const automaticRefreshEnabled = useSelector(
        state => state.admin.ui.automaticRefreshEnabled
    );

    return automaticRefreshEnabled;
};

export default useIsAutomaticRefreshEnabled;
