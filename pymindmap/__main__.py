#-*-coding:utf-8-*-
from __future__ import absolute_import
from __future__ import print_function

from pymindmap.command import MindmapCommand

def main():
    mindmap = MindmapCommand()
    mindmap.execute_from_commandline()



if __name__ == "__main__":
    main()