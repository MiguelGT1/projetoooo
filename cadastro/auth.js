const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const path = require('path');
const app = express();

// Inicialize o Firebase Admin SDK com as configurações do seu projeto Firebase
const serviceAccount = require('../cadastros-5b0e6-firebase-adminsdk-sl1lx-44bf4289ad.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://cadastros-5b0e6-default-rtdb.firebaseio.com',
});

// Configurar o middleware para servir arquivos estáticos da pasta 'cadastro'
app.use(express.static(__dirname));
app.use('/img', express.static(path.join(__dirname, 'img')));

const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

// Rota para lidar com o cadastro
app.post('/cadastrar', async (req, res) => {
  const { email, senha } = req.body;

  try {
    const userRecord = await admin.auth().createUser({
      email: email,
      password: senha,
    });
    console.log('Usuário cadastrado com sucesso:', userRecord.uid);
    res.redirect('http://localhost:3000/login/login.html');
  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error);
    // Lidar com erros (por exemplo, exibir uma mensagem de erro no HTML)
    res.send('Erro ao cadastrar usuário: ' + error.message);
  }
});

app.listen(port, () => {
  console.log(`Servidor está escutando na porta ${port}`);
});
