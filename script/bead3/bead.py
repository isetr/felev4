# -*- coding: utf-8 -*-

class Ford():
    def __init__(self, szavak):
        self.szotar = szavak

    def translate(self, word):
        for v, k in self.szotar.items():
            if word == v :
                return k
        return word

    def translate2(self, word):
        for v, k in self.szotar.items():
            if word == k :
                return v
        return word

    def fordit(self, inFile, outFile):
        try:
            file = open(inFile, 'r')
            outfile = open(outFile, 'wb')
            out = ''
            lines = file.readlines()
            for line in lines:
                l = False
                if line[len(line) - 2] == '.':
                    line = line[0:(len(line) - 2)]
                    l = True
                words = line.split(' ')
                for word in words:
                    out += self.translate(word) + ' '
                out = out[0:(len(out) - 1)]
                if l:
                    out += '.'
                out += '\n'
            file.close()
            outfile.write(out)
            outfile.close()
        except IOError:
            print "Nincs input file!"

    def visszafordit(self, inFile, outFile):
        try:
            file = open(inFile, 'r')
            outfile = open(outFile, 'wb')
            out = ''
            lines = file.readlines()
            for line in lines:
                l = False
                if line[len(line) - 2] == '.':
                    line = line[0:(len(line) - 2)]
                    l = True
                words = line.split(' ')
                for word in words:
                    out += self.translate2(word) + ' '
                out = out[0:(len(out) - 1)]
                if l:
                    out += '.'
                out += '\n'
            file.close()
            outfile.write(out)
            outfile.close()
        except IOError:
            print "Nincs input file!"
