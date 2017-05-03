#include "gamelogic.h"

#include <QFile>
#include <QTextStream>
#include <random>
#include <ctime>
#include <math.h>

GameLogic::GameLogic(DataAccess* dataAccess, QObject *parent) : QObject(parent) {
    size = -1;
    turns = -1;
    currentPlayer = -1;
    tokens = nullptr;
    this->dataAccess = dataAccess;
}

GameLogic::~GameLogic() {
    delete[] tokens;
}

void GameLogic::newGame(int size) {
    delete[] tokens;
    tokens = nullptr;
    map.clear();

    std::mt19937 randEngine(std::time(nullptr));
    std::uniform_int_distribution<int> rangeSize(0,size-1);

    this->size = size;
    turns = size * 5;
    currentPlayer = 0;
    tokens = new int[2];
    tokens[0] = 0;
    tokens[1] = 0;

    for(int i = 0; i < size; ++i) {
        QVector<int> tmp;
        for(int j = 0; j < size; ++j) {
            tmp.push_back(2);
        }
        map.push_back(tmp);
    }

    for(int i = 0; i < 2; ++i) {
        while(tokens[i] < size) {
            int x, y;

            do {
                x = rangeSize(randEngine);
                y = rangeSize(randEngine);
            } while(map[x][y] != 2);

            ++tokens[i];
            map[x][y] = i;
        }
    }
}

bool GameLogic::loadGame(int gameIndex) {
    QVector<int> saveGameData;

    if (!dataAccess->loadGame(gameIndex, saveGameData)) {
        return false;
    }

    map.clear();

    for(int i = 0; i < size; ++i) {
        QVector<int> tmp;
        for(int j = 0; j < size; ++j) {
            tmp.push_back(2);
        }
        map.push_back(tmp);
    }

    currentPlayer = saveGameData[0];
    turns = saveGameData[1];
    size = saveGameData[2];
    for (int i = 0; i < size; ++i) {
        for (int j = 0; j < size; ++j) {
            map[i][j] = saveGameData[3 + i * size + j];
        }
    }

    return true;
}

bool GameLogic::saveGame(int gameIndex) {
    QVector<int> saveGameData;

    saveGameData.push_back(currentPlayer);
    saveGameData.push_back(turns);
    saveGameData.push_back(size);

    for (auto row : map) {
        for(auto tile : row) {
            saveGameData.push_back(tile);
        }
    }

    return dataAccess->saveGame(gameIndex, saveGameData);
}

QVector<QString> GameLogic::saveGameList() const {
    return dataAccess->saveGameList();
}

void GameLogic::stepGame(QPoint from, QPoint to) {
    QVector<QVector<int>> tmp(map);

    QPoint dir = from - to;
    if(dir.x() >= 1) {
        for(int i = 1; i < from.x() + 1; ++i) {
            map[from.x() - i][from.y()] = tmp[from.x() - i + 1][from.y()];
        }
    } else if(dir.x() == -1) {
        for(int i = 1; i < size - from.x(); ++i) {
            map[from.x() + i][from.y()] = tmp[from.x() + i - 1][from.y()];
        }
    } else if(dir.y() >= 1) {
        for(int i = 1; i < from.y() + 1; ++i) {
            map[from.x()][from.y() - i] = tmp[from.x()][from.y() - i + 1];
        }
    } else if(dir.y() <= -1) {
        for(int i = 1; i < size - from.y(); ++i) {
            map[from.x()][from.y() + i] = tmp[from.x()][from.y() + i - 1];
        }
    }
    map[from.x()][from.y()] = 2;

    tokens[0] = countTokens(0);
    tokens[1] = countTokens(1);

    currentPlayer = (currentPlayer == 1)? 0 : 1;
    emit update(currentPlayer);
    
    if(checkOver()) {
        emit gameOver(winner());
    }
}

int GameLogic::countTokens(int player) {
    int tmp;
    for(int i = 0; i < size; ++i) {
        for(int j = 0; j < size; ++j) {
            if(map[i][j] == player) ++tmp;
        }
    }
    return tmp;
}

bool GameLogic::checkOver() {
    return turns == 0 || tokens[0] == 0 || tokens[1] == 0;
}

int GameLogic::winner() {
    if(tokens[0] > tokens[1]) {
        return 0;
    } else if(tokens[0] < tokens[1]) {
        return 1;
    }
    return 2;
}
