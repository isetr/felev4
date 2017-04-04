# -*- coding: utf-8 -*-

import re

######################################
#              PROGMOD               #

class Data():
    def __init__(self, name, date, wealth):
        self.name = name
        self.date = date
        self.wealth = wealth

class Item():
    def __init__(self, key, data):
        self.k = key
        self.d = data

norm = True
abnorm = False
ures = Data(0,0,0)

def read(seq, data, status):
    if (len(seq) != 0):
        return norm, seq.pop(0), seq
    else:
        return abnorm, data, seq

def hiext(seq, data):
    seq.append(data)

def TR(data, key):
    global sm, dm, m
    ad = data
    while (sm == norm and dm.k == key):
        if (ad == ures):
            ad = dm.d
        else:
            ad.date = dm.d.date
            ad.wealth = ad.wealth + dm.d.wealth
        sm, dm, m = read(m, dm, sm)
    return ad

def HIEXT(seq, ak, ad):
    if ad != ures:
        temp = Item(ak, ad)
        hiext(t, temp)

######################################
#              FILEOK                #
st0, dt0, t0 = abnorm, Item(0, 0), []
sm, dm, m = abnorm, Item(0, 0), []

######################################
#              OLVASAS               #
file = open("data.txt", "r")
lines = file.readlines()
for line in lines:
    mm = re.match("([\d]+-[\d]+) ([\D]+) ([\d\.]{11}) ([\+\-\d]+)", line)
    tempd = Data(mm.group(2), mm.group(3), int(mm.group(4)))
    tempi = Item(mm.group(1), tempd)
    t0.append(tempi)
file.close()

file = open ("update", "r")
udate = file.readline().strip()
lines = file.readlines()
lines.sort()
for line in lines:
    mm = re.match("([\d]+-[\d]+) ([\D]+) ([\+\-\d]+)", line)
    tempd = Data(mm.group(2), udate, int(mm.group(3)))
    tempi = Item(mm.group(1), tempd)
    m.append(tempi)
file.close()

######################################
#           IDOSZERUSITES            #
st0, dt0, t0 = read(t0, dt0, st0)
sm, dm, m = read(m, dm, sm)
t = []
while (st0 == norm or sm == norm):
    if (sm == abnorm or (dt0.k < dm.k and st0 == sm)):
        hiext(t, dt0)
        st0, dt0, t0 = read(t0, st0, dt0)
    elif (st0 == abnorm or (dm.k < dt0.k and sm == st0)):
        ak = dm.k
        ad = TR(ures, ak)
        HIEXT(t, ak, ad)
    elif (st0 == sm and dm.k == dt0.k):
        ak = dm.k
        ad = TR(dt0.d, ak)
        HIEXT(t, ak, ad)
        st0, dt0, t0 = read(t0, dt0, st0)

######################################
#              KIIRAS                #
file = open("newdata", "w")
for ddt in t:
    line = "%s %s %s %d\n" % (ddt.k, ddt.d.name, ddt.d.date, ddt.d.wealth)
    file.write(line)
file.close()