#include "Machine.h"

int main(int argc, char** argv) {
	Machine machine;
	
	if(argc < 2) {
		std::cout << "Hianyzik a szamot tartalmazo file parameter." << std::endl;
		return 1;
	}
	
	machine.beSmart(argv[1]);

	return 0;
}
