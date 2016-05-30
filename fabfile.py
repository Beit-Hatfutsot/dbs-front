from __future__ import with_statement
import os
from datetime import datetime
import logging

from fabric.api import *
DEFAULT_APISERVER = 'devapi.dbs.bh.org.il'
API_SERVERS = {
               'bhs-dev': DEFAULT_APISERVER,
               '104.155.5.184': DEFAULT_APISERVER,
               'bhs-prod': 'api.dbs.bh.org.il',
               '104.155.4.121': 'api.dbs.bh.org.il',
               }
env.user = 'bhs'

env.now = datetime.now().strftime('%Y%m%d-%H%M')

def deploy(branch='dev', api_server='dev'):
    local('npm install && bower install')
    local('grunt karma')
    local('grunt build-dist:'+api_server)
    local('tar czf /tmp/bhs-client-dist.tgz dist')
    put('/tmp/bhs-client-dist.tgz', 'client')
    with cd('client'):
        try:
            run('mv dist dist-`date +%d.%m.%y-%H:%M:%S`')
        except:
            pass
        run('tar xzf bhs-client-dist.tgz')
