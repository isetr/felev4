#ifndef COORDBUTTON_H
#define COORDBUTTON_H

#include <QPushButton>
#include <QPoint>

class CoordButton : public QPushButton
{
    Q_OBJECT
public:
    CoordButton(QPoint coord, QWidget* parent = 0);
    QPoint getCoord() { return coord; }

private:
    QPoint coord;
};

#endif // COORDBUTTON_H
