#ifndef Agent_H
#define Agent_H

#include <QPoint>
#include <QString>

struct Agent {
    Agent(QPoint Coord) : coord(Coord) {}
    QPoint coord;
    char dir;
    void move(char dir) {
        switch(dir) {
            case 'N':
                coord = QPoint(coord.x, coord.y - 1);
            break;
            case 'S':
                coord = QPoint(coord.x, coord.y + 1);
            break;
            case 'W':
                coord = QPoint(coord.x - 1, coord.y);
            break;
            case 'E':
                coord = QPoint(coord.x + 1, coord.y);
            break;
        }
    }
}

struct Enemy : public Agent {
    Enemy(QPoint Coord, char Dir) : Agent(Coord), dir(Dir) {}
    char dir;
    void move() {
        move(dir);
    }
}


#endif // Agent_H