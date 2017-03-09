#ifndef GAME_H
#define GAME_H

#include <QWidget>
#include <QPushButton>
#include <QVector>
#include <QGridLayout>
#include <QVBoxLayout>

#include "coordbutton.h"
#include "gridresizedialog.h"
#include "windialog.h"

class Game : public QWidget
{
    Q_OBJECT

public:
    Game(QWidget* parent = 0);
    ~Game();

private slots:
    void newGame();
    void setQueen();
    void refreshTable();
    bool sameLine(QPoint a, QPoint b);
    bool isOver();

private:
    GridResizeDialog* gridSizeDialog;
    QPushButton* gameBtn;
    QGridLayout* gridLayout;
    QVector<CoordButton*> buttonGrid;
    QVBoxLayout* vBoxLayout;
    WinDialog* winDialog;


    int queensOnTable;
    int tableSize;
    int tries;
};

#endif // GAME_H
