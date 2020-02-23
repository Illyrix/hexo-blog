// for initializing clean project from remote repo
// make sure regenerate/config.json has correctly been set

const { exec, fileLog } = require('./lib');

(function () {
  fileLog('Info', 'Initializing posts')
  exec()
    .then(() => {
      console.log('success init hexo')
      fileLog('Info', 'success init hexo')
    })
    .catch(err => {
      console.log(`Erorr: ${err}`)
      fileLog('Error', err.message)
    })
})()
