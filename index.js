const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const firebase = require('firebase/app');
const serviceAccount = require('./cadastros-5b0e6-firebase-adminsdk-sl1lx-44bf4289ad.json');
require('firebase/auth');
require('firebase/database');
const admin = require('firebase-admin');
const app = express();
const port = process.env.PORT || 3000;

// Função para normalizar nomes de arquivos
function normalizeFileName(fileName) {
  // Remove caracteres especiais e espaços em branco
  return fileName.replace(/[^a-zA-Z0-9_.-]/g, '');
}

// Variável global para rastrear o número do ID
let nextUserId = 1;

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDNZntYthN5X28obKPgrDesl-t1qjTggk8",
  authDomain: "cadastros-5b0e6.firebaseapp.com",
  databaseURL: "https://cadastros-5b0e6-default-rtdb.firebaseio.com",
  projectId: "cadastros-5b0e6",
  storageBucket: "cadastros-5b0e6.appspot.com",
  messagingSenderId: "1047927510078",
  appId: "1:1047927510078:web:4f4ba40664f5ba55be2d6f",
  measurementId: "G-9S8KXF9DG3"
};

firebase.initializeApp(firebaseConfig);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://cadastros-5b0e6-default-rtdb.firebaseio.com/', // URL do Realtime Database
  storageBucket: 'gs://cadastros-5b0e6.appspot.com' // URL do Firebase Storage
});

// Middleware para analisar campos do formulário e upload de arquivo
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(fileUpload());

// Servir arquivos estáticos (HTML, JavaScript, CSS)
app.use(express.static(__dirname));

app.post('/upload', async (req, res) => {
  try {
    // Obter os campos do formulário
    const nomeCompleto = req.body.nome;
    const telefone = req.body.telefone.replace(/\D/g, '');
    const email = req.body.email;
    const casaApto = req.body.casa_apto;
    const metrosQuadrados = req.body['metrosQuadrados'];
    if (metrosQuadrados === undefined || metrosQuadrados.trim() === '') {
      console.error('Campo "metrosQuadrados" é obrigatório.');
      res.status(400).send('Campo "metrosQuadrados" é obrigatório.');
      return;
    }
    const quartos = req.body.quartos;
    const decorado = req.body.decorado;
    const localizacao = req.body.rua;
    const condominioInput = req.body.condominio;
    const condominio = parseFloat(condominioInput.replace('R$', '').replace(',', '').replace('.', '')) / 100; // Formata o valor do condomínio
    const cidade = req.body.cidade;
    const iptuInput = req.body.iptu;
    const iptu = parseFloat(iptuInput.replace('R$', '').replace(',', '').replace('.', '')) / 100; // Formata o valor do IPTU
    const descricao = req.body.descricao || '';
    const valorDoImovelInput = req.body.valor;
    const valorDoImovel = parseFloat(valorDoImovelInput.replace('R$', '').replace(',', '').replace('.', '')) / 100; // Formata o valor do imóvel


    // Obter os arquivos enviados
    const uploadedImages = req.files.imagens;

    if (!uploadedImages || !uploadedImages.length) {
      console.error('Campo de imagens não fornecido ou vazio.');
      res.status(400).json({ error: 'Campo de imagens não fornecido ou vazio.' });
      return;
    }

    // Referência ao Realtime Database
    const db = admin.database();
    const ref = db.ref('usuarios');

    // Dados a serem inseridos no Firebase
    const userData = {
      id: `ID${nextUserId++}`, // Gere um ID único em ordem crescente
      nome_completo: nomeCompleto,
      telefone: telefone,
      email: email,
      casa_apto: casaApto,
      metros_quadrados: metrosQuadrados,
      quartos: quartos,
      decorado: decorado,
      localizacao: localizacao,
      condominio: `R$ ${condominio.toFixed(2).replace('.', ',')}`, // Formata o valor do condomínio
      cidade: cidade,
      iptu: `R$ ${iptu.toFixed(2).replace('.', ',')}`, // Formata o valor do IPTU
      descricao: descricao,
      valor_do_imovel: `R$ ${valorDoImovel.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, // Formata o valor do imóvel com separador de milhares e duas casas decimais
    };
  


    // Inserir dados no Firebase
    const newUserDataRef = ref.child(userData.id);
    await newUserDataRef.set(userData);

    // Inicialize o Firebase Storage
    const storage = admin.storage();
    const bucket = storage.bucket(); // Usará o bucket padrão do projeto

    // Loop através das imagens e faça o upload para o Firebase Storage
    const imageUploadPromises = uploadedImages.map(async (image) => {
      const fileName = `${userData.id}_${normalizeFileName(image.name)}`; // Nome da imagem incluindo o ID do usuário
      const file = bucket.file(fileName);

      // Faça o upload da imagem
      await file.save(image.data, {
        metadata: {
          contentType: image.mimetype
        },
      });

      return fileName; // Retorna o nome da imagem com o ID do usuário
    });

    const imageFileNames = await Promise.all(imageUploadPromises);

    // Atualize os dados do usuário com os nomes das imagens
    await newUserDataRef.update({ imagens: imageFileNames });

    // Enviar resposta de sucesso
    res.status(200).send('Dados e imagens inseridos com sucesso no Firebase.');
  } catch (error) {
    console.error('Erro ao inserir dados e imagens no Firebase:', error);
    res.status(500).send('Erro ao inserir dados e imagens no Firebase.');
  }
});
  



// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
