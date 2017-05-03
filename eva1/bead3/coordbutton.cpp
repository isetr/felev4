#include "coordbutton.h"

CoordButton::CoordButton(QPoint coord, QWidget* parent) : QPushButton(parent)
{
    this->coord = coord;
}
