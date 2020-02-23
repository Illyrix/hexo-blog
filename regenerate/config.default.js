module.exports = {
  "remote": {
    "url": "https://github.com/Illyrix/blog.git",
    "path": "posts",
    "cloneOptions": {
      "fetchOpts": {
        "ignoreCertErrors": 0
      }
    }
  },
  "webhook": {
    "secret": "",
    "port": 9831
  },
  "target": "source/_posts",
  "buildParams": []
}