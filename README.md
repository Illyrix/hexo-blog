## Hexo-Blog
这个仓库只是博客的环境，会ignore掉posts下的md；并且提供了一个脚本，在博客repo更新时通过hook来通知这个脚本拉取md文件并重新generate。

* 部署
  1. `yarn`
  2. 参照 config.default.js 新建 config.js 在 regenerate 目录下
  3. nginx location / root 设置为 public, 并 `service nginx reload` / `systemctl reload nginx`
  4. nginx location /webhook 设置为 `proxy_pass http://127.0.0.1:9831` 其中 9831 和 config.json 对应字段匹配
  5. `yarn initposts`
  6. `yarn webhook`
  7. 使用 `pm2 status·stop·logs index` 控制 webhook 的监听脚本

* todo list
  * 支持private的仓库
  * 支持build的参数
  * 编译前备份public目录
  * auto config tool

* 配置
  * `regenerate/config.js` 支持 nodegit 设置 callback functions
  * `_config.yml`