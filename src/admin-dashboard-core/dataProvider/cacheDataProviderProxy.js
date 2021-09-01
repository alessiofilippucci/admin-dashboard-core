const fiveMinutes = 5 * 60 * 1000;

export default (
    dataProvider,
    duration = fiveMinutes
) =>
    new Proxy(dataProvider, {
        get: (target, name) => {
            if (typeof name === 'symbol') {
                return;
            }
            return (resource, params) => {
                if (
                    name === 'getList' ||
                    name === 'getMany' ||
                    name === 'getOne'
                ) {
                    // @ts-ignore
                    return dataProvider[name](resource, params).then(
                        response => {
                            const validUntil = new Date();
                            validUntil.setTime(validUntil.getTime() + duration);
                            response.validUntil = validUntil;
                            return response;
                        }
                    );
                }
                return dataProvider[name](resource, params);
            };
        },
    });
