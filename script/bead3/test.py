# -*- coding: utf-8 -*-

from bead import Ford

szotar = {"The" : "A", "sun": "nap", "shining" : "süt", "wind" : "szél", "not" : "nem", "blowing" : "fúj"}

fd = Ford(szotar)
fd.fordit("teszt.txt", "kimenet.txt")



