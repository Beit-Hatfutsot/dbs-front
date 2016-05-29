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

def deploy(branch='dev', api_server=None):
    local('npm install && bower install')
    local('grunt karma')
    local('grunt build-dist')
    local('tar czf /tmp/bhs-client-dist.tgz public')
    put('/tmp/bhs-client-dist.tgz', 'client')
    with cd('client'):
        try:
            run('mv public public-`date +%d.%m.%y-%H:%M:%S`')
        except:
            pass
        run('tar xzf bhs-client-dist.tgz')
        # update the api servier address
        if not api_server:
            try:
                api_server = API_SERVERS[env.host_string]
            except KeyError:
                print "couldn't figure out the api server address"
        # update the API server address
        if api_server and api_server != DEFAULT_APISERVER:
            run('sed -i "s/{}/{}/g" dist/scripts/*.scripts.js'.format(
                DEFAULT_APISERVER, api_server))

