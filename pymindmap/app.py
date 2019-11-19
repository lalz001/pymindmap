#-*-coding:utf-8-*-
from __future__ import absolute_import
import tornado.web
from tornado import ioloop


from .urls import handlers
from .options import default_options

class Mindmap(tornado.web.Application):
    def __init__(self, options=None, io_loop=None, **kwargs):
        # self.options = options or default_options
        self.options = options or default_options
        kwargs.update(handlers=handlers)
        super(Mindmap, self).__init__(**kwargs)
        self.io_loop = io_loop or ioloop.IOLoop.instance()
        self.started = False
    def start(self):
        self.started = True
        self.listen(self.options.port, address=self.options.address)
        self.io_loop.start()
    def stop(self):
        if self.started:
            self.started = False


if __name__ == '__main__':  
    
    from urls import settings
    mindmap = Mindmap(**settings)
    mindmap.start()
