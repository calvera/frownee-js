const dotenv = require('dotenv')
dotenv.config()

const createError = require('http-errors')
const express = require('express')
const { admin, adminRouter } = require('./admin/admin')
const apolloServer = require('./api/server')
const path = require('path')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const sassMiddleware = require('node-sass-middleware')

const indexRouter = require('./routes')
const usersRouter = require('./routes/users')

const PORT = 3000

const start = async () => {
  const app = express()

  app.use(admin.options.rootPath, adminRouter)

  await apolloServer.start()
  apolloServer.applyMiddleware({ app, path: '/api' })

  app.set('views', path.join(__dirname, 'views'))
  app.set('view engine', 'pug')

  app.use(logger('dev'))
  app.use(express.json())
  app.use(express.urlencoded({ extended: false }))
  app.use(cookieParser())
  app.use(sassMiddleware({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    indentedSyntax: true, // true = .sass and false = .scss
    sourceMap: true
  }))
  app.use(express.static(path.join(__dirname, 'public')))

  app.use('/', indexRouter)
  app.use('/users', usersRouter)

  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    next(createError(404))
  })

  // error handler
  app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    // render the error page
    res.status(err.status || 500)
    res.render('error')
  })

  app.listen(PORT, () => {
    console.log(`Admin started on http://localhost:${PORT}${admin.options.rootPath}`)
    console.log(`GraphQL started on http://localhost:${PORT}/api`)
  })
}

process.on('uncaughtException', (err) => {
  console.error(`${(new Date()).toUTCString()} uncaughtException:`, err)
  process.exit(0)
})

process.on('unhandledRejection', (err) => {
  console.error(`${(new Date()).toUTCString()} unhandledRejection:`, err)
})

start()
