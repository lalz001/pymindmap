#-*-coding:utf-8-*-
from __future__ import absolute_import
from __future__ import print_function

import os
import sys


from .options import default_options
from .app import Mindmap
from .urls import settings

from tornado.httpclient import HTTPClient 
from .options import default_options
import json

class MindmapCommand(object):
    def __init__(self):
        self.argv = list(sys.argv)
        self.stdout = sys.stdout
        self.stderr = sys.stderr
        self.early_version(self.argv)
        self.help(self.argv)
        self.runningpool(self.argv)
        self.killrunning(self.argv)

    def execute_from_commandline(self):
        self.run_from_argv()

    def run_from_argv(self):
        self.print_banner()
        try:
            mindmap = Mindmap(options=default_options,**settings)
            mindmap.start()
        except (KeyboardInterrupt, SystemExit):
            pass
    
    def early_version(self, argv):
        if '--version' in argv:
            print('1.0.0', file=self.stdout)
            sys.exit(0)
    
    def help(self, argv):
        if '--help' in argv:
            print('1.0.0', file=self.stdout)

    
    def runningpool(self, argv):
        if 'ps' in argv:
            a = HTTPClient().fetch("http://localhost:%s/api/exec"%default_options.port)
            for each in json.loads(a.body.decode())["runningpool"]:
                print(each, file = self.stdout)
            sys.exit(0)
    def killrunning(self, argv):
        if 'kill' in argv:
            if len(argv)==3:
                HTTPClient().fetch("http://localhost:{port}/api/exec/{key}".format(port=default_options.port,key=argv[2]),method="DELETE")
            if len(argv)==2:
                a = HTTPClient().fetch("http://localhost:%s/api/exec"%default_options.port)
                keys = json.loads(a.body.decode())["runningpool"]
                for key in keys:
                    HTTPClient().fetch("http://localhost:{port}/api/exec/{key}".format(port=default_options.port,key=key),method="DELETE")
            sys.exit(0)
    def print_banner(self):
        banner = "Visit me at http://%s:%s"%(default_options.address or 'localhost', default_options.port)
        print(banner, file=self.stdout)