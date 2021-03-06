// server.js
// const { createServer } = require('http')
// const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
// const Router = require('koa-router');
const express = require('express')

app.prepare().then(() => {
  // createServer((req, res) => {
  //   // Be sure to pass `true` as the second argument to `url.parse`.
  //   // This tells it to parse the query portion of the URL.
  //   const parsedUrl = parse(req.url, true)
  //   const { pathname, query } = parsedUrl

  //   if(pathname === '/students'){
  //     app.render(req, res, '/students', query)
  //   }

  //   if( pathname === '/exams'){
  //     app.render(req, res, '/exams', query)
  //   }

  //   if(pathname === '/profiles'){
  //     app.render(req, res, '/profiles', query)
  //   }

  //   if(pathname === '/'){
  //     app.render(req, res, '/', query)
  //   }
  //   else if (pathname === '/courses') {
  //     app.render(req, res, '/courses', query)
  //   } else if (pathname === '/subject/:id'){
  //     app.render(req, res, '/subject/:id', query)
  //   } 
  //   else {
  //     handle(req, res, parsedUrl)
  //   }
  // }).listen(3000, (err) => {
  //   if (err) throw err
  //   console.log('> Ready on http://localhost:3000')
  // })
  const server = express();


  server.get('*', (req, res) => {
    return handle(req, res)
  })
    
  server.get('/', async (ctx) => {
    await nextApp.render(ctx.req, ctx.res, `/`);
    ctx.respond = false;
  })

  server.get('/courses', async (ctx) => {
    await nextApp.render(ctx.req, ctx.res, `/courses`);
    ctx.respond = false;
  })

  server.listen(3000, (err) => {
    if (err) throw err
    console.log('> Ready on http://localhost:3000')
  })

})
.catch((ex) => {
  console.error(ex.stack)
  process.exit(1)
})