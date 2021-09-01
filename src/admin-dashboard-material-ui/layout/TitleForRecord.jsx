import * as React from 'react';
import PropTypes from 'prop-types';
import Title, { TitlePropType } from './Title';

const TitleForRecord = ({ defaultTitle, record, title, resource }) =>
    record ? (
        <Title title={title} record={record} defaultTitle={defaultTitle} resource={resource} />
    ) : (
        ''
    );

TitleForRecord.propTypes = {
    defaultTitle: PropTypes.any,
    record: PropTypes.object,
    title: TitlePropType,
    resource: PropTypes.string,
};

export default TitleForRecord;
