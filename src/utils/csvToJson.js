const { Transform } = require('stream');

function createCsvToJson() {
  let isNotFirst = false;
  let insertLineSeparator = false;
  let columnHeaders = [];

  const transform = (chunk, encoding, callback) => {
    let result = '';

    const stringProduct = chunk.toString('utf8');
    console.log(stringProduct);
    if (columnHeaders.toString() === stringProduct) return callback();

    const getFullProduct = items => {
      const fullProduct = {
        type: items[columnHeaders.indexOf('type')],
        color: items[columnHeaders.indexOf('color')],
        quantity: items[columnHeaders.indexOf('quantity')],
      };

      if (items[columnHeaders.indexOf('isPair')] === 'true') {
        fullProduct.priceForPair = items[columnHeaders.indexOf('price')];
      } else fullProduct.price = items[columnHeaders.indexOf('price')];

      return fullProduct;
    };

    if (isNotFirst) {
      if (insertLineSeparator) result += ',\n';
      else insertLineSeparator = true;

      const product = getFullProduct(stringProduct.split(','));
      result += `${JSON.stringify(product)}`;
    } else {
      result += '[';
      isNotFirst = true;
      columnHeaders = stringProduct.split(',');
    }

    console.log(result);
    return callback(null, result);
  };

  const flush = callback => {
    callback(null, ']');
  };

  return new Transform({ transform, flush });
}

module.exports = createCsvToJson;
