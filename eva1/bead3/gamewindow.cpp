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
    connect(btnSave, SIGNAL(clicked()), this, SLOT(saveBtn()));

    btnLoad = new QPushButton(trUtf8("Load"));
    connect(btnLoad, SIGNAL(clicked()), this, SLOT(loadBtn()));

    QHBoxLayout* hlayout = new QHBoxLayout();
    hlayout->addWidget(btn3);
    hlayout->addWidget(btn4);
    hlayout->addWidget(btn6);
    hlayout->addWidget(btnSave);
    hlayout->addWidget(btnLoad);

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

    QVector<QVector<int>> localMap = game->getMap();
    int size = game->getSize();

    for(int i = 0; i < size; ++i) {
        for(int j = 0; j < size; ++j) {
            CoordButton* btn = new CoordButton(QPoint(i, j));
            QString color;

            switch(localMap[i][j]) {
                case 0:
                    color = "#DDDDDD";
                break;
                case 1:
                    color = "#111111";
                break;
                default:
                    color = "#666666";
                break;
            }

            QString style = "QPushButton { background-color: " + color + " }";
            btn->setStyleSheet(style);
            btn->setEnabled(true);
            gridLayout->addWidget(btn, i, j);
            QObject::connect(btn, SIGNAL(clicked()), this, SLOT(chooseToFrom()));
            mapLayout.append(btn);
        }
    }

    draw(game->getCurrentPlayer());
}

void GameWindow::draw(int currentPlayer) {
    QVector<QVector<int>> localMap = game->getMap();
    int size = game->getSize();

    for(int i = 0; i < size; ++i) {
        for(int j = 0; j < size; ++j) {
            QString color;

            switch(localMap[i][j]) {
                case 0:
                    color = "#DDDDDD";
                break;
                case 1:
                    color = "#111111";
                break;
                default:
                    color = "#666666";
                break;
            }

            QString style = "QPushButton { background-color: " + color + " }";
            mapLayout[i * size + j]->setStyleSheet(style);
            mapLayout[i * size + j]->setEnabled((localMap[i][j] == currentPlayer)?true:false);
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
    if (game->loadGame(loadGameWidget->selectedGame()))
    {
        newGame();
        draw(game->getCurrentPlayer());
        QMessageBox::information(this, trUtf8("Kitolás"), trUtf8("Játék betöltve!"));
    }
    else
    {
        QMessageBox::warning(this, trUtf8("Kitolás"), trUtf8("A játék betöltése sikertelen!"));
    }
}

void GameWindow::saveGame() {
    if (game->saveGame(saveGameWidget->selectedGame()))
    {
        draw(game->getCurrentPlayer());
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

        int size = game->getSize();

        for(int i = 0; i < size; ++i) {
            for(int j = 0; j < size; ++j) {
                if(!(i == selected->getCoord().x() && j == selected->getCoord().y()) &&
                   !(i == selected->getCoord().x() + 1 && j == selected->getCoord().y()) &&
                   !(i == selected->getCoord().x() - 1 && j == selected->getCoord().y()) &&
                   !(i == selected->getCoord().x() && j == selected->getCoord().y() + 1) &&
                   !(i == selected->getCoord().x() && j == selected->getCoord().y() - 1)) {
                        mapLayout[i * size + j]->setEnabled(false);
                } else {
                    mapLayout[i * size + j]->setEnabled(true);
                }
            }
        }
    } else if(qobject_cast<CoordButton*>(sender())->getCoord() == selected->getCoord()){
        draw(game->getCurrentPlayer());

        selected = nullptr;
    } else {
        CoordButton* dest = qobject_cast<CoordButton*>(sender());

        draw(game->getCurrentPlayer());

        emit move(selected->getCoord(), dest->getCoord());

        selected = nullptr;
    }
}


void GameWindow::loadBtn() {
    if(loadGameWidget == NULL) {
        loadGameWidget = new LoadGameWidget();
        connect(loadGameWidget, SIGNAL(accepted()), this, SLOT(loadGame()));
    }

    loadGameWidget->setGameList(game->saveGameList());
    loadGameWidget->open();
}

void GameWindow::saveBtn() {
    if(saveGameWidget == NULL) {
        saveGameWidget = new SaveGameWidget();
        connect(saveGameWidget, SIGNAL(accepted()), this, SLOT(saveGame()));
    }

    saveGameWidget->setGameList(game->saveGameList());
    saveGameWidget->open();
}
