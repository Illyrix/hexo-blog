const http = require('http')
const createHandler = require('github-webhook-handler')

const { exec, config, fileLog } = require('./lib')
const handler = createHandler({ path: '/webhook', secret: config.webhook.secret })

http.createServer(function (req, res) {
  handler(req, res, function () {
    res.statusCode = 404
    res.end('no such location')
  })
}).listen(config.webhook.port)

handler.on('error', function (err) {
  console.log('Error: ', err.message)
  fileLog('Error', err.message)
})

handler.on('push', function (event) {
  const msg = `Received a push event for ${event.payload.repository.name} to ${event.payload.ref}`
  console.log(msg)
  fileLog('Info', msg)

  exec()
    .then(() => {
      console.log('success update hexo')
      fileLog('Info', 'success update hexo')
    })
    .catch(err => {
      console.log(`Erorr: ${err}`)
      fileLog('Error', err.message)
    })
})
