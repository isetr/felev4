#include <QCoreApplication>
#include "gamewindow.h"

int main(int argc, char *argv[])
{
    QCoreApplication a(argc, argv);
    GameWindow w;
    w.run();
    return a.exec();
}
