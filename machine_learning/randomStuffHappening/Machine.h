#pragma once

#include "NumberMatrix.h"

class Machine {
public:
	Machine();
	~Machine();
	
	void beSmart(std::string filePath);
	
private:
	void fillNumberMatrix(std::string filePath);
	void train();
	void fillWeightMatrix(NumberMatrix toGuess);
	int findMyNum();
	void testMyKnowledge(std::string);
	
	float compareNums(NumberMatrix& numA, NumberMatrix& numB);
	
	int countLines(std::string filePath);
	
	NumberMatrix* myNums = nullptr;
	NumberMatrix* trainingNums = nullptr;
	NumberMatrix* numberKnowledge = new NumberMatrix[10];
	float* weightMatrix = new float[10];
	
	int training = -1;
	int training2 = -1;
	int correctGuess = 0;
};