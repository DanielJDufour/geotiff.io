from behave import *
import cv2
from subprocess import call
from time import sleep

import sys
PY3 = sys.version_info[0] == 3

if PY3:
    xrange = range

import numpy as np


def angle_cos(p0, p1, p2):
    d1, d2 = (p0-p1).astype('float'), (p2-p1).astype('float')
    return abs( np.dot(d1, d2) / np.sqrt( np.dot(d1, d1)*np.dot(d2, d2) ) )

def find_squares(img):
    img = cv2.GaussianBlur(img, (5, 5), 0)
    squares = []
    for gray in cv2.split(img):
        for thrs in xrange(0, 255, 26):
            if thrs == 0:
                bin = cv2.Canny(gray, 0, 50, apertureSize=5)
                bin = cv2.dilate(bin, None)
            else:
                _retval, bin = cv2.threshold(gray, thrs, 255, cv2.THRESH_BINARY)
            print("found:", cv2.findContours(bin, cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE))
            contours, _hierarchy = cv2.findContours(bin, cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)
            for cnt in contours:
                x, y, w, h = cv2.boundingRect(cnt)
                cnt_len = cv2.arcLength(cnt, True)
                print("cnt_len:", cnt_len)
                cnt = cv2.approxPolyDP(cnt, 0.02*cnt_len, True)
                area = cv2.contourArea(cnt)
                if len(cnt) == 4 and 20 < area < 1000 and cv2.isContourConvex(cnt):
                    cnt = cnt.reshape(-1, 2)
                    max_cos = np.max([angle_cos( cnt[i], cnt[(i+1) % 4], cnt[(i+2) % 4] ) for i in xrange(4)])
                    if max_cos < 0.1:
                        if (1 - (float(w) / float(h)) <= 0.07 and 1 - (float(h) / float(w)) <= 0.07):
                            squares.append(cnt)
    return squares


@when("raster appears")
@then("raster appears")
def raster_appears(context):
    path_to_screenshot = "/tmp/scrn.png"
    call(["gnome-screenshot", "--file=" + path_to_screenshot, "--window"])
    sleep(3)
    img = cv2.imread(path_to_screenshot)
    squares = find_squares(img)
    #print("squares:", squares)
    #cv2.drawContours( img, squares, -1, (0, 255, 0), 3 )
    #cv2.imshow('squares', img)
    #ch = cv2.waitKey()
    #cv2.destroyAllWindows()
    assert len(squares) > 50
