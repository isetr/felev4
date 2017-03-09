#include "game.h"

#include <QPoint>

Game::Game(QWidget* parent) : QWidget(parent) {
    setWindowTitle(trUtf8("N Királynő"));
    setFixedSize(400, 400);

    gameBtn = new QPushButton(trUtf8("Új játék"));
    gridLayout = new QGridLayout();

    vBoxLayout = new QVBoxLayout();
    vBoxLayout->addWidget(gameBtn);
    vBoxLayout->addLayout(gridLayout);

    setLayout(vBoxLayout);

    gridSizeDialog = new GridResizeDialog();
    connect(gameBtn, SIGNAL(clicked()), gridSizeDialog, SLOT(exec()));
    connect(gridSizeDialog, SIGNAL(accepted()), this, SLOT(newGame()));
}

Game::~Game() {

}

void Game::setQueen() {
    tries++;

    CoordButton* currBtn = qobject_cast<CoordButton*>(sender());
    QPoint currCoord = currBtn->getCoord();

    queensOnTable += (currBtn->text() == "X")?-1:1;
    currBtn->setText((currBtn->text() == "X")?"":"X");

    int color = (currBtn->text() == "X")?30:255;

    QString style = "QPushButton { background-color: rgb(" +
            QString::number(color) + "," +
            QString::number(color) + "," +
            QString::number(color) + ") }";

    foreach(CoordButton* btn, buttonGrid) {
        if(sameLine(btn->getCoord(), currCoord)) {
            btn->setStyleSheet(style);
            btn->setEnabled(!(currBtn->text() == "X"));
        }
    }

    refreshTable();
}

void Game::refreshTable() {
    QString style;
    int color;
    foreach(CoordButton* btnX, buttonGrid) {
        if(btnX->text() == "X") {
            foreach(CoordButton* btn, buttonGrid) {
                if(sameLine(btnX->getCoord(), btn->getCoord())) {

                    color = (btnX->text() == "X")?30:255;

                    style = "QPushButton { background-color: rgb(" +
                                QString::number(color) + "," +
                                QString::number(color) + "," +
                                QString::number(color) + ") }";

                    btn->setStyleSheet(style);
                    btn->setEnabled(!(btnX->text() == "X" && btn->text() == ""));
                }
            }
        }
    }

    if(isOver()) {
        winDialog = new WinDialog(tries);
        connect(winDialog, SIGNAL(accepted()), gridSizeDialog, SLOT(exec()));

        winDialog->exec();
    }
}

bool Game::sameLine(QPoint a, QPoint b) {
    return a.x() == b.x() || a.y() == b.y() ||
           a.x() - a.y() == b.x() - b.y() ||
           a.y() + a.x() == b.y() + b.x();
}

bool Game::isOver() {
    return queensOnTable == tableSize;
}

void Game::newGame() {
    queensOnTable = 0;
    tries = 0;

    foreach(CoordButton* btn, buttonGrid) {
        gridLayout->removeWidget(btn);
        delete btn;
    }

    buttonGrid.clear();

    tableSize = gridSizeDialog->gridSize();

    for(int i = 0; i < tableSize; ++i) {
        for(int j = 0; j < tableSize; ++j) {
            CoordButton* btn = new CoordButton(QPoint(i, j));
            QString style = "QPushButton { background-color: rgb(255,255,255) }";
            btn->setStyleSheet(style);
            gridLayout->addWidget(btn, i, j);
            buttonGrid.append(btn);
            QObject::connect(btn, SIGNAL(clicked()), this, SLOT(setQueen()));
        }
    }
}
