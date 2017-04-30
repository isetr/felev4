# -*- coding: utf-8 -*-

import re
import glob

utasitas = r'(.*)'
iff = r'(ELAGAZAS) ([^\[]+) \[\[(.*)?\]\]'
forr = r'(CIKLUS) ([^\[]+) \[\[(.*)?\]\]'
progPattern = iff + '|' + forr + '|' + utasitas
print progPattern

def indentedParse(line, indent):
    global utasitas, iff, forr, progPattern
    out = ''
    mm = re.match(progPattern, line)
    if (mm.group(4) == 'CIKLUS') :
        i = 0
        while i < indent :
            out += '    '
            i = i + 1
        out += 'for ' + mm.group(5) + ' :\n'
        out += indentedParse(mm.group(6), indent+1)
        if indent == 0 :
            out += '\n'
    elif (mm.group(1) == 'ELAGAZAS') :
        i = 0
        while i < indent :
            out += '    '
            i = i + 1
        out += 'if ' + mm.group(2) + ' :\n'
        out += indentedParse(mm.group(3), indent+1)
        if indent == 0 :
            out += '\n'
    else :
        if line != '\n' and line != '':
            stms = line.split(';')
            for stm in stms:
                mm2 = re.match(progPattern, stm)
                if (mm2.group(4) != 'CIKLUS' and mm2.group(1) != 'ELAGAZAS') :
                    i = 0
                    while i < indent :
                        out += '    '
                        i = i + 1
                    out += stm + '\n'
                else :
                    out += indentedParse(stm, indent)
    return out

def parse(name):
    global utasitas, iff, forr, progPattern
    file = open(name, 'r')
    lines = file.readlines()
    out = ''
    for line in lines:
        out += indentedParse(line, 0)
    return out

for name in glob.glob('*.prog'):
    nl = len(name) - 5
    file = open(name[0:nl] + '.py', 'w')
    file.write(parse(name))
    file.close()
