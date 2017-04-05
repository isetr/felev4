#include "gamewindow.h"
#include <QMessageBox>
#include <QApplication>
#include <QHBoxLayout>

GameWindow::GameWindow(QWidget *parent) : QWidget(parent) {
    setFixedSize(800,600);
    setWindowTitle(trUtf8("Lopakodó"));

    game = new GameLogic();
    connect(game, SIGNAL(gameOver(bool)), this, SLOT(gameOverHandler(bool)));
    connect(game, SIGNAL(draw()), this, SLOT(draw()));

    btnEasy = new QPushButton(trUtf8("Könnyű"));
    connect(btnEasy, SIGNAL(clicked()), this, SLOT(newGame()));

    btnMedium = new QPushButton(trUtf8("Közepes"));
    connect(btnMedium, SIGNAL(clicked()), this, SLOT(newGame()));

    btnHard = new QPushButton(trUtf8("Nehéz"));
    connect(btnHard, SIGNAL(clicked()), this, SLOT(newGame()));

    btnPause = new QPushButton(trUtf8("Játék szünet"));
    btnPause->setEnabled(false);
    connect(btnPause, SIGNAL(clicked()), game, SLOT(pauseGame()));

    QHBoxLayout* hlayout = new QHBoxLayout();
    hlayout->addWidget(btnEasy);
    hlayout->addWidget(btnMedium);
    hlayout->addWidget(btnHard);
    hlayout->addWidget(btnPause);

    gridLayout = new GridLayout();

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

    int size = 0;

    if(QObject::sender() == btnEasy) {
        game->newGame("level/easy.txt");
        resize(10);
        size = 10;
    } else if (QObject::sender() == btnMedium) {
        game->newGame("level/medium.txt");
        resize(15);
        size = 15;
    } else if (QObject::sender() == btnHard) {
        game->newGame("level/hard.txt");
        resize(20);
        size = 20;
    }

    btnPause->setEnable(true);

    QVector<QString> localMap = game.getMap();

    for(int i = 0; i < localMap.size(); ++i) {
        for(int j = 0; j < localMap.size(); ++j) {
            QPushButton* btn = new QPushButton();
            QString color;

            switch(localMap[i][j]) {
                case 'P':
                    color = "#FFFFFF";
                break;
                case 'E':
                    color = "#006600";
                break;
                case 'X':
                    color = "#FF0000";
                break;
                default:
                    color = "#000000";
                break;
            }

            QString style = "QPushButton { background-color: " + color + " }";
            btn->setStyleSheet(style);

            gridLayout->addWidget(btn, i, j);
            
            mapLayout.append(btn);
        }
    }
}

void GameWindow::draw() {
    QVector<QString> localMap = game.getMap();  
    for(int i = 0; i < size; ++i) {
        for(int j = 0; j < size; ++j) {
            QString color;

            switch(localMap[i][j]) {
                case 'P':
                    color = "#FFFFFF";
                break;
                case 'E':
                    color = "#006600";
                break;
                case 'X':
                    color = "#FF0000";
                break;
                default:
                    color = "#000000";
                break;
            }

            QString style = "QPushButton { background-color: " + color + " }";
            btn->setStyleSheet(style);
        }
    }
}

void GameWindow::gameOverHandel(bool isWon) {
    if(isWon) {
        QMessageBox::information(this, trUtf8("Játék vége"),
                                 trUtf8("Sikeresen kijutottál!"));
    } else {
        QMessageBox::information(this, trUtf8("Játék vége"),
                                 trUtf8("Elkaptak az őrök!"));
    }
}