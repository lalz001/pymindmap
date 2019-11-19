pymindmap
==========
## 简介
pymindmap是一个由python控制的脑图编辑工具

首先感谢百度开源的百度脑图https://github.com/fex-team/kityminder-editor
个人针对其做了python后端代码和一部分自己需要的功能

## 安装
```
pip install pymindmap
```

## 额外功能
- 通过修改css代码实现了移动端浏览和放大缩小的手势操作
- 通过websocket推送实现了协同编辑和同步浏览功能
- 增加文件夹侧边栏，从而可以在单页面中创建切换导图以及文件夹，提供了脑图的导出功能，并将导出的脑图的js地址替换为github保障导出脑图无需客户端支持，用户可将导出脑图直接放入静态服务器从而对他人分享
- 增加python代码执行功能，导图中额外提供python控制导图页面的接口，从而让导图更加可交互；并对此提供了执行，停止，全部执行，全部停止等操作，用户可以自行探索
- 增加命令行模式，具体可以通过pymindmap --help查看，并提供pymindmap ps 和 pymindmap kill 命令查看删除导图唤醒的python 进程

### 开发使用
该项目使用前后端分离的方式开发，使用nginx端口转发达成协调
```bash
docker-compose up -d --build
```
To shut down:
```bash
docker-compose down
```
### 本地测试运行
clone到本地后
python -m pymindmap 

### 构建
python setup.py sdist

### 联系作者
问题和建议反馈：
邮件组：lfz163453@163.com
或者在issue下反馈

### 文档docs查看
clone到本地后执行
```
python -m pymindmap --mindmappath=docs/minders --picturepath=docs/pictures
```
