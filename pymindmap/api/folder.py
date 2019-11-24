#-*-coding:utf-8-*-
from __future__ import absolute_import
import json
import tornado.web  
import os
import time
import math
import random
import hashlib
import chardet
import sys
from ..options import default_options
mindmappath = default_options.mindmappath
if not os.path.exists(mindmappath):
    print('create mindmappath folder')
    os.makedirs(mindmappath)

python_version_2 = sys.version_info< (3, 0)

def get_filedetail(dirname):
    if python_version_2 :
        hashpath=hashlib.md5(os.path.abspath(dirname)).hexdigest()
    else:
        hashpath=hashlib.md5(os.path.abspath(dirname).encode('utf-8')).hexdigest()

    return {
      'name':os.path.basename(dirname).strip(".km"),
      'sub': os.path.basename(dirname) ,
      'type': "folder" if os.path.isdir(dirname) else "minder",
      'path':os.path.abspath(dirname) ,
      'hashpath':hashpath,
      'nodes':[get_filedetail(dirname + '/' + name) for name in os.listdir(dirname)] if os.path.isdir(dirname) else []
    }
def get_filetrunk(dirname):
    list = [dirname]
    for root, dirs, files in os.walk(dirname, topdown=False):
        for name in dirs:
            list.append(os.path.join(root, name))
    return list

# print(get_filetrunk(mindmappath),mindmappath,get_filedetail(mindmappath))

def get_filepath(id):
    dirname = mindmappath
    for root, dirs, files in os.walk(dirname, topdown=False):
        for name in files:
            if python_version_2 :
                path = os.path.join(os.path.abspath(root), name)
            else:
                path = os.path.join(os.path.abspath(root), name).encode('utf-8')            
            if hashlib.md5(path).hexdigest() == id:
                return path


#（2， 36）之间的进制转换
def converting(source_num, source_hex, target_hex):
    # （2， 36）之间的进制转换
    if source_hex > 36 or source_hex < 2:
        return '2 <= source_hex <= 36'
    if target_hex > 36 or target_hex < 2:
        return '2 <= target_hex <= 36'
    str_36 = '0123456789abcdefghijklmnopqrstuvwxyz'
    dict_36 = {}
    for i in range(len(str_36)):
        dict_36[str_36[i]] = i
    str_b = str_36[:target_hex]
    result = ''
    source_str = str(source_num).lower()
    decimal_num = 0
    for i in range(len(source_str)):
        decimal_num += dict_36[source_str[-i-1]] * (source_hex ** i)
    quotient_int = decimal_num
    while quotient_int:
        remainder = quotient_int % target_hex
        quotient_int = quotient_int // target_hex
        result = str_b[remainder] + result
        if quotient_int and quotient_int < target_hex:
            result = str_b[quotient_int] + result
    return result
def getrandom():
    a=  int(round(time.time() * 1000)) 
    b = int(math.floor(random.random()* 1000000))
    # data = int(round(time.time() * 1000)) * 1000000 + math.floor(random.random()* 1000000)
    data = str(a) + str(b)
    # print(str(data),a,b)
    return converting(data,10,36)

class folder(tornado.web.RequestHandler):  
    def get(self):   
        want = self.get_arguments("ask")[0]  
        if want =='detail': 
            a = {'folder':get_filedetail(mindmappath)['nodes']}
        if want =="trunk":
            a = {'folder':get_filetrunk(mindmappath)}
        self.finish(a)  
    def post(self):
        body = json.loads(self.request.body.decode(chardet.detect(self.request.body)["encoding"]))
        name = body["name"]
        path = body["path"]
        method = body["method"]
        # print(name,path,method)
        if method == 'addfolder':
            os.mkdir(os.path.join(path,name))
            return
        if method == 'addminder':
            minder = {"minder":{"root":{"data":{'id': getrandom(), 'created': int(round(time.time() * 1000)), 'text': "中心主题"},"children":[]},"template":"right","theme":"fresh-green-compat","version":"1.4.43"},"buildno":0,"resultdata":{}}
            # print(minder)
            with open(os.path.join(path,name),'w') as f:
                f.write(json.dumps(minder))
            return
        if method == 'renamefolder':
            newpath = os.path.join(os.path.dirname(path),name)
            os.rename(path,newpath)
            return
        if method == 'renameminder':
            newpath = os.path.join(os.path.dirname(path),name)
            os.rename(path,newpath)
            return
        if method == 'delfolder': 
            os.removedirs(path)
            return
        if method == 'delminder':
            os.remove(path)
            return
        if method == 'downloadminder':
            template="""
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>仓颉</title>
	<link href="https://cdn.jsdelivr.net/gh/lalz001/pymindmap/pymindmap/frontend/dist/favicon.ico" type="image/x-icon" rel="shortcut icon">
    <link href="https://cdn.bootcss.com/twitter-bootstrap/3.3.4/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.bootcss.com/angular-ui-tree/2.22.6/angular-ui-tree.min.css" rel="stylesheet">
    <link href="https://cdn.bootcss.com/codemirror/4.8.0/codemirror.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/gh/fex-team/hotbox/hotbox.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/kityminder-core@1.4.50/dist/kityminder.core.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/gh/zhangbobell/color-picker/dist/color-picker.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/lalz001/pymindmap/pymindmap/frontend/dist/kityminder.editor.min.css">    
    <style>
        html {
            background: aliceblue;
        }
    </style>
</head>
<body ng-app="myapp">
    <div id="mobile-nav-menu" ng-show="$root.toggleNav">
        <sidebar></sidebar>
    </div>
    <div id="content" ng-class="{'active': !$root.toggleNav}">
        <div ui-view></div>
    </div>
</body>
<script src="https://cdn.bootcss.com/jquery/2.2.4/jquery.min.js"></script>
<script src="https://cdn.bootcss.com/angular.js/1.7.8/angular.min.js"></script>
<script src="https://cdn.bootcss.com/angular-ui-router/0.4.3/angular-ui-router.min.js"></script>
<script src="https://cdn.bootcss.com/angular-websocket/2.0.1/angular-websocket.min.js"></script>
<script src="https://cdn.bootcss.com/angular-ui-bootstrap/0.12.1/ui-bootstrap-tpls.min.js"></script>
<script src="https://cdn.bootcss.com/angular-ui-tree/2.22.6/angular-ui-tree.min.js"></script>
<script src="https://cdn.bootcss.com/codemirror/4.8.0/codemirror.min.js"></script>
<script src="https://cdn.bootcss.com/codemirror/5.48.4/mode/python/python.min.js"></script>
<script src="https://cdn.bootcss.com/codemirror/5.48.4/mode/sql/sql.min.js"></script>
<script src="https://cdn.bootcss.com/codemirror/5.48.4/addon/comment/comment.js"></script>
<script src="https://cdn.bootcss.com/codemirror/5.48.4/addon/edit/matchbrackets.min.js"></script>
<script src="https://cdn.bootcss.com/angular-ui-codemirror/0.2.3/ui-codemirror.min.js"></script>
<script src="https://cdn.bootcss.com/marked/0.7.0/marked.min.js"></script>
<script src="https://cdn.bootcss.com/lodash.js/4.17.15/lodash.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/kity@2.0.4/dist/kity.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/fex-team/hotbox/hotbox.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/kityminder-core@1.4.50/dist/kityminder.core.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/zhangbobell/color-picker/dist/color-picker.min.js"></script>
<script src="https://cdn.bootcss.com/hammer.js/2.0.8/hammer.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/lalz001/pymindmap/pymindmap/frontend/dist/kityminder.editor.min.js"></script>
<script>
    var app = angular.module('myapp',['ui.router','kityminderEditor'])
        .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
            $urlRouterProvider.otherwise('printers');
            $stateProvider
            .state('home', {
                url: '/home',
                template: '这是首页页面',
            })
            .state('printers',{
                url: '/printers?kityID',
                cache:false,
                template:'<kityminder-editor></kityminder-editor>'
            })
        }])
    app.run(fun)
    function fun($rootScope){	    
        //定义成变量
        $rootScope.minder = ####minder####
    }
</script>
</html>
"""          
            with open(path,'rb') as f:
                minderdata = f.read()
            if not python_version_2 :
                minderdata = minderdata.decode(chardet.detect(minderdata)["encoding"])  
            # print(type(minderdata),minderdata)
            self.write(template.replace('####minder####',minderdata))

        
        