import HttpError from './HttpError';
import { stringify } from 'query-string';
import { Utils } from '../util';

export const createHeadersFromOptions = (options) => {
    const requestHeaders = (options.headers ||
        new Headers({
            Accept: 'application/json',
        }));
    if (
        !requestHeaders.has('Content-Type') &&
        !(options && (!options.method || options.method === 'GET')) &&
        !(options && options.body && options.body instanceof FormData)
    ) {
        requestHeaders.set('Content-Type', 'application/json');
    }
    if (options.user && options.user.authenticated && options.user.token) {
        requestHeaders.set('Authorization', options.user.token);
    }

    return requestHeaders;
};

export const fetchJson = (url, options = {}) => {
    const requestHeaders = createHeadersFromOptions(options);
    return fetch(url, { ...options, headers: requestHeaders })
        .then(response =>
            response.text().then(text => ({
                status: response.status,
                statusText: response.statusText,
                headers: response.headers,
                body: text,
            }))
        )
        .then(({ status, statusText, headers, body }) => {
            let json;
            try { json = JSON.parse(body); } catch (e) { } // not json, no big deal
            if (status < 200 || status >= 300) {
                if (status === 404)
                    throw Error("not_found");
                else{
                    if (json && (Utils.IsString(json) || Utils.IsObject(json))) {
                        if (json.message) {
                            throw Error(json.message);
                        }
                        else {
                            throw Error(JSON.stringify(json));
                        }
                    }
                    else {
                        throw Error(statusText);
                    }
                }
                // return Promise.reject(
                //     new HttpError(
                //         (json && json.message) || statusText,
                //         status,
                //         json
                //     )
                // );
            }
            return Promise.resolve({ status, headers, body, json });
        })
};

export const fetchBlob = (url, options = {}) => {
    const requestHeaders = createHeadersFromOptions(options);

    return fetch(url, { ...options, headers: requestHeaders })
        .then(response =>
            response.blob()
        )
        .then(myBlob => {
            return Promise.resolve(myBlob);
        })
        .catch(err => {
            throw Error(err);
        })
};

export const queryParameters = stringify;

const isValidObject = value => {
    if (!value) {
        return false;
    }

    const isArray = Array.isArray(value);
    const isBuffer = typeof Buffer !== 'undefined' && Buffer.isBuffer(value);
    const isObject =
        Object.prototype.toString.call(value) === '[object Object]';
    const hasKeys = !!Object.keys(value).length;

    return !isArray && !isBuffer && isObject && hasKeys;
};

export const flattenObject = (value, path = []) => {
    if (isValidObject(value)) {
        return Object.assign(
            {},
            ...Object.keys(value).map(key =>
                flattenObject(value[key], path.concat([key]))
            )
        );
    } else {
        return path.length ? { [path.join('.')]: value } : value;
    }
};
