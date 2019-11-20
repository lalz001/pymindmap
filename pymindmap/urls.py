#-*-coding:utf-8-*- 
from __future__ import absolute_import
import tornado.httpserver  
from tornado.web import StaticFileHandler, url
import tornado.ioloop  
from .api import index
from .api import picture
from .api import minder
from .api import folder
import os

settings = dict(
    template_path=os.path.join(os.path.dirname(__file__), "templates"),
    static_path=os.path.join(os.path.dirname(__file__), "frontend/dist"),
    static_url_prefix='/static/',
    debug=True,
    compress_response=True
    # login_url='/login',
)

handlers = [ 
    # App单页面应用
    (r"/", index.index),  
    # minder API
    (r"/api/minder",minder.minder),
    (r"/api/exec",minder.execcode),
    (r"/api/exec/([^/]+)?", minder.execcode),
    (r"/api/socketminder",minder.socketminder),
    (r"/api/callsocketminder",minder.callsocketHandler),
    # folder API
    (r"/api/folder",folder.folder),
    # picture API
    (r"/api/static/(.*)", picture.minderFile, {"path":"./resources/pictures"}) ,
    (r"/api/picture", picture.picture) ,
    # static
    (r"/static/(.*)", StaticFileHandler,
     {"path": settings['static_path']}),

    # Error
    (r".*", index.NotFoundErrorHandler),
  
]