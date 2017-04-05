#ifndef GAMEWINDOW_H
#define GAMEWINDOW_H

#include <QtGui/QWidget>
#include <QPushButton>
#include <QVector>
#include <QVBoxLayout>

#include "gamemanager.h"
#include "agentrender.h"

class GameWindow : public QWidget
{
    Q_OBJECT
public:
    explicit GameWindow(QWidget *parent = 0);
    ~GameWindow();

private slots:
    void newGame();
    void draw();
    void gameOverHandler(bool isWon);

private:
    GameLogic* game;
    
    QPushButton* btnEasy;
    QPushButton* btnMedium;
    QPushButton* btnHard;
    QVBoxLayout* vBoxLayout;
    QGridLayout* gridLayout;
    QVector<QPushButton*> mapLayout;
};

#endif // GAMEWINDOW_H