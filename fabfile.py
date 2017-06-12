from __future__ import with_statement
import os
from datetime import datetime
import logging

from fabric.api import *

env.user = 'bhs'
env.use_ssh_config = True
env.now = datetime.now().strftime('%Y%m%d-%H%M')

def deploy(api_server='test'):
    local('npm install && bower install')
    local('gulp test')
    push_dist(api_server)

def push_dist(api_server='test'):
    with shell_env(API_SERVER=api_server):
        local('gulp dist')
    local('tar czf /tmp/bhs-client-dist.tgz dist')
    put('/tmp/bhs-client-dist.tgz', 'client')
    with cd('client'):
        try:
            run('mv dist dist-`date +%d.%m.%y-%H:%M:%S`')
        except:
            pass
        run('tar xzf bhs-client-dist.tgz')
