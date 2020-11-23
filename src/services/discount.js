const { promisify } = require('util');

const { sale: SALE } = require('../config');

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function generateDiscount(callback) {
  setTimeout(() => {
    const number = randomNumber(SALE.MIN, SALE.MAX);

    if (number >= SALE.NOT_MORE_THAN) {
      return callback(new Error('Incorrect sale!'));
    }

    return callback(null, number);
  }, SALE.TIME_GENERATE_SALE);
}

function generateValidDiscount(callback) {
  generateDiscount((err, res) => {
    if (err) return generateValidDiscount(callback);

    return callback(null, res);
  });
}

function generateValidDiscountPromise() {
  return promisify(generateValidDiscount);
}

// eslint-disable-next-line consistent-return
async function createDiscount() {
  const promise = generateValidDiscountPromise();
  try {
    return await promise();
  } catch (err) {
    console.log('In discount', err);
  }
}

module.exports = createDiscount;
