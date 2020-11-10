const inputData = require('./inputData.json');

const { task1: sort, task2: biggestPrice, task3 } = require('./tasks');

function boot(data, param, value) {
  const sortedArray = sort(data, param, value);
  console.log(sortedArray);

  const totalArray = task3(sortedArray);
  console.log(totalArray);

  console.log(biggestPrice);
}

boot(inputData, 'type', 'socks');
