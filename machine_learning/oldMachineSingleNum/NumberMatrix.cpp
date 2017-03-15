#include "NumberMatrix.h"

#include <sstream>
#include <string>
#include <cstdlib>

NumberMatrix::NumberMatrix() {
	// EMPTY
}

NumberMatrix::~NumberMatrix() {
	delete[] pixelData;
}

NumberMatrix::NumberMatrix(const NumberMatrix& numA) {
	this->value = numA.value;

	delete[] pixelData;

	pixelData = new int[784];

	for(int i = 0; i < 784; ++i) {
		this->pixelData[i] = numA[i];
	}
}

NumberMatrix::NumberMatrix(const int value) {
	this->value = value;
	delete[] pixelData;
	pixelData = new int[784];
}

int NumberMatrix::operator[] (int i) const {
	return pixelData[i];
}

NumberMatrix& NumberMatrix::operator= (const NumberMatrix& numA) {
	value = numA.value;

	delete[] pixelData;
	pixelData = new int[784];

	for(int i = 0; i < 784; ++i) {
		pixelData[i] = numA[i];
	}

	return *this;
}

std::istream& operator>> (std::istream& in, NumberMatrix& thisMatrix) {
	std::string line;
	getline(in, line);

	std::istringstream ss(line);

	std::string pixel;
	int i = 0;
	while(i < 785){
		getline(ss,pixel,',');
		if(i == 0) {
			thisMatrix.value = atoi(pixel.c_str());
		} else {
			thisMatrix.pixelData[i] = atoi(pixel.c_str());
		}
		++i;
	}
	
	return in;
}

NumberMatrix& operator+ (const NumberMatrix& numA, const NumberMatrix& numB) {
	NumberMatrix numC(numA.value);
	for(int i = 0; i < 784; ++i) {
		numC.pixelData[i] = numA.pixelData[i] + numB.pixelData[i];
	}
	return numC;
}

NumberMatrix& operator+= (NumberMatrix& numA, const NumberMatrix& numB) {
	for(int i = 0; i < 784; ++i) {
		numA.pixelData[i] += numB.pixelData[i];
	}
	return numA;
}

NumberMatrix& operator/ (const NumberMatrix& numA, const int& numB){
	NumberMatrix numC(numA.value);

	for(int i = 0; i < 784; ++i) {
		numC.pixelData[i] = numA.pixelData[i] / numB;
	}
	return numC;
}

NumberMatrix& operator/= (NumberMatrix& numA, const int& numB) {
	for(int i = 0; i < 784; ++i) {
		numA.pixelData[i] /= numB;
	}
	return numA;
}

std::istream& NumberMatrix::readWithoutValue(std::istream& in) {
	std::string line;
	getline(in, line);

	std::istringstream ss(line);

	std::string pixel;
	int i = 0;
	while(i < 784){
		getline(ss,pixel,',');
		pixelData[i] = atoi(pixel.c_str());
		++i;
	}
	return in;
}
