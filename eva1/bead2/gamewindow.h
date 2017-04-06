#ifndef GAMEWINDOW_H
#define GAMEWINDOW_H

#include <QPushButton>
#include <QVector>
#include <QVBoxLayout>
#include <QMainWindow>
#include <QKeyEvent>

#include "gamelogic.h"

class GameWindow : public QWidget
{
    Q_OBJECT
public:
    explicit GameWindow(QWidget *parent = 0);
    ~GameWindow();

    void keyPressEvent(QKeyEvent* e) {
        switch(e->key()){
        case Qt::Key_Up: emit movePlayer('N'); break;
        case Qt::Key_Down: emit movePlayer('S'); break;
        case Qt::Key_Left: emit movePlayer('W'); break;
        case Qt::Key_Right: emit movePlayer('E'); break;
        }
    }

signals:
    void movePlayer(char dir);

private slots:
    void newGame();
    void draw();
    void gameOverHandler(bool isWon);


private:
    GameLogic* game;
    
    QPushButton* btnEasy;
    QPushButton* btnMedium;
    QPushButton* btnHard;
    QPushButton* btnPause;
    QVBoxLayout* vBoxLayout;
    QGridLayout* gridLayout;
    QVector<QPushButton*> mapLayout;
};

#endif // GAMEWINDOW_H
