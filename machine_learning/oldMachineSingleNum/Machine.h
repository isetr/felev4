#pragma once

#include "NumberMatrix.h"

class Machine {
public:
	Machine();
	~Machine();
	
	void beSmart(std::string filePath);
	
private:
	void learnMyNum(std::string filePath);
	void fillTrain();
	void train();
	void fillWeightMatrix();
	int findMyNum();
	
	float compareNums(NumberMatrix& numA, NumberMatrix& numB);
	
	int countLines(std::string filePath);
	
	NumberMatrix* myNum = new NumberMatrix();
	NumberMatrix* trainingNums = nullptr;
	NumberMatrix* numberKnowledge = new NumberMatrix[10];
	float* weightMatrix = new float[10];
	
	int guess = -1;
	int training = -1;
};