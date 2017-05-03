#include "dataaccess.h"
#include <QDateTime>
#include <QFileInfo>
#include <QFile>
#include <QTextStream>
#include <QDebug>

QVector<QString> DataAccess::saveGameList() const
{
    QVector<QString> result(5);

    return result;
}

bool DataAccess::loadGame(int gameIndex, QVector<int> &saveGameData)
{
    saveGameData.resize(64);

    qDebug() << "game loaded: ";
    for (int i = 0; i < saveGameData.size(); i++)
        qDebug() << saveGameData[i] << " ";

    return true;
}

bool DataAccess::saveGame(int gameIndex, const QVector<int> &saveGameData)
{
    qDebug() << "game saved: ";
    for (int i = 0; i < saveGameData.size(); i++)
        qDebug() << saveGameData[i] << " ";

    return true;

    return true;
}

