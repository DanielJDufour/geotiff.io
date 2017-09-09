#environment.py

from beryl import click, notify
from host import Localhost
from os.path import abspath, dirname
from PIL import Image
from pyvirtualdisplay import Display
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from settings import *
from subprocess import call, check_output
from time import sleep

@notify
def before_all(context):

    context.localhost = Localhost()
    context.localhost.start()

    call( [ "killall", "-9", "chrome" ] )
    options = Options()
    #options.add_argument("--remote-debugging-port=9222")
    options.add_argument("--start-maximized")
    context.driver = webdriver.Chrome(executable_path=path_to_chrome_driver, chrome_options=options)
    #context.driver.get("about:blank")

@notify
def after_all(context):
    context.localhost.end()
    context.driver.quit()

@notify
def after_scenario(context, scenario):

    # make sure popup is closed
    context.driver.get("about:blank")
    sleep(0.5)
