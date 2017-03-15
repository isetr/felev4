#include "Machine.h"

#include <fstream>
#include <string>
#include <iostream>
#include <algorithm>

Machine::Machine() {
	// EMPTY
}

Machine::~Machine() {
	delete myNum;
	delete[] trainingNums;
	delete[] numberKnowledge;
	delete[] weightMatrix;
}

void Machine::beSmart(std::string filePath) {
	learnMyNum(filePath);
	fillTrain();
	train();
	fillWeightMatrix();
	guess = findMyNum();

	std::cout << guess << std::endl;
}

void Machine::learnMyNum(std::string filePath) {
	std::ifstream file(filePath);

	myNum->readWithoutValue(file);
}

void Machine::fillTrain() {
	training = countLines("input/train.csv");
	trainingNums = new NumberMatrix[training];

	std::ifstream file("input/train.csv");

	std::string line;
	getline(file, line);

	int currLine = 0;

	for(int i = 0; i < training; ++i) {
		file >> trainingNums[i];
	}

	file.close();
}

void Machine::train() {
	for(int i = 0; i < training; ++i) {
		switch(trainingNums[i].getValue()) {
			case 0:
				numberKnowledge[0] += trainingNums[i];
			break;
			case 1:
				numberKnowledge[1] += trainingNums[i];
			break;
			case 2:
				numberKnowledge[2] += trainingNums[i];
			break;
			case 3:
				numberKnowledge[3] += trainingNums[i];
			break;
			case 4:
				numberKnowledge[4] += trainingNums[i];
			break;
			case 5:
				numberKnowledge[5] += trainingNums[i];
			break;
			case 6:
				numberKnowledge[6] += trainingNums[i];
			break;
			case 7:
				numberKnowledge[7] += trainingNums[i];
			break;
			case 8:
				numberKnowledge[8] += trainingNums[i];
			break;
			case 9:
				numberKnowledge[9] += trainingNums[i];
			break;
		}
	}

	for(int i = 0; i < 10; ++i) {
		numberKnowledge[i] /= training / 10;
	}
}

void Machine::fillWeightMatrix() {
	for(int i = 0; i < 10; ++i) {
		weightMatrix[i] = compareNums(*myNum, numberKnowledge[i]);
	}
}

float Machine::compareNums(NumberMatrix& numA, NumberMatrix& numB) {
	float weight = 0.0f;

	for(int i = 0; i < 784; ++i) {
		weight += numA[i] * numB[i];
	}

	weight /= training / 10;

	return weight;
}

int Machine::findMyNum() {
	float maxWeight = weightMatrix[0];
	int foundNum = 0;
	
	std::cout << "0. suly: " << weightMatrix[0] << '\n';
	
	for(int i = 1; i < 10; ++i) {
		
		std::cout << i << ". suly: " << weightMatrix[i] << '\n';
		
		if(maxWeight < weightMatrix[i]) {
			maxWeight = weightMatrix[i];
			foundNum = i;
		}
	}

	return foundNum;
}

int Machine::countLines(std::string filePath) {
	int _count;

	std::ifstream file("input/train.csv");

    _count = std::count(std::istreambuf_iterator<char>(file), std::istreambuf_iterator<char>(), '\n');

	file.close();

	--_count;
	return _count;
}
