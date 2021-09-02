import parseDate from 'date-fns/parse';

export const IsNumber = (value) => value.constructor == Number;
export const valuesAreNumber = (values) => values.every(IsNumber);

export const IsNumeric = (value) => !isNaN(parseFloat(value)) && isFinite(value);
export const valuesAreNumeric = (values) => values.every(IsNumeric);

export const IsInteger = (value) => Number.IsInteger(value);
export const valuesAreInteger = (values) => values.every(IsInteger);

export const IsBoolean = (value) => typeof value === 'boolean';
export const valuesAreBoolean = (values) => values.every(IsBoolean);

export const IsString = (value) => typeof value === 'string';
export const valuesAreString = (values) => values.every(IsString);

export const IsArray = (value) => Array.isArray(value);
export const valuesAreArray = (values) => values.every(IsArray);

export const IsDate = (value) => value instanceof Date;
export const valuesAreDate = (values) => values.every(IsDate);

export const IsDateString = (value) => typeof value === 'string' && !isNaN(parseDate(value).getDate());
export const valuesAreDateString = (values) => values.every(IsDateString);

export const IsObject = (value) => Object.prototype.toString.call(value) === '[object Object]';
export const valuesAreObject = (values) => values.every(IsObject);

export const IsJsonString = (value) => { try { JSON.parse(value); } catch (e) { return false; } return true; };
export const valuesAreJsonString = (values) => values.every(IsJsonString);

export const IsFunction = (value) => Object.prototype.toString.call(value) === '[object Function]';
export const valuesAreFunction = (values) => values.every(IsFunction);

const HtmlRegexp = /<([A-Z][A-Z0-9]*)\b[^>]*>(.*?)<\/\1>/i;
export const IsHtml = (value) => HtmlRegexp.test(value);
export const valuesAreHtml = (values) => values.every(IsHtml);

const UrlRegexp = /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/;
export const IsUrl = (value) => UrlRegexp.test(value);
export const valuesAreUrl = (values) => values.every(IsUrl);

export const IsFile = (value) => 'File' in window && value instanceof File;
export const valuesAreFile = (values) => values.every(IsFile);

const GuidRegexp = /^(\{){0,1}[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}(\}){0,1}$/;
export const IsGuid = (value) => value && GuidRegexp.test(value);
export const valuesAreGuid = (values) => values.every(IsGuid);