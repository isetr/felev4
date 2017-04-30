import sys  

n = int(sys.argv[1]) 
print "A program kezdete!"

for i in range(1,n) :
    print "A szamok:"
    for j in range(1,3) :
        print j
    print i 
    for k in range(1,3) :
        print k
    print "Ez a vege!"

if n < 5 :
    print n 
    print "kisebb, mint 5"

