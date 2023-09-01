const express = require('express');
const formidable = require('formidable');
const admin = require('firebase-admin');
const serviceAccount = require('./cadastros-5b0e6-firebase-adminsdk-sl1lx-02ab411e76.json');
const fetch = require('node-fetch'); // Importe o pacote node-fetch

const app = express();
const PORT = process.env.PORT || 3000;

// Configurar o Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'gs://cadastros-5b0e6.appspot.com', // Substitua pelo nome do seu bucket
  databaseURL: 'https://cadastros-5b0e6-default-rtdb.firebaseio.com/', // Substitua pelo URL do seu Firebase Realtime Database
});

// Configuração para fazer upload de arquivos para o Firebase Storage
const bucket = admin.storage().bucket();

app.use(express.static('public'));

app.post('/upload', (req, res) => {
  const form = new formidable.IncomingForm();

  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: 'Erro no upload do arquivo' });
    }

    const file = files.file; // Obtenha o arquivo do formulário
    if (!file) {
      return res.status(400).json({ error: 'Nenhum arquivo foi enviado.' });
    }

    // Crie uma referência para o local onde deseja armazenar o arquivo no Firebase Storage
    const storageRef = bucket.file('imagens/' + file.name);

    // Faça o upload do arquivo para o Firebase Storage
    const uploadStream = storageRef.createWriteStream();
    uploadStream.on('error', (error) => {
      console.error('Erro ao fazer upload da imagem:', error);
      return res.status(500).json({ error: 'Erro ao fazer upload da imagem.' });
    });

    uploadStream.on('finish', () => {
      console.log('Imagem carregada com sucesso!');
      // Após o upload, você pode obter a URL pública da imagem
      storageRef.getSignedUrl({ action: 'read', expires: '01-01-2023' }) // Configure a expiração conforme necessário
        .then((downloadURL) => {
          // Aqui você pode salvar o downloadURL no Firebase Realtime Database com os outros dados do usuário
          const userData = {
            nome: fields.nome,
            // Outros campos do formulário
            imagemURL: downloadURL, // Salva a URL da imagem no Firebase Realtime Database
          };

          const db = admin.database();
          const ref = db.ref('usuarios'); // Substitua 'usuarios' pelo nome da sua coleção

          ref.push(userData, (error) => {
            if (error) {
              console.error('Erro ao inserir dados no Firebase Realtime Database:', error);
              return res.status(500).json({ error: 'Erro ao inserir dados no Firebase Realtime Database.' });
            }

            console.log('Dados inseridos com sucesso no Firebase Realtime Database');
            return res.status(200).json({ url: downloadURL }); // Envie a URL da imagem de volta para o cliente
          });
        })
        .catch((error) => {
          console.error('Erro ao obter a URL da imagem:', error);
          return res.status(500).json({ error: 'Erro ao obter a URL da imagem.' });
        });
    });

    uploadStream.end(file.data);
  });
});

// Adicione o código JavaScript aqui
app.get('/', (req, res) => {
  // Renderize seu formulário HTML aqui
  // Por exemplo:
  res.sendFile(__dirname + '/index.html');
});

app.get('/style.css', (req, res) => {
  // Rota para entregar o arquivo CSS
  res.sendFile(__dirname + '/style.css');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
