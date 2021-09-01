import React, { useEffect, useState } from "react";
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';

import {
    Utils,
    LinearProgress,
    fetchUtils,
    useNotify,
    fetchStart,
    fetchEnd,
    useLocale,
    useRefresh,
} from 'admin-dashboard';

import { Card, CardContent, CardHeader } from '@material-ui/core';

const Page = (props) => {
    const {
        staticContext,
        baseUrl = `${Utils.GetENV('API_ENDPOINT')}/public`,
        ...rest
    } = props;
    const location = useLocation();
    const locale = useLocale();
    const dispatch = useDispatch();
    const refresh = useRefresh();
    const notify = useNotify();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(null);

    const { pathname } = location;
    const id = pathname === '/' ? null : pathname.split("/")[1];

    const finalUrl = `${baseUrl}/${!Utils.IsEmpty(id) ? `pages/${id}` : 'homepage'}`;
    const headers = new Headers({ Accept: 'application/json' });
    headers.set("Content-Language", locale);

    const options = { method: 'GET', headers };

    useEffect(() => {
        let mounted = true;
        dispatch(fetchStart()); // start the global loading indicator 
        fetchUtils.fetchJson(finalUrl, options)
            .then((response) => { const { json } = response; if (mounted) setPage(json); refresh(); })
            .catch(setError)
            .finally(() => { if (mounted) setLoading(false); dispatch(fetchEnd()) });
    }, [id]);

    if (loading) { return <LinearProgress />; }

    return (
        <>
            {page ? (
                <Card>
                    <CardHeader title={page.title} />
                    <CardContent>
                        {page.pageContent && Utils.ParseToHTML(page.pageContent)}
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <CardHeader title="" />
                    <CardContent>
                        NO PAGE FOUND
                    </CardContent>
                </Card>
            )
            }
        </>
    )
};

export default Page;
