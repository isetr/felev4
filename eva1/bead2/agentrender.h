#ifndef AgentRender_H
#define AgentRender_H

#include <QPoint>
#include <QString>

struct AgentRender {
    AgentRender(QPoint Coord, QString Color) : coord(Coord), color(Color) {}
    QPoint coord;
    QString color;
    void render() {
        
    }
}


#endif // AgentRender_H