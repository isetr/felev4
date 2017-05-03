#ifndef GAMEWINDOW_H
#define GAMEWINDOW_H

#include <QPushButton>
#include <QVector>
#include <QVBoxLayout>
#include <QMainWindow>
#include <QPoint>

#include "gamelogic.h"
#include "loadgamewidget.h"
#include "savegamewidget.h"
#include "coordbutton.h"

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
    void draw(int currentPlayer);
    void gameOverHandler(bool isWon);
    void loadGame();
    void saveGame();

private:
    void chooseToFrom();

    GameLogic* game;
    
    QPushButton* btn3;
    QPushButton* btn4;
    QPushButton* btn6;
    QPushButton* btnSave;
    QPushButton* btnLoad;
    QVBoxLayout* vBoxLayout;
    QGridLayout* gridLayout;
    QVector<CoordButton*> mapLayout;
    CoordButton* selected;

    SaveGameWidget* saveGameWidget; // a mentést biztosító ablak
    LoadGameWidget* loadGameWidget; // a betöltést biztostó ablak
};

#endif // GAMEWINDOW_H
