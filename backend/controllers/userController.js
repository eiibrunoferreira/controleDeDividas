const prisma = require("../lib/prisma");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function registerUser(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        error: "Preencha todos os campos.",
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return res.status(409).json({
        error: "Este e-mail já está cadastrado.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return res.status(201).json({
      message: "Usuário criado com sucesso.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Erro interno do servidor.",
    });
  }
}

async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Preencha todos os campos.",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(401).json({
        error: "E-mail ou senha incorretos.",
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        error: "E-mail ou senha incorretos.",
      });
    }

    const token = jwt.sign(
      {
        userId: user.id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.status(200).json({
      message: "Login realizado com sucesso.",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Erro interno do servidor.",
    });
  }
}

async function getMe(req, res) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        profileImage: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        error: "Usuário não encontrado.",
      });
    }

    return res.status(200).json(user);

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Erro interno do servidor.",
    });
  }
}

async function updateMe(req, res) {
  try {
    const { name, profileImage } = req.body;

    // -------------------------------------------------
    // VERIFICAÇÃO DOS CAMPOS RECEBIDOS
    // -------------------------------------------------

    if (
      name === undefined &&
      profileImage === undefined
    ) {
      return res.status(400).json({
        error: "Nenhuma informação para atualizar.",
      });
    }

    if (
      name !== undefined &&
      (!name || !name.trim())
    ) {
      return res.status(400).json({
        error: "O nome não pode ficar vazio.",
      });
    }

    if (
      profileImage !== undefined &&
      profileImage !== null &&
      typeof profileImage !== "string"
    ) {
      return res.status(400).json({
        error: "Imagem de perfil inválida.",
      });
    }

    // -------------------------------------------------
    // DADOS QUE SERÃO ATUALIZADOS
    // -------------------------------------------------

    const data = {};

    if (name !== undefined) {
      data.name = name.trim();
    }

    if (profileImage !== undefined) {
      data.profileImage = profileImage;
    }

    // -------------------------------------------------
    // ATUALIZAR USUÁRIO
    // -------------------------------------------------

    const user = await prisma.user.update({
      where: {
        id: req.userId,
      },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        profileImage: true,
      },
    });

    return res.status(200).json(user);

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Erro ao atualizar o usuário.",
    });
  }
}

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateMe,
};