#include <QString>
#include <QtTest>
#include "../Agent.h"
#include "../gamelogic.h"
#include "../gamewindow.h"

class UnitTest : public QObject
{
    Q_OBJECT

public:
    UnitTest() : player(QPoint(0,0)), enemy(QPoint(0,1), 'S'), exit(1,1) {}

private:
    Agent player;
    Enemy enemy;
    QPoint exit;

private Q_SLOTS:
    void checkMoveEnemy();
    void checkPlayerMove();
    void checkWin();
};

void UnitTest::checkMoveEnemy()
{
    QVERIFY(enemy.coord == QPoint(0,1));
    enemy.move();
    QVERIFY(enemy.coord == QPoint(0,2));
    enemy.dir = 'N';
    enemy.move();
    QVERIFY(enemy.coord == QPoint(0,1));
    enemy.dir = 'E';
    enemy.move();
    QVERIFY(enemy.coord == QPoint(1,1));
    enemy.dir = 'W';
    enemy.move();
    QVERIFY(enemy.coord == QPoint(0,1));
}

void UnitTest::checkPlayerMove()
{
    QVERIFY(player.coord == QPoint(0,0));
    player.move('S');
    QVERIFY(player.coord == QPoint(0,1));
    player.move('N');
    QVERIFY(player.coord == QPoint(0,0));
    player.move('W');
    QVERIFY(player.coord == QPoint(-1,0));
    player.move('E');
    QVERIFY(player.coord == QPoint(0,0));
}

void UnitTest::checkWin() {
    QVERIFY(!(player.coord == exit));
    player.move('E');
    player.move('S');
    QVERIFY(player.coord == exit);
}

QTEST_APPLESS_MAIN(UnitTest)

#include "tst_unittest.moc"
