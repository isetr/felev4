#ifndef DATAACCESS_H
#define DATAACCESS_H

#include <QString>
#include <QVector>

class DataAccess {
public:
    explicit DataAccess() {}

    QVector<QString> saveGameList() const; 

    bool loadGame(int gameIndex, QVector<int> &saveGameData); 
    bool saveGame(int gameIndex, const QVector<int> &saveGameData); 
};

#endif // DATAACCESS_H
