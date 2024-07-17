export class MyApiConnectorMock {
    __errors__ = {};
    __results__ = {};

    async processQuery() {
        return new Promise((resolve, reject) => {
            // console.log(this.__errors__.processQuery);
            if (this.__errors__.processQuery !== undefined) {
                reject(this.__errors__.processQuery);
            } else if (this.__results__.processQuery !== undefined) {
                resolve(this.__results__.processQuery);
            } else {
                resolve('result');
            }
        });
    }

    async processMutation() {
        return new Promise((resolve, reject) => {
            // console.log(this.__errors__.processQuery);
            if (this.__errors__.processMutation !== undefined) {
                reject(this.__errors__.processMutation);
            } else if (this.__results__.processMutation !== undefined) {
                resolve(this.__results__.processMutation);
            } else {
                resolve('result');
            }
        });
    }

    processResult(result) {
        return result;
    }
}
