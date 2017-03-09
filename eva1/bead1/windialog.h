#ifndef WINDIALOG_H
#define WINDIALOG_H

#include <QDialog>
#include <QLabel>
#include <QSpinBox>
#include <QPushButton>

class WinDialog : public QDialog
{
public:
    WinDialog(int tries, QWidget* parent = 0);
private:
    QLabel* label;
    QPushButton* submitBtn;
};

#endif // WINDIALOG_H
