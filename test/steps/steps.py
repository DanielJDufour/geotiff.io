from behave import *
from beryl.contrib.geo.steps import *
from beryl.contrib.web.steps import *
from beryl import click, activate_window, is_text_on_screen, notify, press_backspace, press_enter, type_text
from itertools import izip
from PIL import Image
from subprocess import call
from pytesseract import image_to_string
from time import sleep


@given('loaded website')
def loaded_website(context):
    context.driver.get("localhost:8000")

#@then('load geotiff with name "{name_of_geotiff}"')
#def load_geotiff(context, name_of_geotiff):


# goes to blank page and clicks on it
@notify
def clear(context):
    context.driver.get("about:blank")
    sleep(1)
    click((200,200))

@given("cleared")
@notify
def cleared(context):
    notify("starting cleared")
    context.driver.get("about:blank")
    sleep(1)
    click((200,200))
    click(path_to_icon)
    click("Delete")
    sleep(1)
    click("Yes")

@notify
def getPercentDifference(a, b):
    pairs = izip(a.getdata(), b.getdata())
    dif = sum(abs(c1-c2) for p1,p2 in pairs for c1,c2 in zip(p1,p2))
    ncomponents = a.size[0] * a.size[1] * 3
    percentdiff = (dif / 255.0 * 100) / ncomponents
    return percentdiff

@given("nothing")
@notify
def do_nothing(context):
    pass

#@when("install the extension")
#def install_extension(context):

@when("you click {text}")
@when('click "{text}"')
@notify
def click_text(context, text):
    print("starting click_text with: " + text)
    click(text, webdriver=context.driver, debug=True)

@when("you click {text}")
@when('click "{text}" in "{window_name}" window')
@notify
def click_text_in_window(context, text, window_name):
    print("starting click_text_in_window with: " + text + " and " + window_name)
    activate_window(window_name=window_name)
    click(text, webdriver=context.driver, window_name=window_name)

@when(u'type "{text}"')
@notify
def _type_text(context, text):
    type_text(text)

@when(u'press enter')
@notify
def _press_enter(context):
    press_enter()

@when(u'press enter in "{window_name}" window')
def press_enter_in_window(context, window_name):
    press_enter(window_name=window_name)

@when(u'press backspace in "{window_name}" window {count} times')
def press_enter_in_window(context, window_name, count):
    count = int(count.replace("{","").replace("}",""))
    for n in range(count):
        press_backspace(window_name=window_name)

@when('type "{text}" in "{window_name}" window')
@notify
def type_text_in_window(context, text, window_name):
    activate_window(window_name=window_name)
    type_text(text, window_name=window_name)

@when(u'wait {number_of_seconds} seconds')
@then(u'wait {number_of_seconds} seconds')
@notify
def wait_number_of_seconds(context, number_of_seconds):
    sleep(int(number_of_seconds))

@when("wait 1 second")
@notify
def wait_1_second(context):
    sleep(1)

@then("a popup should appear")
@notify
def popup_should_appear(context):
    notify("starting popup_should_appear")
    context.driver.get("about:blank")
    sleep(1)
    print("starting popup_should_appear")
    call(["gnome-screenshot", "--file=/tmp/scrn.png"])
    sleep(3)
    screenshot = Image.open("/tmp/scrn.png")
    w, h = screenshot.size
    screenshot = screenshot.crop((0,25,w,h-25))
    comparison = Image.open(path_to_images + "opened.png")
    assert screenshot.mode == comparison.mode
    assert screenshot.size == comparison.size
    assert getPercentDifference(screenshot,comparison) < 5

@notify
@then("{name} should appear in popup")
def name_should_appear_in_popup(context, name):
    notify("starting name_should_appear_in_popup")
    context.driver.get("about:blank")
    sleep(1)
    assert is_text_on_screen(name)

@when("go to {url}")
@notify
def go_to_url(context, url):
    context.driver.get(url)
