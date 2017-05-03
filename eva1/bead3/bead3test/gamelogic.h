#ifndef GAMELOGIC_H
#define GAMELOGIC_H

#include <QObject>
#include <QVector>
#include <QString>
#include <QPoint>

#include "dataaccess.h"

class GameLogic : public QObject
{
    Q_OBJECT
public:
    explicit GameLogic(DataAccess* dataAccess, QObject *parent = 0);
    ~GameLogic();

    QVector<QVector<int>> getMap() const { return map; }
    int getSize() const { return size; }
    int getCurrentPlayer() const { return currentPlayer; }

public slots:
    void newGame(int size);
    void stepGame(QPoint from, QPoint to);
    bool loadGame(int gameIndex);
    bool saveGame(int gameIndex);
    QVector<QString> saveGameList() const;

signals:
    void gameOver(int winner);
    void update(int currentPlayer);

private:
    int countTokens(int player);
    bool checkOver();
    int winner();

    QVector<QVector<int>> map;
    int size;
    int turns;
    int currentPlayer;
    int* tokens;
    DataAccess* dataAccess;
};

#endif // GAMELOGIC_H
