from __future__ import with_statement
import os
from datetime import datetime
import logging

from fabric.api import *
FRONTEND_BUCKET = {'test': 'gs://test.dbs.bh.org.il',
                    'live': 'gs://dbs.bh.org.il'}
env.user = 'bhs'

env.now = datetime.now().strftime('%Y%m%d-%H%M')

def deploy(conf='test'):
    local('npm install && bower install')
    local('grunt karma')
    local('grunt build-dist:' + conf)
    local('gsutil rsync -r dist ' + FRONTEND_BUCKET[conf])
    local('gsutil cp dist/index.html ' + FRONTEND_BUCKET[conf]),
