const fs = require('fs'); //file system
const http = require('http'); // server
const url = require('url');
const slugify = require('slugify');

const replaceTemplate = require('./final/modules/replaceTemplate.js');
////////////////////////////file

// Synchronous way-blocking code

const textIn = fs.readFileSync('./starter/txt/input.txt', 'utf-8');
console.log(textIn);

// const textOut=`This is what we know about the avocado: ${textIn}.\n created on ${Date.now()}`;
// fs.writeFileSync('./final/txt/output.txt',textOut);
// console.log('file written');

//non blocking asynchronous way

// fs.readFile("./final/txt/start.txt", "utf-8", (err, data1) => {

//   fs.readFile(`./final/txt/${data1}.txt`, "utf-8", (err, data2) => {
//     console.log(data2);
//     fs.readFile(`./final/txt/appenddd.txt`, "utf-8", (err, data3) => {
//         if (err) return console.log("ERROR!!");
//       console.log(data3);

//       fs.writeFile("./final/txt/final.txt",`${data2}\n${data3}`,"utf-8",(err) => {
//           console.log("files has been written");
//         }
//       );
//     });
//   });
// });
// console.log("loading reading text");

/////////////////////////////////////////////////////////////

//synchronous way
const tempOverview = fs.readFileSync(`${__dirname}/final/templates/template-overview.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/final/templates/template-product.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/final/templates/template-card.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/starter/dev-data/data.json`, 'utf-8'); //./final/dev-data/data.json or `${__dirname}/dev-data/data.json`
const dataObj = JSON.parse(data);
const slugs = dataObj.map((ele) => slugify(ele.productName, { lower: true }));
console.log(slugs);

////server

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
