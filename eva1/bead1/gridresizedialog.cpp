#include <QBoxLayout>

#include "gridresizedialog.h"

GridResizeDialog::GridResizeDialog(QWidget* parent) : QDialog(parent)
{
    setFixedSize(256,128);
    setWindowTitle(trUtf8("Tábla mérete"));
    setModal(true);

    label = new QLabel(trUtf8("Tábla méret: "));
    spinBox = new QSpinBox();
    spinBox->setRange(4, 8);
    spinBox->setSingleStep(2);

    submitBtn = new QPushButton(trUtf8("OK"));
    submitBtn->setFixedSize(75, 23);
    cancelBtn = new QPushButton(trUtf8("NO"));
    cancelBtn->setFixedSize(75, 23);

    if(spinBox->value() % 2 == 0) {
        connect(submitBtn, SIGNAL(clicked()), this, SLOT(accept()));
    }
    connect(cancelBtn, SIGNAL(clicked()), this, SLOT(reject()));

    QHBoxLayout* uLayer = new QHBoxLayout();
    uLayer->addWidget(label);
    uLayer->addWidget(spinBox);

    QHBoxLayout* lLayer = new QHBoxLayout();
    lLayer->addWidget(submitBtn);
    lLayer->addWidget(cancelBtn);

    QVBoxLayout* layer = new QVBoxLayout();
    layer->addLayout(uLayer);
    layer->addLayout(lLayer);

    setLayout(layer);
}

int GridResizeDialog::gridSize() {
    return spinBox->value();
}
