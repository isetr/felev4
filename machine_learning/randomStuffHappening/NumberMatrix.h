#pragma once

#include <iostream>

class NumberMatrix {
public:
	NumberMatrix();
	~NumberMatrix();
	NumberMatrix(const NumberMatrix& numA);
	NumberMatrix(const int value);
	
	int operator[] (int i) const;
	
	NumberMatrix& operator= (const NumberMatrix& numA);
	
	friend std::istream& operator>> (std::istream& in, NumberMatrix& thisMatrix);

	friend NumberMatrix& operator+ (const NumberMatrix& numA, const NumberMatrix& numB);
	friend NumberMatrix& operator+= (NumberMatrix& numA, const NumberMatrix& numB);
	
	friend NumberMatrix& operator/ (const NumberMatrix& numA, const int& numB);
	friend NumberMatrix& operator/= (NumberMatrix& numA, const int& numB);
	
	std::istream& readWithoutValue(std::istream& in);
	int getValue() const { return value; };
	
private:
	int value = -1;
	int* pixelData = new int[784];
};