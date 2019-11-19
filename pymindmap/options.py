#-*-coding:utf-8-*-
from __future__ import absolute_import

import types
from tornado.options import define
from tornado.options import options
from tornado.options import parse_command_line
import os
import sys
define("port", default=5555,
       help="run on the given port", type=int)
define("address", default='',
       help="run on the given address", type=str)
define("mindmappath",default='resources/minders',
       help="place to store and read mindmap",type=str)
define("timeout",default=600,
       help="task will kill when timeout, 0 runs forever",type=int)
define("picturepath",default='resources/pictures',
       help="place to store upload piture",type=str)


def apply_options():
    argv = list(sys.argv)
    prog_name = os.path.basename(argv[0])
    # "apply options passed through the configuration file"
    argv = list(filter(is_pymindmap_option, argv))
    # parse the command line to get --conf option
    parse_command_line([prog_name] + argv)

def is_pymindmap_option(arg):
    name, _, value = arg.lstrip('-').partition("=")
    name = name.replace('-', '_')
#     print(123,name,value)
    return hasattr(options, name) 

apply_options()
default_options = options