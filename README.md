## Hexo-Blog
这个仓库只是博客的环境，会ignore掉posts下的md；并且提供了一个脚本，在博客repo更新时通过hook来通知这个脚本拉取md文件并重新generate。

* todo list
  * 支持private的仓库
  * 支持build的参数
  * 编译前备份public目录
  * auto config tool

* 配置
  * `regenerate/config.json`
  * `_config.yml`