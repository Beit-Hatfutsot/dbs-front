#!/usr/bin/env python
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
import os, json

# you need to set the following environment variables prior to running:
# SEL_CAP={\"browser\":\"Edge\",\"browser_version\":\"15.0\",\"os\":\"Windows\",\"os_version\":\"10\",\"resolution\":\"1280x1024\"}
# SEL_EXEC=http://username:password@hub.browserstack.com:80/wd/hub
# SEL_URLS=http://test.dbs.bh.org.il/,http://test.dbs.bh.org.il/search?q=Cohen,http://test.dbs.bh.org.il/familyname/cohen

desired_cap = json.loads(os.environ["SEL_CAP"])

driver = webdriver.Remote(

    command_executor=os.environ["SEL_EXEC"],
    desired_capabilities=desired_cap)

for i, url in enumerate(os.environ["SEL_URLS"].split(",")):
    filename="screenshot={}.png".format(i)
    print("saving {} from url {}".format(i, url))
    driver.get(url)
    driver.save_screenshot(filename)

driver.quit()
