import inflection from 'inflection';

export default (options) => {
    if (!options) {
        return [''];
    }

    const { label, resource, source } = options;
    
    return typeof label !== 'undefined'
        ? [label, { _: label }]
        : typeof source !== 'undefined'
        ? [
              `resources.${resource}.fields.${source}`,
              {
                  _: inflection.transform(source, ['underscore', 'humanize']),
              },
          ]
        : [''];
};
