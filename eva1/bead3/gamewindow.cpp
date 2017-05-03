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

    if(QObject::sender() == btn3) {
        game->newGame(3);
    } else if (QObject::sender() == btn4) {
        game->newGame(4);
    } else if (QObject::sender() == btn6) {
        game->newGame(6);
    }

    btnPause->setEnabled(true);

    QVector<QString> localMap = game->getMap();

    for(int i = 0; i < localMap.size(); ++i) {
        for(int j = 0; j < localMap.size(); ++j) {
            QPushButton* btn = new QPushButton();
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
            
            mapLayout.append(btn);
        }
    }
}

void GameWindow::draw() {
    QVector<QString> localMap = game->getMap();
    for(int i = 0; i < localMap.size(); ++i) {
        for(int j = 0; j < localMap.size(); ++j) {
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
            mapLayout[i * localMap.size() + j]->setStyleSheet(style);
        }
    }
}

void GameWindow::gameOverHandler(bool isWon) {
    if(isWon) {
        QMessageBox::information(this, trUtf8("Játék vége"),
                                 trUtf8("Sikeresen kijutottál!"));
    } else {
        QMessageBox::information(this, trUtf8("Játék vége"),
                                 trUtf8("Elkaptak az őrök!"));
    }
    btnPause->setEnabled(false);
}
