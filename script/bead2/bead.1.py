# -*- coding: utf-8 -*-

import re
import glob

utasitas = r'(.*)'
szekv = r'(.*)\;(.*)*'
iff = r'(ELAGAZAS) (.*)? \[\[(.*)?\]\]'
forr = r'(CIKLUS) (.*)? \[\[(.*)?\]\]'
progPattern = iff + '|' + forr + '|' + utasitas + '|' + szekv
print progPattern

def parse(name):
    global utasitas, szekv, iff, forr, progPattern
    file = open(name, 'r')
    lines = file.readlines()
    out = ''
    for line in lines:
        mm = re.match(progPattern, line)
        if (mm.group(4) == 'CIKLUS') :
            print mm.group(6)
            out += 'for ' + mm.group(5) + ' :\n'
            for stm in mm.group(6).split(';') :
                if stm != '\n' :
                    out += '    ' + stm + '\n'
            out += '\n'  
        elif (mm.group(1) == 'ELAGAZAS') :
            out += 'if ' + mm.group(2) + ' :\n'
            for stm in mm.group(3).split(';') :
                if stm != '\n' :
                    out += '    ' + stm + '\n'
            out += '\n'
        else :
            if line != '\n' :
                stms = line.split(';')
                for stm in stms:
                    out += stm + '\n'
    return out
            

for name in glob.glob('*.prog'):
    nl = len(name) - 5
    file = open(name[0:nl] + '.py', 'w')
    file.write(parse(name))
    file.close()
