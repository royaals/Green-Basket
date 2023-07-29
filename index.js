const fs = require('fs'); //file system
const http = require('http'); // server
const url = require('url');
const slugify = require('slugify');

const replaceTemplate = require('./final/modules/replaceTemplate.js');


const textIn = fs.readFileSync('./starter/txt/input.txt', 'utf-8');


//synchronous way
const tempOverview = fs.readFileSync(`${__dirname}/final/templates/template-overview.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/final/templates/template-product.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/final/templates/template-card.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/starter/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);
const slugs = dataObj.map((ele) => slugify(ele.productName, { lower: true }));


const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    const cardsHtml = dataObj.map((ele) => replaceTemplate(tempCard, ele)).join('');
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
    res.end(output);
  } else if (pathname === '/product') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);
  } else if (pathname === '/api') {
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(data);
  } else {
    res.writeHead(404, {
      //404 not found
      'Content-type': 'text/html',
      'my-header': 'hello world',
    });
    res.end('<h1>page cannot be found </h1>');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('listening to request on port 8000');
});
