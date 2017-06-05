#!/usr/bin/env python
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
import os

desired_cap = {'browser': 'chrome', 'build': 'First build', 'browserstack.debug': 'true' }

driver = webdriver.Remote(
    command_executor='http://orihoch1:JAUxNnfsZfGpFSqe8tex@hub.browserstack.com:80/wd/hub',
    desired_capabilities=desired_cap)

for i, url in enumerate(os.environ["URLS"].split(",")):
    filename="screenshot={}.png".format(i)
    print("saving {} from url {}".format(i, url))
    driver.get(url)
    driver.save_screenshot(filename)

driver.quit()
