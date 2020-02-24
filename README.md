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

  tips:
  * 如果使用 `yarn` 卡在安装 `nodegit` 不动了，建议使用 `cnpm install` 进行安装（使用 npm 换镜像源是不起作用的，因为安装 nodegit 需要 node-pre-gyp 下载预编译的二进制包，大部分在 aws 上）
  * 如果出现 `Error: /lib64/libstdc++.so.6: version `GLIBCXX_3.4.20' not found` 报错，请升级 `/usr/lib64/libstdc++.so.6.0.*` 的版本。可能需要从 gcc 源码手动编译：[参考链接](http://www.metsky.com/archives/164.html)（gcc 源码中科大源有下载）
  * 如果出现 `Error: the SSL certificate is invalid`，传入配置项
    ```javascript
      cloneOptions: {
        fetchOpts: {
          callbacks: {
            certificateCheck: () => 0
          }
        }
      }
    ```

* todo list
  * 支持private的仓库
  * 支持build的参数
  * 编译前备份public目录
  * auto config tool

* 配置
  * `regenerate/config.js` 支持 nodegit 设置 callback functions
  * `_config.yml`