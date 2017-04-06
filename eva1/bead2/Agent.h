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
                coord += QPoint(0,-1);
            break;
            case 'S':
                coord += QPoint(0,1);
            break;
            case 'W':
                coord += QPoint(-1,0);
            break;
            case 'E':
                coord += QPoint(1,0);
            break;
        }
    }
};

struct Enemy : public Agent {
    Enemy(QPoint Coord, char Dir) : Agent(Coord), dir(Dir) {}
    char dir;
    void move() {
        Agent::move(dir);
    }
};


#endif // Agent_H
