#-*-coding:utf-8-*-
from __future__ import absolute_import
import json
from tornado import gen
import tornado.web  
class index(tornado.web.RequestHandler):
    @gen.coroutine
    def get(self):
        self.render('index.html')

class NotFoundErrorHandler(tornado.web.RequestHandler):
    def get(self):
        self.render('err.html')
        # raise tornado.web.HTTPError(404)

    def post(self):
        self.render('err.html')
        # raise tornado.web.HTTPError(404)