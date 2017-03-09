#ifndef GRIDRESIZEDIALOG_H
#define GRIDRESIZEDIALOG_H

#include <QDialog>
#include <QLabel>
#include <QSpinBox>
#include <QPushButton>

class GridResizeDialog : public QDialog
{
    Q_OBJECT
public:
    GridResizeDialog(QWidget* parent = 0);
    int gridSize();

private:
    QLabel* label;
    QSpinBox* spinBox;
    QPushButton* submitBtn;
    QPushButton* cancelBtn;
};

#endif // GRIDRESIZEDIALOG_H
