#ifndef GAMELOGIC_H
#define GAMELOGIC_H

#include <QObject>
#include <QTimer>
#include <QVector>
#include <QString>

#include "Agent.h"

class GameLogic : public QObject
{
    Q_OBJECT
public:
    explicit GameLogic(QObject *parent = 0);
    ~GameLogic();

    const QVector<QString> getMap() { return map; }

public slots:
    void newGame(QString filePath);
    void pauseGame();
    void stepGame(char dir);

private slots:
    void timerTimeOut();

signals:
    void gameOver(bool isWon);
    void draw();

private:
    void processMovePlayer(char dir);
    void processMoveEnemies(Enemy* enemy);
    bool checkIfSeen(Enemy* enemy);

    QVector<QString> map;
    Agent* player;
    QVector<Enemy*> enemies;
    QPoint* exit;
    Qtimer* timer;
};

#endif // GAMELOGIC_H