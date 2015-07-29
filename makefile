bhsclient_path ?= /home/bhs/client/bhsclient

branch ?= master

all: test-user backup pull install build copy clean

test-user:
	runner=`whoami` ; \
	if test $$runner != "bhs"; then \
		exit 1; \
	fi

backup:
	if [ -d $(bhsclient_path)/../public ];then \
		cd $(bhsclient_path)/../ && mv public build-`date +%d.%m.%y-%H:%M:%S`; \
	fi

pull:
	cd $(bhsclient_path) && git checkout $(branch) && git pull origin $(branch)

install:
	npm install && bower install

build: Gruntfile.js
	grunt build

copy: 
	cd $(bhsclient_path)/../ && cp -r $(bhsclient_path)/public public

clean: 
	cd $(bhsclient_path) && rm -r public && rm -r node_modules && rm -r bower_components
