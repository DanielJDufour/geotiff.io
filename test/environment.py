#environment.py

from beryl import click, notify
from beryl import recorder
from host import Localhost
from os import environ
from os.path import abspath, dirname
from PIL import Image
from pyvirtualdisplay import Display
import shlex
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from settings import *
from subprocess import call, check_output, Popen
from time import sleep

@notify
def before_all(context):

    if "DISPLAY" not in environ:
        context.display = Display(visible=0, size=(1024, 768))
        context.display.start()
        print("started display:", context.display)

        display_id = str(context.display.display)
        os.environ["DISPLAY"] = ":" + display_id

        command = "DISPLAY=:" + display_id + "; fluxbox"
        print("starting window manager with command:", [command])
        #call(shlex.split(command))
        Popen("fluxbox")
        print("started window manager")

    context.path_to_recording = "/tmp/beryl_recording.ogv"
    #context.recording = recorder.start(context.path_to_recording)

    context.localhost = Localhost()
    context.localhost.start()
    print("starting localhost server")

    call(shlex.split("killall -9 chrome"))
    options = Options()
    #options.add_argument("--remote-debugging-port=9222")
    options.add_argument("--start-maximized")
    context.driver = webdriver.Chrome(chrome_options=options)
    print("started Chrome")
    context.driver.get("about:blank")

@notify
def after_all(context):
    context.localhost.end()
    context.driver.quit()

    if hasattr(context, "recording"):
        context.recording.terminate()
        print("saved recording to " + context.path_to_recording)

    if hasattr(context, "display"):
        context.display.stop()

@notify
def after_scenario(context, scenario):

    # make sure popup is closed
    context.driver.get("about:blank")
    sleep(0.5)
