#include "gamelogic.h"

#include <QFile>
#include <QTextStream>
#include <random>
#include <ctime>
#include <math.h>

GameLogic::GameLogic(QObject *parent) : QObject(parent) {
    timer = new QTimer();
    timer->setInterval(1000);

    connect(timer, SIGNAL(timeout()), this, SLOT(timerTimeOut()));
}

GameLogic::~GameLogic() {
    delete player;
    foreach(Enemy* enemy, enemies) {
        delete enemy;
    }
    delete exit;
}

void GameLogic::newGame(QString filePath) {
    player = nullptr;
    exit = nullptr;
    foreach(Enemy* enemy, enemies) {
        delete enemy;
    }
    enemies.clear();
    map.clear();

    QFile levelFile(filePath);
    if(!levelFile.open(QIODevice::ReadOnly | QIODevice::Text)) return;
    std::mt19937 rand(std::time(nullptr));
    std::uniform_int_distribution<int> dirs(0, 3);

    QTextStream in(&levelFile);

    QString line = in.readLine();

    while (!line.isNull()) {
        map.append(line);
        line = in.readLine();
    }

    for (int i = 0; i < map.size();i++) {
        for (int j = 0; j < map[i].size();j++) {
            QChar tile = map[i][j];

            switch (tile.toLatin1()) {
            case 'P':
                player = new Agent(QPoint(j ,i));
            break;
            case 'X':
                exit = new QPoint(j, i);
            break;
            case 'R':
                int currDir = dirs(rand);
                switch(currDir) {
                    case 0:
                        enemies.append(new Enemy(QPoint(j, i), 'N'));
                    break;
                    case 1:
                        enemies.append(new Enemy(QPoint(j, i), 'S'));
                    break;
                    case 2:
                        enemies.append(new Enemy(QPoint(j, i), 'E'));
                    break;
                    case 3:
                        enemies.append(new Enemy(QPoint(j, i), 'W'));
                    break;
                }
            break;
            }
        }
    }

}

void GameLogic::pauseGame() {
    if(timer->isActive()) {
        timer->stop();
    } else {
        timer->start();
    }
}

void GameLogic::stepGame(char dir) {
    if(timer->isActive()) {
        player->dir = dir;
    }
}

void GameLogic::timerTimeOut() {
    processMovePlayer(player->dir);
    player->dir = 'X';

    foreach(Enemy* enemy, enemies) {
        processMoveEnemies(enemy);
        if(checkIfSeen(enemy)) emit gameOver(false);
    }

    if(player->coord.x() == exit->x() && player->coord.y() == exit->y()) {
        emit gameOver(true);
    }

    emit draw();
}

void GameLogic::processMovePlayer(char dir) {
    if(dir != 'X') {
        QChar targetTile = '#';
        QPoint target(0,0);
        switch(dir) {
            case 'N': 
                if(player->coord.y() > 0) {
                    targetTile = map[player->coord.y() - 1][player->coord.x()];
                    target = QPoint(player->coord.y() - 1,player->coord.x());
                }
            break;
            case 'S': 
                if(player->coord.y() < map.size()) {
                    targetTile = map[player->coord.y() + 1][player->coord.x()];
                    target = QPoint(player->coord.y() + 1,player->coord.x());
                }
            break;
            case 'E': 
                if(player->coord.x() < map[player->coord.y()].size()) {
                    targetTile = map[player->coord.y()][player->coord.x() + 1];
                    target = QPoint(player->coord.y(),player->coord.x() + 1);
                }
            break;
            case 'W': 
                if(player->coord.x() > 0) {
                    targetTile = map[player->coord.y()][player->coord.x() - 1];
                    target = QPoint(player->coord.y(),player->coord.x() - 1);
                }
            break;
        }

        if(targetTile != '#') {
            map[player->coord.y()][player->coord.x()] = ' ';
            map[target.x()][target.y()] = 'P';
            player->move(dir);
        }
    }
}

void GameLogic::processMoveEnemies(Enemy* enemy) {
    QChar targetTile = '#';
    QPoint target(0,0);
    std::mt19937 rand(std::time(nullptr));
    std::uniform_int_distribution<int> dirs(0, 3);

    switch(enemy->dir) {
        case 'N': 
            if(enemy->coord.y() > 0) {
                targetTile = map[enemy->coord.y() - 1][enemy->coord.x()];
                target = QPoint(enemy->coord.y() - 1,enemy->coord.x());
            }
        break;
        case 'S': 
            if(enemy->coord.y() < map.size()) {
                targetTile = map[enemy->coord.y() + 1][enemy->coord.x()];
                target = QPoint(enemy->coord.y() + 1,enemy->coord.x());
            }
        break;
        case 'E': 
            if(enemy->coord.x() < map.size()) {
                targetTile = map[enemy->coord.y()][enemy->coord.x() + 1];
                target = QPoint(enemy->coord.y(),enemy->coord.x() + 1);
            }
        break;
        case 'W': 
            if(enemy->coord.x() > 0) {
                targetTile = map[enemy->coord.y()][enemy->coord.x() - 1];
                target = QPoint(enemy->coord.y(),enemy->coord.x() - 1);
            } 
        break;
    }
    if(targetTile != '#' && targetTile != 'X') {
        map[enemy->coord.y()][enemy->coord.x()] = ' ';
        map[target.x()][target.y()] = 'R';
        enemy->move();
    } else {
        int currDir = dirs(rand);
        switch(currDir) {
            case 0:
                enemy->dir = 'N';
            break;
            case 1:
                enemy->dir = 'S';
            break;
            case 2:
                enemy->dir = 'E';
            break;
            case 3:
                enemy->dir = 'W';
            break;
        }
    }
}

bool GameLogic::checkIfSeen(Enemy* enemy) {
    if(abs(player->coord.x() - enemy->coord.x()) < 2 && abs(player->coord.y() - enemy->coord.y()) < 2) {
        QPoint v = enemy->coord - player->coord;
        for(int i = 0; i < 2; ++i) {
            QPoint currP = player->coord + v * (double)i / 2.0;
            if(map[currP.y()][currP.x()] == '#') return false;
        }
        return true;
    }
    return false;
}
