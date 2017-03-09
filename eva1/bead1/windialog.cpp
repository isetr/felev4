#include <QBoxLayout>

#include "windialog.h"

WinDialog::WinDialog(int tries, QWidget* parent) : QDialog(parent)
{
    setFixedSize(256,128);
    setWindowTitle(trUtf8("Játék vége"));
    setModal(true);

    label = new QLabel(QStringLiteral("Nyertél! Lépések száma: %1.").arg(tries));

    submitBtn = new QPushButton(trUtf8("OK"));
    submitBtn->setFixedSize(75, 23);

    connect(submitBtn, SIGNAL(clicked()), this, SLOT(accept()));

    QHBoxLayout* uLayer = new QHBoxLayout();
    uLayer->addWidget(label);

    QHBoxLayout* lLayer = new QHBoxLayout();
    lLayer->addWidget(submitBtn);

    QVBoxLayout* layer = new QVBoxLayout();
    layer->addLayout(uLayer);
    layer->addLayout(lLayer);

    setLayout(layer);
}
