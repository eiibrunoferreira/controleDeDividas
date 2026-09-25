const prisma = require("../lib/prisma");

```js
async function createDebt(req, res) {
  try {
    const {
      name,
      description,
      amount,
      status,
      recurring,
      recurrenceType,
      recurrenceGroupId,
      recurrenceYear,
      dueDate,
      monthlyDueMode,
      monthlyWeekday,
      monthlyWeekOccurrence,
      recurrenceWeekday,
      recurrenceLimit,
      recurrenceNumber,
      recurrenceMonth,
      recurrenceMonths,
      annualPaidWeek,
      annualPaidMonth,
      annualPaidYear,
    } = req.body;

    if (!name || amount === undefined || amount === null) {
      return res.status(400).json({
        error: "Nome e valor da dívida são obrigatórios.",
      });
    }

    const debt = await prisma.debt.create({
      data: {
        name: name.trim(),

        description:
          description?.trim() || null,

        amount:
          Number(amount),

        status:
          status || "a-vencer",

        recurring:
          Boolean(recurring),

        recurrenceType:
          recurrenceType || null,

        recurrenceGroupId:
          recurrenceGroupId || null,

        recurrenceYear:
          recurrenceYear !== null &&
          recurrenceYear !== undefined
            ? Number(recurrenceYear)
            : null,

        dueDate:
          dueDate || null,

        monthlyDueMode:
          monthlyDueMode || null,

        monthlyWeekday:
          monthlyWeekday !== null &&
          monthlyWeekday !== undefined
            ? Number(monthlyWeekday)
            : null,

        monthlyWeekOccurrence:
          monthlyWeekOccurrence || null,

        recurrenceWeekday:
          recurrenceWeekday !== null &&
          recurrenceWeekday !== undefined &&
          recurrenceWeekday !== ""
            ? Number(recurrenceWeekday)
            : null,

        recurrenceLimit:
          recurrenceLimit !== null &&
          recurrenceLimit !== undefined
            ? Number(recurrenceLimit)
            : null,

        recurrenceNumber:
          recurrenceNumber !== null &&
          recurrenceNumber !== undefined
            ? Number(recurrenceNumber)
            : null,

        recurrenceMonth:
          recurrenceMonth !== null &&
          recurrenceMonth !== undefined
            ? Number(recurrenceMonth)
            : null,

        recurrenceMonths:
          recurrenceMonths !== null &&
          recurrenceMonths !== undefined
            ? recurrenceMonths
            : null,

        annualPaidWeek:
          annualPaidWeek !== null &&
          annualPaidWeek !== undefined
            ? Number(annualPaidWeek)
            : null,

        annualPaidMonth:
          annualPaidMonth !== null &&
          annualPaidMonth !== undefined
            ? Number(annualPaidMonth)
            : null,

        annualPaidYear:
          annualPaidYear !== null &&
          annualPaidYear !== undefined
            ? Number(annualPaidYear)
            : null,

        userId:
          req.userId,
      },
    });

    return res.status(201).json(debt);

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Erro ao criar a dívida.",
    });
  }
}
```


async function getDebts(req, res) {
  try {
    const debts = await prisma.debt.findMany({
      where: {
        userId: req.userId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return res.status(200).json(debts);

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Erro ao buscar as dívidas.",
    });
  }
}

async function updateDebt(req, res) {
  try {
    const { id } = req.params;

    const existingDebt = await prisma.debt.findFirst({
      where: {
        id,
        userId: req.userId,
      },
    });

    if (!existingDebt) {
      return res.status(404).json({
        error: "Dívida não encontrada.",
      });
    }

    const {
      name,
      description,
      amount,
      status,
      recurring,
      recurrenceType,
      recurrenceGroupId,
      recurrenceYear,
      dueDate,
      monthlyDueMode,
      monthlyWeekday,
      monthlyWeekOccurrence,
      recurrenceWeekday,
      recurrenceLimit,
      recurrenceNumber,
      recurrenceMonth,
      recurrenceMonths,
      annualPaidWeek,
      annualPaidMonth,
      annualPaidYear,
    } = req.body;

    const debt = await prisma.debt.update({
      where: {
        id,
      },

      data: {
        ...(name !== undefined && {
          name: name.trim(),
        }),

        ...(description !== undefined && {
          description: description?.trim() || null,
        }),

        ...(amount !== undefined && {
          amount: Number(amount),
        }),

        ...(status !== undefined && {
          status,
        }),

        ...(recurring !== undefined && {
          recurring: Boolean(recurring),
        }),

        ...(recurrenceType !== undefined && {
          recurrenceType: recurrenceType || null,
        }),

        ...(recurrenceGroupId !== undefined && {
          recurrenceGroupId: recurrenceGroupId || null,
        }),

        ...(recurrenceYear !== undefined && {
          recurrenceYear:
            recurrenceYear !== null
              ? Number(recurrenceYear)
              : null,
        }),

        ...(dueDate !== undefined && {
          dueDate: dueDate || null,
        }),

        ...(monthlyDueMode !== undefined && {
          monthlyDueMode: monthlyDueMode || null,
        }),

        ...(monthlyWeekday !== undefined && {
          monthlyWeekday:
            monthlyWeekday !== null
              ? Number(monthlyWeekday)
              : null,
        }),

        ...(monthlyWeekOccurrence !== undefined && {
          monthlyWeekOccurrence:
            monthlyWeekOccurrence || null,
        }),

        ...(recurrenceWeekday !== undefined && {
          recurrenceWeekday:
            recurrenceWeekday !== null
              ? Number(recurrenceWeekday)
              : null,
        }),

        ...(recurrenceLimit !== undefined && {
          recurrenceLimit:
            recurrenceLimit !== null
              ? Number(recurrenceLimit)
              : null,
        }),

        ...(recurrenceNumber !== undefined && {
          recurrenceNumber:
            recurrenceNumber !== null
              ? Number(recurrenceNumber)
              : null,
        }),

        ...(recurrenceMonth !== undefined && {
          recurrenceMonth:
            recurrenceMonth !== null
              ? Number(recurrenceMonth)
              : null,
        }),

        ...(recurrenceMonths !== undefined && {
          recurrenceMonths:
            recurrenceMonths !== null
              ? recurrenceMonths
              : null,
        }),

        ...(annualPaidWeek !== undefined && {
          annualPaidWeek:
            annualPaidWeek !== null
              ? Number(annualPaidWeek)
              : null,
        }),

        ...(annualPaidMonth !== undefined && {
          annualPaidMonth:
            annualPaidMonth !== null
              ? Number(annualPaidMonth)
              : null,
        }),

        ...(annualPaidYear !== undefined && {
          annualPaidYear:
            annualPaidYear !== null
              ? Number(annualPaidYear)
              : null,
        }),
      },
    });

    return res.status(200).json(debt);

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Erro ao atualizar a dívida.",
    });
  }
}

async function deleteDebt(req, res) {
  try {
    const { id } = req.params;

    const existingDebt = await prisma.debt.findFirst({
      where: {
        id,
        userId: req.userId,
      },
    });

    if (!existingDebt) {
      return res.status(404).json({
        error: "Dívida não encontrada.",
      });
    }

    await prisma.debt.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      message: "Dívida excluída com sucesso.",
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Erro ao excluir a dívida.",
    });
  }
}

module.exports = {
  createDebt,
  getDebts,
  updateDebt,
  deleteDebt,
};