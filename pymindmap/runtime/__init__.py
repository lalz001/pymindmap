#-*-coding:utf-8-*-
from __future__ import absolute_import
from tornado.httpclient import HTTPClient 
import sys
import json
def setResource(status,kityId = None ,id = None):
    HTTPClient().fetch("http://localhost:%s/api/callsocketminder"%(sys.argv[3]),method="POST",body=json.dumps({
        'kityID':kityId if kityId else sys.argv[1],
        'buildno':0,
        'method':'setResourceById',
        'param':{
            'id':id if id else sys.argv[2],
            'data':status
        }
    }))
def setLink(link,kityId = None ,id = None):
    HTTPClient().fetch("http://localhost:%s/api/callsocketminder"%(sys.argv[3]),method="POST",body=json.dumps({
        'kityID':kityId if kityId else sys.argv[1],
        'buildno':0,
        'method':'setHyperLinkById',
        'param':{
            'id':id if id else sys.argv[2],
            'url':link
        }
    }))
def setMd(md,kityId = None ,id = None):
    HTTPClient().fetch("http://localhost:%s/api/callsocketminder"%(sys.argv[3]),method="POST",body=json.dumps({
        'kityID':kityId if kityId else sys.argv[1],
        'buildno':0,
        'method':'setResultdataById',
        'param':{
            'id':id if id else sys.argv[2],
            'md':md
        }
    }))
def setImage(link,kityId = None ,id = None):
    HTTPClient().fetch("http://localhost:%s/api/callsocketminder"%(sys.argv[3]),method="POST",body=json.dumps({
        'kityID':kityId if kityId else sys.argv[1],
        'buildno':0,
        'method':'setImageById',
        'param':{
            'id':id if id else sys.argv[2],
            'url':link
        }
    }))
