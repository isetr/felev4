#include "Machine.h"

#include <fstream>
#include <string>
#include <iostream>
#include <algorithm>

Machine::Machine() {
	// EMPTY
}

Machine::~Machine() {
	delete[] myNums;
	delete[] trainingNums;
	delete[] numberKnowledge;
	delete[] weightMatrix;
}

void Machine::beSmart(std::string filePath) {
	std::cout << "Learning my numbers . . . ";
	fillNumberMatrix(filePath);
	std::cout << "Done!\n Creating 10 nodes for numbers . . .";
	train();
	std::cout << "Done!\n Guessing the numbers . . .";
	//while(correctGuess < 1000) {
		testMyKnowledge(filePath);
	//}
	std::cout << "Done!" << std::endl;
}

void Machine::fillNumberMatrix(std::string filePath) {
	training = countLines("input/mnist_train.csv");
	trainingNums = new NumberMatrix[training];

	std::ifstream file("input/mnist_train.csv");

	std::string line;
	getline(file, line);

	int currLine = 0;

	for(int i = 0; i < training; ++i) {
		file >> trainingNums[i];
	}

	file.close();

	training2 = countLines(filePath);
	myNums = new NumberMatrix[training];

	std::ifstream file2(filePath);

	getline(file2, line);

	currLine = 0;

	for(int i = 0; i < training2; ++i) {
		file2 >> myNums[i];
	}

	file2.close();
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
		numberKnowledge[i] /= training;
	}
}

void Machine::fillWeightMatrix(NumberMatrix toGuess) {
	for(int i = 0; i < 10; ++i) {
		weightMatrix[i] = compareNums(toGuess, numberKnowledge[i]);
	}
}

float Machine::compareNums(NumberMatrix& numA, NumberMatrix& numB) {
	float weight = 0.0f;

	for(int i = 0; i < 784; ++i) {
		weight += numA[i] * numB[i];
	}

	return weight / 784;
}

int Machine::findMyNum() {
	float maxWeight = weightMatrix[0];
	int foundNum = 0;
	
	for(int i = 1; i < 10; ++i) {		
		if(maxWeight < weightMatrix[i]) {
			maxWeight = weightMatrix[i];
			foundNum = i;
		}
	}

	return foundNum;
}

int Machine::countLines(std::string filePath) {
	int _count;

	std::ifstream file(filePath);

    _count = std::count(std::istreambuf_iterator<char>(file), std::istreambuf_iterator<char>(), '\n');

	file.close();

	--_count;
	return _count;
}

void Machine::testMyKnowledge(std::string filePath) {
	int myNumLength = countLines(filePath);
	int currGuess = -1;
	int answer = -1;
	correctGuess = 0;

	for(int i = 0; i < myNumLength; ++i) {
		fillWeightMatrix(myNums[i]);
		currGuess = findMyNum();
		answer = myNums[i].getValue();
		if(currGuess == answer) ++correctGuess;
		std::cout << i << ". guess: currGuess: " << currGuess << " | answer: " << answer << " | correct so far: " << correctGuess << "\n";
	}
	std::cout << " " << ((double)correctGuess / (double)myNumLength) * 100 << " % accurate ";
}