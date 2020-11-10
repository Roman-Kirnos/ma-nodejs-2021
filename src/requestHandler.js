const { parse: parseQuery } = require('querystring');
const { URL } = require('url');
const router = require('./router');

function internalServerError(res, err) {
  const errMess = { message: 'Internal error occurred' };
  if (process.env.NODE_ENV === 'development') errMess.Error = err;

  res.setHeader('Content-Type', 'application/json');
  res.statusCode = 500;
  res.write(JSON.stringify(errMess));
  res.end();
}

module.exports = async (request, response) => {
  try {
    const { url } = request;
    const parsedUrl = new URL(url, process.env.ORIGIN);
    const queryParams = parseQuery(parsedUrl.search.substr(1));

    let body = [];

    request
      .on('error', err => {
        throw new Error(err);
      })
      .on('data', chunk => {
        body.push(chunk);
      })
      .on('end', () => {
        body = Buffer.concat(body).toString();

        router(
          {
            ...request,
            body: body ? JSON.parse(body) : {},
            url,
            queryParams,
          },
          response,
        );
      });
  } catch (error) {
    console.log(error);
    internalServerError(response, error);
  }
};