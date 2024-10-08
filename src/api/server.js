const dotenv = require('dotenv').config()

const { SECRET_ACCESS_TOKEN } = process.env;
const express = require('express');
const cors = require('cors');

const sqlite3 = require('sqlite3').verbose();
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken');
const e = require('express');
const cookieParser = require('cookie-parser');

const app = express();

const port = 3000;

app.use(cors());
app.disable("x-powered-by");
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

function geraNumeroAleatorio(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function geraAcessoJWT(idUsuario) {
  let payload = {
    id: idUsuario
  };
  return jwt.sign(payload, SECRET_ACCESS_TOKEN, {
    expiresIn: '20m',
  });
};

async function login(req, res) {
  let db = new sqlite3.Database('./users.db', (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Conectou no banco de dados!');
  });

  const { email, senha } = req.body;
  console.log(email); 
  console.log(senha);

  // recupera a senha do usuário que está tentando fazer login
  db.get('SELECT senha FROM usuario WHERE email = ?', [email], async (error, result) => {
    if (error) {
      console.log(error)
    }
    else if (result) {
      db.close((err) => {
        if (err) {
          console.log(err.message);
          return console.error(err.message);
        }
        console.log('Fechou a conexão com o banco de dados.');
      });

      let senhaCorreta = await bcrypt.compare(senha, result.senha)
      if (!senhaCorreta) {
        return res.status(401).json({
          status: 'failed',
          message: 'Login ou senha incorretos!',
        });
      }

      let options = {
        maxAge: 20 * 60 * 1000, // minutos * segundos * milissegundos = total 20 minutos
        httpOnly: true, // restringe acesso ao cookie apenas para o servidor
        secure: true,
        sameSite: "None",
      };
      const token = geraAcessoJWT(); // gera um token de sessão para o usuário
      console.log(token)
      res.cookie("SessionID", token, options); // preenche o token na resposta para ser utilizado pelo cliente nas próximas requisições
        res.status(200).json({
            status: "success",
            message: "Autenticação realizada com sucesso!",
        });
    }
  });
}

async function verificaToken(req, res, next) {
  const authHeader = req.headers['cookie']

  // se o cookie não estiver presente o usuário não está logado
  if (!authHeader) {
    return res.status(401).json({
      status: 'failed',
      message: 'Você não está logado!',
    });
  }
  const requestToken = authHeader.split('=')[1] // na posição 0 está o nome da variável, na posição 1 o valor, no caso o token
  jwt.verify(requestToken, SECRET_ACCESS_TOKEN, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        status: 'failed',
        message: 'Sessão expirada!',
      });
    }

    // o conteúdo decodificado do token é o id do usuário
    const { id } = decoded;

    // recupera dados do usuário que está tentando fazer login
    db.get('SELECT id, nome, email FROM usuario WHERE id = ?', [id], async (error, result) => {
      if (error) {
        console.log(error)
      }
      else if (result) {
        db.close((err) => {
          if (err) {
            return console.error(err.message)
          }
          console.log('Fechou a conexão com o banco de dados.')
        });
      }
    });
    const { userId, nome, email } = result
    req.userId = userId
    req.email = email
    req.nome = nome
    next();
  });
}

app.post("/login", login);


app.get('/hello', (req, res) => {
  let aleatorio = geraNumeroAleatorio(0,100);
  res.status(200).json({
    texto_completo:`Olá mundo! Sorteei o número ${aleatorio}!`,
    saudacao: 'Olá mundo!',
    numero: aleatorio
  });
});

app.get('/usuarios', verificaToken, (req, res) => {
  let db = new sqlite3.Database('./users.db', (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Conectou no banco de dados!');
  });

  // Seleciona todos os usuários da tabela 'usuario'
  db.all('SELECT * FROM usuario', [], (err, rows) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        message: 'Erro ao consultar o banco de dados!',
        error: err.message
      });
    }

    // Fecha a conexão com o banco de dados
    db.close((err) => {
      if (err) {
        return console.error(err.message);
      }
      console.log('Fechou a conexão com o banco de dados.');
    });

    // Retorna os dados dos usuários em formato JSON
    res.status(200).json({
      status: 'success',
      usuarios: rows
    });
  });
});


app.post('/usuarios/novo', verificaToken, (req, res) => {
  const { nome, email, senha, conf_senha } = req.body;
  console.log(req);
  // Aqui começa a validação dos campos do formulário
  let erro = "";
  if (nome.length < 1 || email.length < 1 || senha.length < 1 || conf_senha.length < 1) {
    erro += 'Por favor, preencha todos os campos corretamente!';
  }
  if (senha != conf_senha) {
    erro += 'As senhas digitadas não são iguais!';
  }
  if (erro) {
    res.status(500).json({
      status: 'failed',
      message: erro,
    });
  }
  else {
    // aqui começa o código para inserir o registro no banco de dados
    let db = new sqlite3.Database('./users.db', (err) => {
      if (err) {
        return console.error(err.message);
      }
      console.log('Conectou no banco de dados!');
    });
    db.get('SELECT email FROM usuario WHERE email = ?', [email], async (error, result) => {
      if (error) {
        console.log(error)
      }
      else if (result) {
        db.close((err) => {
          if (err) {
            return console.error(err.message);
          }
          console.log('Fechou a conexão com o banco de dados.');
        });
        return res.status(500).json({
          status: 'failed',
          message: 'Este e-mail já está em uso!',
        });
      } else {
        let senha_criptografada = await bcrypt.hash(senha, 8)
        db.run('INSERT INTO usuario(nome, email, senha) VALUES (?, ?, ?)', [nome,
          email, senha_criptografada], (error2) => {
            if (error2) {
              console.log(error2)
            } else {
              db.close((err) => {
                if (err) {
                  return console.error(err.message);
                }
                console.log('Fechou a conexão com o banco de dados.');
              });
              return res.status(200).json({
                status: 'success',
                message: 'Registro feito com sucesso!',
                campos: req.body
              });
            }
          });
      }
    });
  }
});

app.delete('/usuarios/:id_usuario', verificaToken, (req, res) => {
  const { id_usuario } = req.params;

  // Conectar ao banco de dados SQLite
  let db = new sqlite3.Database('./users.db', (err) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        message: 'Erro ao conectar ao banco de dados!',
        error: err.message
      });
    }
    console.log('Conectou no banco de dados!');
  });

  // Deletar o usuário pelo ID
  db.run('DELETE FROM usuario WHERE id_usuario = ?', [id_usuario], function (err) {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        message: 'Erro ao tentar remover o usuário ${id_usuario}!',
        error: err.message
      });
    }
    // Fechar a conexão com o banco de dados
    db.close((err) => {
      if (err) {
        return console.error(err.message);
      }
      console.log('Fechou a conexão com o banco de dados.');
    });

    // Retornar uma resposta de sucesso
    return res.status(200).json({
      status: 'success',
      message: `Usuário com id ${id_usuario} removido com sucesso!`
    });
  });
});

  

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
