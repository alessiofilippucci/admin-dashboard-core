import { useSelector } from 'react-redux';

export default () =>
    useSelector((state) => state.admin.loading > 0);
