#include <QString>
#include <QtTest>

#include "gamelogic.h"
#include "dataaccess.h"

class Bead3Test : public QObject
{
    Q_OBJECT

public:
    Bead3Test() {};

private:
    GameLogic* game;
    DataAccess* dataAccess;

private Q_SLOTS:
    void initTestCase();
    void cleanupTestCase();
    void testNewGame();

    void testLoadGame();
    void testSaveGame();
};

void Bead3Test::initTestCase() {
    dataAccess = new DataAccess;
    game = new GameLogic(dataAccess);
}

void Bead3Test::cleanupTestCase() {
    delete dataAccess;
    delete game;
}

void Bead3Test::testNewGame() {
    game->newGame(3);
    QCOMPARE(game->getSize(), 3);
    QCOMPARE(game->getCurrentPlayer(), 0);

    game->newGame(4);
    QCOMPARE(game->getSize(), 4);
    QCOMPARE(game->getCurrentPlayer(), 0);

    game->newGame(6);
    QCOMPARE(game->getSize(), 6);
    QCOMPARE(game->getCurrentPlayer(), 0);
}

void Bead3Test::testLoadGame() {
    game->newGame(3);

    game->loadGame(0);

    QCOMPARE(game->getSize(), 0);
    QCOMPARE(game->getCurrentPlayer(), 0);
}

void Bead3Test::testSaveGame() {
    game->newGame(3);

    game->saveGame(0);
}

QTEST_APPLESS_MAIN(Bead3Test)

#include "tst_bead3test.moc"
