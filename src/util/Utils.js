import { matchPath } from 'react-router-dom'
import equal from "deep-equal";
import lodash from "lodash";
import { saveAs } from 'file-saver';
import { Parser } from 'expr-eval';
import parse from 'html-react-parser';
import * as Check from '../inference/assertions';
import _ from 'underscore';
import { Utils } from '.';

export * from '../inference/assertions';

export const GetFullHostName = () => {
    return window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
}

export const IsProd = () => {
    if (process.env[`REACT_APP_MY_NODE_ENV`]) return process.env[`REACT_APP_MY_NODE_ENV`] === "production";
    return process.env.NODE_ENV === "production";
}

export const IsStaging = () => {
    if (process.env[`REACT_APP_MY_NODE_ENV`]) return process.env[`REACT_APP_MY_NODE_ENV`] === "staging";
    return false;
}

export const IsDev = () => {
    if (process.env[`REACT_APP_MY_NODE_ENV`]) return process.env[`REACT_APP_MY_NODE_ENV`] === "development";
    return process.env.NODE_ENV === "development";
}

export const GetNodeEnv = () => {
    if (process.env[`REACT_APP_MY_NODE_ENV`]) return process.env[`REACT_APP_MY_NODE_ENV`];
    return process.env.NODE_ENV;
}

export const GetENV = (name, defaultValue) => {
    if (process.env[`REACT_APP_${name}`]) return process.env[`REACT_APP_${name}`];
    if (!IsEmpty(defaultValue)) return defaultValue;
    return null;
}

export const GetMatchPath = (pathname, path, param, exact = true, strict = false) => {
    const match = matchPath(pathname, {
        path: path,
        exact: exact,
        strict: strict
    });

    if (param)
        return match ? match.params[param] : null;
    else
        return match ? true : false;
}

export const Compute = (equation, thisValue, decimals, commons) => {
    let result = equation;
    if (!IsEmpty(commons)) { equation = ReplacePlaceholderCommon(equation, commons) }
    try { result = Parser.evaluate(equation, { this: thisValue }); } catch { }
    if (!IsEmpty(decimals) && Check.IsNumber(result)) { result = result.toFixed(decimals) }
    return result;
}

export const FindNested = (obj, key, value, memo, path) => {
    let i, hasOwn = Object.prototype.hasOwnProperty.bind(obj);
    if ('[object Array]' !== GetType(memo)) memo = [];
    if ('[object String]' !== GetType(path)) path = '';
    for (i in obj) {
        if (hasOwn(i)) {
            if (i === key) { if (obj[i] === value) { memo.push({ o: obj, p: path }); } }
            else if ('[object Array]' === GetType(obj[i]) || '[object Object]' === GetType(obj[i])) {
                var parsed = parseInt(i);
                let newPath = isNaN(parsed) ? path.concat(`${i}`) : path.concat(`[${parsed}].`);
                FindNested(obj[i], key, value, memo, newPath);
            }
        }
    }
    return memo;
}

export const MergeDeep = (target, source) => {
    if (!Check.IsObject(target) || !Check.IsObject(source)) { return source; }
    Object.keys(source).forEach(key => {
        const targetValue = target[key], sourceValue = source[key];
        if (Check.IsArray(targetValue) && Check.IsArray(sourceValue)) {
            target[key] = targetValue.concat(sourceValue);
        } else if (Check.IsObject(targetValue) && Check.IsObject(sourceValue)) {
            target[key] = MergeDeep(Object.assign({}, targetValue), sourceValue);
        } else { target[key] = sourceValue; }
    });
    return target;
}

export const DeepFind = (obj, path) => {
    if (!IsEmpty(path)) {
        path = path.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
        path = path.replace(/^\./, '');           // strip a leading dot
        var a = path.split('.');
        for (var i = 0, n = a.length; i < n; ++i) {
            var k = a[i];
            if (obj && k in obj) { obj = obj[k]; }
            else { return; }
        }
    }
    return obj;
}

export const FindWithAttr = (array, attr, value) => {
    for (var i = 0; i < array.length; i += 1) { if (array[i][attr] === value) { return i; } }
    return -1;
}

export const GetKey = (key, obj) => {
    return key.split('.').reduce(function (a, b) { return a && a[b]; }, obj);
}

export const GetType = (obj) => {
    let proto = Object.prototype, ts = proto.toString;
    return ts.call(obj);
}

export const Capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
}

export const Camelize = (s) => {
    return s.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
        if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
        return index === 0 ? match.toLowerCase() : match.toUpperCase();
    });
}

export const Pascalize = (string) => {
    return `${string}`
        .replace(new RegExp(/[-_]+/, 'g'), ' ')
        .replace(new RegExp(/[^\w\s]/, 'g'), '')
        .replace(
            new RegExp(/\s+(.)(\w+)/, 'g'),
            ($1, $2, $3) => `${$2.toUpperCase() + $3.toLowerCase()}`
        )
        .replace(new RegExp(/\s/, 'g'), '')
        .replace(new RegExp(/\w/), s => s.toUpperCase());
}

export const IsEmpty = (obj) => {
    if (obj instanceof Array) { return obj.length === 0; }
    if (obj instanceof Object) { return Object.keys(obj).length === 0; }
    return obj === '' || !IsExisty(obj);
};

export const IsEmptyTrimed = (obj) => {
    if (typeof obj === 'string') { return obj.trim() === ''; }
    return true;
};

export const IsExisty = (obj) => {
    return obj !== null && obj !== undefined;
};

export const GetExtension = (filename) => {
    var parts = filename.split('.');
    return parts[parts.length - 1];
}

export const IsDocument = (file) => {
    if (file) {
        var isDocumentFile = Check.IsFile(file) && file.type.split("/")[0] === 'application';
        var ext = isDocumentFile ? GetExtension(file.name) : GetExtension(file);
        switch (ext.toLowerCase()) {
            case 'msword':
            case 'vnd.openxmlformats-officedocument.wordprocessingml.document':
            case 'vnd.oasis.opendocument.text':
            case 'pdf':
            case 'rtf':
                // etc
                return true;
        }
    }
    return false;
}

export const IsImage = (file) => {
    if (file) {
        var isImageFile = Check.IsFile(file) && file.type.split("/")[0] === 'image';
        var ext = isImageFile ? GetExtension(file.name) : GetExtension(file);
        switch (ext.toLowerCase()) {
            case 'jpg':
            case 'jpeg':
            case 'jpe':
            case 'jif':
            case 'jfif':
            case 'jfi':
            case 'gif':
            case 'bmp':
            case 'png':
            case 'webp':
            case 'tiff':
            case 'tif':
            case 'psd':
            case 'svg':
                // etc
                return true;
        }
    }
    return false;
}

export const IsVideo = (file) => {
    if (file) {
        var isVideoFile = Check.IsFile(file) && file.type.split("/")[0] === 'video';
        var ext = isVideoFile ? GetExtension(file.name) : GetExtension(file);
        switch (ext.toLowerCase()) {
            case 'webm':
            case 'mpg':
            case 'mp2':
            case 'mpeg':
            case 'mpe':
            case 'mpv':
            case 'ogg':
            case 'mp4':
            case 'm4p':
            case 'm4v':
            case 'avi':
            case 'wmv':
                // etc
                return true;
        }
    }
    return false;
}

export const CompareValues = (key, order = 'asc') => {
    return function innerSort(a, b) {
        if (IsEmpty(DeepFind(a, key)) || IsEmpty(DeepFind(b, key))) { return 0; }
        const varA = (typeof DeepFind(a, key) === 'string') ? DeepFind(a, key).toUpperCase() : DeepFind(a, key);
        const varB = (typeof DeepFind(b, key) === 'string') ? DeepFind(b, key).toUpperCase() : DeepFind(b, key);
        let comparison = 0;
        if (varA > varB) { comparison = 1; } else if (varA < varB) { comparison = -1; }
        return ((order === 'desc') ? (comparison * -1) : comparison);
    };
}

export const MoveItemInArray = (array, from, to) => {
    if (to >= array.length) {
        var k = to - array.length + 1;
        while (k--) { array.push(undefined); }
    }
    array.splice(to, 0, array.splice(from, 1)[0]);
    return array;
}

export const GetUrlParam = (name) => {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results == null) { return null; }
    return results[1] || null;
}

export const ReplacePlaceholder = (text, placeholderName, value) => {
    // eslint-disable-next-line no-template-curly-in-string
    var res = text.match('\\${(' + placeholderName + ')}');
    return res !== null ? text.replace(res[0], value) : text;
}

export const ReplacePlaceholderRegex = (regexPlaceholder) => {
    // eslint-disable-next-line no-template-curly-in-string
    var res = regexPlaceholder.match('\\${(.+)}');
    return res !== null ? regexPlaceholder.replace(res[0], GetRegex(res[1])) : regexPlaceholder;
}

export const ReplacePlaceholderCommon = (commonsPlaceholder, commons) => {
    const myRegexp = /(\${([^{}]*)})/g;
    let match = myRegexp.exec(commonsPlaceholder);
    let res = commonsPlaceholder;
    while (match != null) {
        const value = GetKey(match[2], commons);
        res = res.replace(match[0], !IsEmpty(value) ? value : 0);
        match = myRegexp.exec(commonsPlaceholder);
    }
    return res;
}

export const GetRegex = (type) => {
    switch (type.toLowerCase()) {
        case "telaio":
            return /^(?<wmi>[A-HJ-NPR-Z\\d]{3})(?<vds>[A-HJ-NPR-Z\\d]{5})(?<check>[A-HJ-NPR-Z\\d])(?<vis>(?<year>[A-HJ-NPR-Z\\d])(?<plant>[A-HJ-NPR-Z\\d])(?<seq>[A-HJ-NPR-Z\\d]{6}))$/;
        case "codicefiscale":
            return /^(?:[A-Z][AEIOU][AEIOUX]|[B-DF-HJ-NP-TV-Z]{2}[A-Z]){2}(?:[\dLMNP-V]{2}(?:[A-EHLMPR-T](?:[04LQ][1-9MNP-V]|[15MR][\dLMNP-V]|[26NS][0-8LMNP-U])|[DHPS][37PT][0L]|[ACELMRT][37PT][01LM]|[AC-EHLMPR-T][26NS][9V])|(?:[02468LNQSU][048LQU]|[13579MPRTV][26NS])B[26NS][9V])(?:[A-MZ][1-9MNP-V][\dLMNP-V]{2}|[A-M][0L](?:[1-9MNP-V][\dLMNP-V]|[0L][1-9MNP-V]))[A-Z]$/;
        case "partitaiva":
            return /^[0-9]{11}$/;
        case "targa":
            return /^[a-zA-Z]{2}[0-9]{3}[a-zA-Z]{2}$/;
        case "alpha_num":
            return /^[a-zA-Z0-9 ]+$/;
        case "alpha_num_hashtag":
            return /^#{1}[a-zA-Z0-9]+$/;
        default:
            return /.*/;
    };
}

export const ToJson = (data) => {
    return JSON.stringify(data, null, 4);
}

export const AreEquals = (a, b) => {
    return equal(a, b);
};

export const GroupBy = (xs, key) => {
    return xs.reduce(function (rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});
};

export const LoopObject = (obj, callback) => {
    if (Check.IsObject(obj)) {
        return _.mapObject(obj, callback)
    }
    else {
        return _.mapObject({}, callback)
    }
}

export const LoopObjectValues = (obj, callback) => {
    if (Check.IsObject(obj)) {
        return _.values(obj).map(callback);
    }
    else {
        return _.values({}).map(callback);
    }
}

export const Clone = (src) => {
    return lodash.cloneDeep(src);
}

export const Distinct = (array, key) => {
    const result = [];
    const map = new Map();
    for (const item of array) {
        if (!map.has(item[key])) {
            map.set(item[key], true);    // set any value to Map
            result.push(item);
        }
    }
    return result;
}

export const BuildResources = (resources, sortByKey = false, group = null) => {
    if (resources.default) resources = resources.default;
    var result = {};
    var keys = Object.keys(resources);

    if (sortByKey) keys = keys.sort();

    keys.map(function (resource) {
        result[resource] = { ...resources[resource] }
        if (group) result[resource].group = group;
    });
    return result;
}

export const BuildTranslations = (translations, type) => {
    if (translations.default) translations = translations.default;
    var result = {};
    if (translations.hasOwnProperty('name')) {
        result[translations.name] = { ...translations[type] };
    } else {
        Object.keys(translations).forEach((el, idx, arr) => {
            let name = translations[el].hasOwnProperty('name') ? translations[el].name : el;
            let value = { ...translations[el][type] };
            result[name] = value;
        });
    }
    return result;
}

export const BuildFormData = (formData, includeFiles = true) => {
    var data = new FormData();
    let distinctFormData = Distinct(Object.keys(formData).map(key => { return { key: key, value: formData[key] }; }), "key");
    distinctFormData.forEach(dfd => {
        if (Check.IsArray(dfd.value)) {
            dfd.key = `${dfd.key}[]`;
            dfd.value.forEach(val => {
                if (val !== null && val !== undefined) {
                    if (Check.IsObject(val) && Check.IsFile(val.rawFile)) {
                        if (includeFiles) {
                            data.append(dfd.key, val.rawFile, val.rawFile.name);
                            const fileType = IsImage(val.rawFile.name) ? "image" : (IsVideo(val.rawFile.name) ? "video" : "file");
                            data.append("action", fileType);
                            console.log(fileType, dfd.key, val.rawFile, val.rawFile.name);
                        }
                    }
                    else {
                        let name = dfd.key;
                        let value = val;
                        if (Check.IsBoolean(value)) { value = JSON.parse(value) ? 1 : 0; }
                        if (Check.IsObject(value)) { value = JSON.stringify(value); }
                        data.append(name, value);
                    }
                }
            });
        }
        else {
            if (dfd.value !== null && dfd.value !== undefined) {
                if (Check.IsObject(dfd.value) && Check.IsFile(dfd.value.rawFile)) {
                    if (includeFiles) {
                        data.append(dfd.key, dfd.value.rawFile, dfd.value.rawFile.name);
                        const fileType = IsImage(dfd.value.rawFile.name) ? "image" : (IsVideo(dfd.value.rawFile.name) ? "video" : "file");
                        data.append("action", fileType);
                        console.log(fileType, dfd.key, dfd.value.rawFile, dfd.value.rawFile.name);
                    }
                }
                else {
                    let name = dfd.key;
                    let value = dfd.value;
                    if (Check.IsBoolean(value)) { value = JSON.parse(value) ? 1 : 0; }
                    if (Check.IsObject(value)) { value = JSON.stringify(value); }
                    data.append(name, value);
                }
            }
        }
    });

    return data;
};

export function SaveFile(blob, filename, isBase64 = false) {
    if (isBase64) {
        blob = Base64ToBlob(blob);
    }
    saveAs(blob, filename);
}

export function Base64ToBlob(base64) {
    var type = base64.split('base64,')[0];
    var data = base64.split('base64,')[1];

    var byteCharacters = atob(data);
    var byteNumbers = new Array(byteCharacters.length);
    for (var i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    var byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: `${type};base64` });
}

export const ShowBase64Image = (base64) => {
    var image = new Image();
    image.src = base64;
    var w = window.open("");
    w.document.write(image.outerHTML);
    w.document.close();
}

export function ShowFile(blob, isBase64 = false) {
    var newBlob = isBase64 ? Base64ToBlob(blob) : new Blob([blob], { type: "application/pdf" });

    const data = window.URL.createObjectURL(newBlob);
    window.open(data, '_blank');
}

export function DownloadFile(blob, filename, isBase64 = false) {
    // It is necessary to create a new blob object with mime-type explicitly set
    // otherwise only Chrome works like it should
    var newBlob = isBase64 ? Base64ToBlob(blob) : new Blob([blob], { type: "application/pdf" });

    // IE doesn't allow using a blob object directly as link href
    // instead it is necessary to use msSaveOrOpenBlob
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(newBlob);
        return;
    }

    // For other browsers: 
    // Create a link pointing to the ObjectURL containing the blob.
    const data = window.URL.createObjectURL(newBlob);
    var link = document.createElement('a');
    link.href = data;
    link.download = filename;
    link.click();
    setTimeout(function () {
        // For Firefox it is necessary to delay revoking the ObjectURL
        window.URL.revokeObjectURL(data);
    }, 100);
}

export const WaitAsyncData = (toResolve) => {
    var promise = new Promise((resolve, reject) => {
        resolve(toResolve);
    });
    return promise;
}

export const ParseToHTML = (text) => {
    return parse(text);;
}

export const IsAllowed = (permission, noCustomerKey, authenticatedUser, permissions, customerKey) => {
    return (
        (noCustomerKey || (!noCustomerKey && !IsEmpty(customerKey))) &&
        (IsEmpty(permission) || permission === "*" || (permissions && permission.split(",").includes(permissions.toLowerCase()))) &&
        !IsEmpty(authenticatedUser)
    );
}

export function FormatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export const DEF_GUID = "00000000-0000-0000-0000-000000000000";