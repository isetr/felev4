#include "gamewindow.h"
#include <QMessageBox>
#include <QApplication>
#include <QHBoxLayout>

GameWindow::GameWindow(QWidget *parent) : QWidget(parent) {
    setFixedSize(800,600);
    setWindowTitle(trUtf8("Kitolás"));

    game = new GameLogic();

    connect(game, SIGNAL(gameOver(int)), this, SLOT(gameOverHandler(int)));
    connect(game, SIGNAL(update(int)), this, SLOT(draw(int)));
    connect(this, SIGNAL(move(QPoint, QPoint)), game, SLOT(stepGame(QPoint, QPoint)));

    btn3 = new QPushButton(trUtf8("3x3"));
    connect(btn3, SIGNAL(clicked()), this, SLOT(newGame()));

    btn4 = new QPushButton(trUtf8("4x4"));
    connect(btn4, SIGNAL(clicked()), this, SLOT(newGame()));

    btn6 = new QPushButton(trUtf8("6x6"));
    connect(btn6, SIGNAL(clicked()), this, SLOT(newGame()));

    btnSave = new QPushButton(trUtf8("Save"));
    connect(btn6, SIGNAL(clicked()), this, SLOT(saveGame()));

    btnLoad = new QPushButton(trUtf8("Load"));
    connect(btn6, SIGNAL(clicked()), this, SLOT(loadGame()));

    QHBoxLayout* hlayout = new QHBoxLayout();
    hlayout->addWidget(btn3);
    hlayout->addWidget(btn4);
    hlayout->addWidget(btn6);

    gridLayout = new QGridLayout();

    QVBoxLayout* vlayout = new QVBoxLayout();
    vlayout->addLayout(hlayout);
    vlayout->addLayout(gridLayout);

    setLayout(vlayout);

}

GameWindow::~GameWindow() {
    delete game;
}

void GameWindow::newGame() {
    foreach(QPushButton* btn, mapLayout) {
        gridLayout->removeWidget(btn);
        delete btn;
    }

    mapLayout.clear();
    selected = nullptr;

    if(QObject::sender() == btn3) {
        game->newGame(3);
    } else if (QObject::sender() == btn4) {
        game->newGame(4);
    } else if (QObject::sender() == btn6) {
        game->newGame(6);
    }

    btnPause->setEnabled(true);

    int** localMap = game->getMap();
    int size = game->getSize();

    for(int i = 0; i < size; ++i) {
        for(int j = 0; j < size; ++j) {
            CoordButton* btn = new QPushButton(QPoint(i, j));
            QString color;

            switch(localMap[i][j]) {
                case 0
                    color = "#FFFFFF";
                break;
                case 1:
                    color = "#000000";
                break;
                default:
                    color = "#DDDDDD";
                break;
            }

            QString style = "QPushButton { background-color: " + color + " }";
            btn->setStyleSheet(style);
            btn->setEnabled(false);
            gridLayout->addWidget(btn, i, j);
            QObject::connect(btn, SIGNAL(clicked()), this, SLOT(chooseToFrom()));
            mapLayout.append(btn);
        }
    }
}

void GameWindow::draw(int currentPlayer) {
    int** localMap = game->getMap();
    int size = game->getSize();

    for(int i = 0; i < size; ++i) {
        for(int j = 0; j < size; ++j) {
            QString color;

            switch(localMap[i][j]) {
                case 0
                    color = "#FFFFFF";
                break;
                case 1:
                    color = "#000000";
                break;
                default:
                    color = "#DDDDDD";
                break;
            }

            mapLayout[i * localMap.size() + j]->setEnabled(false);
            if(localMap[i][j] == currentPlayer || localMap[i][j] == 2) {
                mapLayout[i * localMap.size() + j]->setEnabled(true);
            }

            QString style = "QPushButton { background-color: " + color + " }";
            mapLayout[i * localMap.size() + j]->setStyleSheet(style);
        }
    }
}

void GameWindow::gameOverHandler(int winner) {
    if(winner == 0) {
        QMessageBox::information(this, trUtf8("Játék vége"),
                                 trUtf8("Az 1. Játékos nyert!"));
    } else if(winner == 1) {
        QMessageBox::information(this, trUtf8("Játék vége"),
                                 trUtf8("A 2. játékos nyert!"));
    } else {
        QMessageBox::information(this, trUtf8("Játék vége"),
                                 trUtf8("A játék döntetlen!"));
    }
}

void GameWindow::loadGame() {
    if (game.loadGame(loadGameWidget->selectedGame()))
    {
        draw();
        QMessageBox::information(this, trUtf8("Kitolás"), trUtf8("Játék betöltve!");
    }
    else
    {
        QMessageBox::warning(this, trUtf8("Kitolás"), trUtf8("A játék betöltése sikertelen!"));
    }
}

void GameWindow::saveGame() {
    if (game.saveGame(saveGameWidget->selectedGame()))
    {
        updadrawte();
        QMessageBox::information(this, trUtf8("Kitolás"), trUtf8("Játék sikeresen mentve!"));
    }
    else
    {
        QMessageBox::warning(this, trUtf8("Kitolás"), trUtf8("A játék mentése sikertelen!"));
    }
}

void GameWindow::chooseToFrom() {
    if(selected == nullptr) {
        selected = qobject_cast<CoordButton*>(sender());
    } else {
        CoordButton* dest = qobject_cast<CoordButton*>(sender());
        emit move(selected.getCoord(), dest.getCoord());
        selected = nullptr;
    }
}