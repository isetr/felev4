#include "gamewindow.h"
#include <QMessageBox>
#include <QApplication>
#include <QHBoxLayout>

GameWindow::GameWindow(QWidget *parent) : QWidget(parent) {
    setFixedSize(800,600);
    setWindowTitle(trUtf8("Lopakodó"));

    setFocusPolicy(Qt::StrongFocus);

    game = new GameLogic();
    connect(game, SIGNAL(gameOver(bool)), this, SLOT(gameOverHandler(bool)));
    connect(game, SIGNAL(gameOver(bool)), game, SLOT(pauseGame()));
    connect(game, SIGNAL(draw()), this, SLOT(draw()));
    connect(this, SIGNAL(movePlayer(char)), game, SLOT(stepGame(char)));

    btnEasy = new QPushButton(trUtf8("Könnyű"));
    connect(btnEasy, SIGNAL(clicked()), this, SLOT(newGame()));

    btnMedium = new QPushButton(trUtf8("Közepes"));
    connect(btnMedium, SIGNAL(clicked()), this, SLOT(newGame()));

    btnHard = new QPushButton(trUtf8("Nehéz"));
    connect(btnHard, SIGNAL(clicked()), this, SLOT(newGame()));

    btnPause = new QPushButton(trUtf8("Szünet/Indít"));
    btnPause->setEnabled(false);
    connect(btnPause, SIGNAL(clicked()), game, SLOT(pauseGame()));

    QHBoxLayout* hlayout = new QHBoxLayout();
    hlayout->addWidget(btnEasy);
    hlayout->addWidget(btnMedium);
    hlayout->addWidget(btnHard);
    hlayout->addWidget(btnPause);

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

    if(QObject::sender() == btnEasy) {
        game->newGame(":/level/easy.txt");
    } else if (QObject::sender() == btnMedium) {
        game->newGame(":/level/medium.txt");
    } else if (QObject::sender() == btnHard) {
        game->newGame(":/level/hard.txt");
    }

    btnPause->setEnabled(true);

    QVector<QString> localMap = game->getMap();

    for(int i = 0; i < localMap.size(); ++i) {
        for(int j = 0; j < localMap.size(); ++j) {
            QPushButton* btn = new QPushButton();
            QString color;

            switch(localMap[i][j].toLatin1()) {
                case 'P':
                    color = "#FF00FF";
                break;
                case 'R':
                    color = "#006600";
                break;
                case 'X':
                    color = "#FF0000";
                break;
                case '#':
                    color = "#000000";
                break;
                default:
                    color = "#FFFFFF";
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

            switch(localMap[i][j].toLatin1()) {
                case 'P':
                    color = "#FF00FF";
                break;
                case 'R':
                    color = "#006600";
                break;
                case 'X':
                    color = "#FF0000";
                break;
                case '#':
                    color = "#000000";
                break;
                default:
                    color = "#FFFFFF";
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
