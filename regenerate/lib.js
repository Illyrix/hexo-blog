const nodegit = require('nodegit')
const path = require('path')
const fs = require('fs')
const os = require('os')
const process = require('process')
const child = require('child_process')
const rimraf = require('rimraf')

const configRaw = require('./config.json')
const logFile = 'regenerate/run.log'
// const publicDir =  path.join(__dirname, '..', 'public')
let config = {};

(function loadConfig() {
  if (!configRaw.remote || !configRaw.remote.url) {
    throw new Error('no chosen remote')
  }
  if (!configRaw.target) {
    throw new Error('no target dir chosen')
  }
  if (!configRaw.webhook || !configRaw.webhook.port || !configRaw.webhook.secret) {
    throw new Error('webhook config is invalid')
  }
  config.remote = { url: configRaw.remote.url.toString() }
  config.remote.path = configRaw.remote.path?configRaw.remote.path.toString():''
  config.target = configRaw.target.toString()
  config.buildParams = configRaw.buildParams?configRaw.buildParams:[]
  config.webhook = configRaw.webhook
})()

/** 
 * @param options options used in nodegit.Clone?
*/
async function clonePostsToTarget(options) {
  const targetDir = mkTmpDir('hexo-blog-posts')
  const repo = await nodegit.Clone(config.remote.url, targetDir)
  const workdir = repo.workdir()
  const postDir = path.join(workdir, config.remote.path)
  try {
    const posts = fs.readdirSync(postDir)
    for (let file of posts) {
      fs.copyFileSync(path.join(postDir, file), path.join(__dirname, '..', config.target, file))
    }
  } catch (e) {
    throw new Error(`error occurs on copying posts, check if remote post dir exists or target path extsts? err:${e}`)
  } finally {
    cleanTmpDir(targetDir)
  }
}

function mkTmpDir(subname) {
  return fs.mkdtempSync(`${os.tmpdir()+path.sep}${subname}-`)
}

function cleanTmpDir(dir) {
  rimraf.sync(dir)
}

// TODO support buildParams
async function generate() {
  const cwd = process.cwd()
  process.chdir(path.join(__dirname, '..'))
  await new Promise((r, j) => {
    child.exec('npm run build', (err, stdout, stderr) => {
      if (err) {
        j(new Error(`error on building. err:${err}, stdout:${stdout}, stderr:${stderr}`))
      }
      r()
    })
  }).finally(() => {
    process.chdir(cwd)
  })
}

function fileLog(level, msg) {
  try {
    fs.appendFileSync(path.join(__dirname, '..', logFile), `${new Date().toLocaleString()}[${level.toString().toUpperCase()}] ${msg}`)
  } catch (err) {
    console.log(`Erorr: fail to write log. err:${err} level:${level} msg:${msg}`)
  }
}

async function exec() {
  // TODO: backup /public
  await clonePostsToTarget(config.remote.url)
  await generate()
  // TODO: recovery /public when error occurs
  // TODO: delete tmp /public finally
}

module.exports = {
  exec,
  config,
  fileLog
}