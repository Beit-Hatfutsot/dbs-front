bhsclient_path = /home/bhs/bhsclient

all: backup install build copy clean

backup:
	if [ -d $(bhsclient_path)/../public ];then \
		cd $(bhsclient_path)/../ && mv public public-old; \
	fi

pull:
	cd $(bhsclient_path) && git pull origin master

install:
	npm install && bower install

build: Gruntfile.js
	cd $(bhsclient_path) && grunt build

copy: 
	cd $(bhsclient_path)/../ && cp -r $(bhsclient_path)/public public

clean: 
	rm -r $(bhsclient_path)/public  
