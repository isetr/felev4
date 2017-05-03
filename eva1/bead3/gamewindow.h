#ifndef GAMEWINDOW_H
#define GAMEWINDOW_H

#include <QPushButton>
#include <QVector>
#include <QVBoxLayout>
#include <QMainWindow>
#include <QKeyEvent>
#include <QPoint>

#include "gamelogic.h"

class GameWindow : public QWidget
{
    Q_OBJECT
public:
    explicit GameWindow(QWidget *parent = 0);
    ~GameWindow();

signals:
    void move(QPoint from, QPoint to);

private slots:
    void newGame();
    void draw();
    void gameOverHandler(bool isWon);
    void loadGame();
    void saveGame();

private:
    GameLogic* game;
    
    QPushButton* btn3;
    QPushButton* btn4;
    QPushButton* btn6;
    QVBoxLayout* vBoxLayout;
    QGridLayout* gridLayout;
    QVector<QPushButton*> mapLayout;
};

#endif // GAMEWINDOW_H
