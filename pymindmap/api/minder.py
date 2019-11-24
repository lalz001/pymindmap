#-*-coding:utf-8-*-
from __future__ import absolute_import
import json
import tornado.web 
from tornado import ioloop
from tornado import websocket
from tornado import gen
from tempfile import NamedTemporaryFile
import subprocess
import time
# import fcntl
import functools
import os
import sys
import hashlib
import re
import platform
import chardet

from ..options import default_options
_timeout = default_options.timeout

class GenericSubprocess (object):
    def __init__ ( self, timeout=-1, **popen_args ):
        self.args = dict()
        self.args["stdout"] = subprocess.PIPE
        self.args["stderr"] = subprocess.PIPE
        self.args["close_fds"] = True
        self.args.update(popen_args)
        self.ioloop = None
        self.expiration = None
        self.pipe = None
        self.timeout = timeout
        self.streams = []
        self.has_timed_out = False
    def start(self):
        """Spawn the task.
        Throws RuntimeError if the task was already started."""
        if not self.pipe is None:
            raise RuntimeError("Cannot start task twice")
        self.ioloop = tornado.ioloop.IOLoop.instance()
        if self.timeout > 0:
            self.expiration = self.ioloop.add_timeout( time.time() + self.timeout, self.on_timeout )
        self.pipe = subprocess.Popen(**self.args)
        self.streams = [ (self.pipe.stdout.fileno(), []),
                             (self.pipe.stderr.fileno(), []) ]
        for fd, d in self.streams:
        #     flags = fcntl.fcntl(fd, fcntl.F_GETFL)| os.O_NDELAY
        #     fcntl.fcntl( fd, fcntl.F_SETFL, flags)
            self.ioloop.add_handler( fd,
                                     self.stat,
                                     self.ioloop.READ|self.ioloop.ERROR)
    def on_timeout(self):
        self.has_timed_out = True
        self.cancel()
    def cancel (self ) :
        """Cancel task execution
        Sends SIGKILL to the child process."""
        try:
            self.pipe.kill()
        except:
            pass
    def stat( self, *args ):
        '''Check process completion and consume pending I/O data'''
        self.pipe.poll()
        if not self.pipe.returncode is None:
            '''cleanup handlers and timeouts'''
            if not self.expiration is None:
                self.ioloop.remove_timeout(self.expiration)
            for fd, dest in  self.streams:
                self.ioloop.remove_handler(fd)
            '''schedulle callback (first try to read all pending data)'''
            self.ioloop.add_callback(self.on_finish)
        for fd, dest in  self.streams:
            while True:
                try:
                    data = os.read(fd, 4096)
                    if len(data) == 0:
                        break
                    dest.extend([data])
                except:
                    break
    @property
    def stdout(self):
        return self.get_output(0)
    @property
    def stderr(self):
        return self.get_output(1)
    @property
    def status(self):
        return self.pipe.returncode
    def get_output(self, index ):
        # print(self.streams[index])
        return "".join((_.decode() for _ in self.streams[index][1]))
    def on_finish(self):
        raise NotImplemented()
class Subprocess (GenericSubprocess):
    def __init__ ( self, callback, *args, **kwargs):
        self.callback = callback
        self.done_callback = False
        GenericSubprocess.__init__(self, *args, **kwargs)
    def on_finish(self):
        if not self.done_callback:
            self.done_callback = True
            '''prevent calling callback twice'''
            self.ioloop.add_callback(functools.partial(self.callback, self.status, self.stdout, self.stderr, self.has_timed_out))


from .folder import get_filepath


class minder(tornado.web.RequestHandler):
    # base = os.path.dirname(__file__)
    base = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
    # with open( os.path.join(base, 'default.km') ,'r') as f:
    with open(  os.path.join(base, 'templates/default.km') ,'rb' ) as f:
        default = f.read()
        default = json.loads(default.decode(chardet.detect(default)["encoding"]))
    def get(self):  
        # 判断是否包含minder的idreturn
        if self.get_arguments('kityID'):
            id = self.get_arguments('kityID')[0]
            # 判断minder的id是否在'resources/minders'文件夹中
            if get_filepath(id):
                with open(get_filepath(id),'rb') as f:
                    dic = f.read()
                    dic = json.loads(dic.decode(chardet.detect(dic)["encoding"]))
                return self.finish(dic)
        return self.finish(self.default)    
        # with open( os.path.join(base, 'deaultminder.km') ,'r') as f:
        #     dic = json.loads(f.read())
        #     self.finish(dic)            
    def post(self):
        if self.get_arguments('kityID'):
            id = self.get_arguments('kityID')[0]
            if get_filepath(id):
                with open(get_filepath(id),'wb') as f:
                    f.write(self.request.body)


def _sendstatus(status,kityId,id):
    ioloop.IOLoop.current().add_callback(socketminder.send_message, json.dumps({
        'kityID':kityId,
        'buildno':0,
        'method':'setResourceById',
        'param':{
            'id':id,
            'data':status
        }
    }))
    

def _addmd(md,kityId,id):
    ioloop.IOLoop.current().add_callback(socketminder.send_message, json.dumps({
        'kityID':kityId,
        'buildno':0,
        'method':'setResultdataById',
        'param':{
            'id':id,
            'md':md
        }
    }))
    
class execcode(tornado.web.RequestHandler): 
    runningpool={}
    
    def get(self):
        if(platform.system()=='Windows'):
            print('Windows系统不支持执行子任务')
            return
        self.finish({'runningpool':list(self.runningpool.keys())})

    @gen.coroutine 
    def post(self):
        if(platform.system()=='Windows'):
            print('Windows系统不支持执行子任务')
            return
        kityId = self.get_arguments('kityID')
        if len(kityId)==0:
            return 
        kityId = kityId[0] 
        request = json.loads(self.request.body.decode())
        id = request['id']
        code = request.get("code",'')
        # print(kityId,id)
        key = kityId+"_"+id
        if self.runningpool.get(key):
            return
        def run( status, stdout, stderr, has_timed_out) :
            del self.runningpool[key]
            os.remove(path)
            if has_timed_out:
                _sendstatus('timeout',kityId,id)
                return
            if status!=0 :
                _addmd(str(stderr),kityId,id)
                _sendstatus('err',kityId,id)
                return
            if len(stdout)!=0:
                _addmd(str(stdout),kityId,id)
            _sendstatus('finish',kityId,id)
            
        # with open(path,'w') as f:
        with NamedTemporaryFile('w+t',delete=False) as f:
            f.write(code)
            path = f.name
        self.runningpool[key] = Subprocess( run, timeout=_timeout, args=[ "python", path ,kityId ,id ,str(default_options.port) ] )
        self.runningpool[key].start()
        _sendstatus('running',kityId,id)



        # Subprocess( run, timeout=600, args=[ "python", path ,kityId ,id ] ).start()

    def delete(self,key):
        if(platform.system()=='Windows'):
            print('Windows系统不支持执行子任务')
            return
        if self.runningpool.get(key):
            self.runningpool[key].cancel()



class callsocketHandler(tornado.web.RequestHandler):
    def post(self):
        data = self.request.body
        server = ioloop.IOLoop.current()
        server.add_callback(socketminder.send_message, data)
        self.set_status(200)
        self.finish()

class socketminder(websocket.WebSocketHandler):
    live_web_sockets = set()
    def check_origin(self, origin):
        return True
    def open(self):
        self.set_nodelay(True)
        self.live_web_sockets.add(self)
        self.write_message("--heartbeat--")

    def on_message(self, message):
        # print(message)
        self.send_message(message)

    def on_close(self):
        # print("WebSocket closed")
        pass

    @classmethod
    def send_message(cls, message):
        removable = set()
        for ws in cls.live_web_sockets:
            if not ws.ws_connection or not ws.ws_connection.stream.socket:
                removable.add(ws)
            else:
                ws.write_message(message)
        for ws in removable:
            cls.live_web_sockets.remove(ws)

       