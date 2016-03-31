from __future__ import with_statement
import os
from datetime import datetime
import logging

from fabric.api import *

API_SERVERS = {'bhs-dev': 'test-api.myjewishidentity.org',
               'bhs-prod': 'api.dbs.bh.org.il'}
env.user = 'bhs'

env.now = datetime.now().strftime('%Y%m%d-%H%M')

def deploy(branch='dev', api_server=None):
    local('npm install && bower install')
    local('grunt karma')
    local('grunt build')
    local('tar czf /tmp/bhs-client-public.tgz public')
    put('/tmp/bhs-client-public.tgz', 'client')
    with cd('client'):
        try:
            run('mv public public-`date +%d.%m.%y-%H:%M:%S`')
        except:
            pass
        run('tar xzf bhs-client-public.tgz')
        # update the api servier address
        if not api_server:
            try:
                api_server = API_SERVERS[env.host_string]
            except KeyError:
                print "couldn't figure out the api server address"
        if api_server:
            run('sed -i "s/localhost:5000/{}/g" public/js/bhsclient.js'.format(api_server))
            run('sed -i "s/localhost:5000/{}/g" public/js/bhsclient.min.js'.format(api_server))

