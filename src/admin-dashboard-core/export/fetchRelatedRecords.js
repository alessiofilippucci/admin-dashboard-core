const fetchRelatedRecords = (dataProvider) => (
    data,
    field,
    resource
) =>
    dataProvider
        .getMany(resource, { ids: getRelatedIds(data, field) })
        .then(({ data }) =>
            data.reduce((acc, post) => {
                acc[post.id] = post;
                return acc;
            }, {})
        );

export const getRelatedIds = (records, field) =>
    Array.from(
        new Set(
            records
                .filter(record => record[field] != null)
                .map(record => record[field])
                .reduce((ids, value) => ids.concat(value), [])
        )
    );

export default fetchRelatedRecords;
