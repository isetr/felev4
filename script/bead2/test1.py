import sys  

n = int(sys.argv[1]) 
print "A program kezdete!"

for i in range(1,n) :
    print "A szam:"
    print i

if n < 5 :
    print n 
    print "kisebb, mint 5"

