#-*-coding:utf-8-*-
from __future__ import absolute_import
import tornado.web  
from tornado import gen
from tornado.httpclient import AsyncHTTPClient
import os

from ..options import default_options
picturepath = default_options.picturepath

if not os.path.exists(picturepath):
    print('create picturepath folder')
    os.makedirs(picturepath)


class minderFile(tornado.web.StaticFileHandler):    
    def set_extra_headers(self, path):  
        self.set_header("Cache-control", "no-cache")  

class picture(tornado.web.RequestHandler):
    @gen.coroutine 
    def get(self,include_body=True):  
        url= self.get_arguments('url')[0]
        if url.endswith('jpg') or url.endswith('png'):
            self.set_header('Content-Type', 'image/png')
        http_client = AsyncHTTPClient()
        response = yield http_client.fetch(url)    
        for chunk in [response.body]:
            self.write(chunk)
            yield self.flush()
    def post(self):
        filename = self.request.files['upload_file'][0]['filename']
        with open(picturepath + '/' +filename,'wb') as f:
            f.write(self.request.files['upload_file'][0]['body'])
        # print(filename)
        # print(123)
        self.finish({
            'errno': 0,
            'msg':'ok',
            'data':{'url':'api/static/%s'%filename}
        })
