//PARA QUANDO ADICIONAR AS IMAGENS

function previewImages(event) {
  const previewContainer = document.getElementById("imagePreview");
  previewContainer.innerHTML = ""; // Limpa a visualização antes de atualizar

  const files = event.target.files;

  for (const file of files) {
    const reader = new FileReader();

    reader.onload = function (e) {
      const image = document.createElement("img");
      image.src = e.target.result;
      image.classList.add("preview-image");
      previewContainer.appendChild(image);
    };

    reader.readAsDataURL(file);
  }
}

//valor input
function formatCurrency(input) {
    var value = input.value.replace(/\D/g, ''); // Remove caracteres não numéricos

    if (value === '') {
        input.value = '';
        return;
    }

    var formattedValue = (parseFloat(value) / 100).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    input.value = formattedValue;
}
//number
document.addEventListener("DOMContentLoaded", function () {
    const telefoneInput = document.getElementById("telefone");

    telefoneInput.addEventListener("input", function () {
        let value = telefoneInput.value.replace(/\D/g, ''); // Remove todos os caracteres não numéricos

        if (value.length > 0) {
            if (value.length <= 2) {
                value = `(${value}`;
            } else if (value.length <= 6) {
                value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
            } else if (value.length <= 10) {
                value = `(${value.slice(0, 2)}) ${value.slice(2, 6)}-${value.slice(6)}`;
            } else if (value.length <= 11) {
                value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
            } else {
                value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7, 11)}`;
            }
        }

        telefoneInput.value = value;
    });
});

document.getElementById('login_button').addEventListener('click', function (event) {
    event.preventDefault();

    const formData = new FormData(document.getElementById('login_form')); // Criar formData aqui

    fetch('/upload', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            // Resto do código
        })
        .catch(error => {
            console.error('Erro ao enviar os dados:', error);
        });
});

// ...

document.getElementById('login_button').addEventListener('click', function (event) {
    event.preventDefault(); // Evita que o formulário seja enviado normalmente

    // Realize a requisição AJAX ou lógica de envio de dados aqui

    // Validar o campo 'metros_quadrados'

    const metrosQuadrados = document.getElementById('metrosQuadrados').value;
    if (!metrosQuadrados) {
        alert('Campo "metrosQuadrados" é obrigatório.');
        return; // Impede o envio do formulário se o campo estiver vazio
    }

    // Validar o campo 'quartos'
    const quartos = document.getElementById('quartos').value;
    if (!quartos) {
        alert('Campo "quartos" é obrigatório.');
        return;
    }

    // Validar o campo 'decorado'
    const decorado = document.getElementById('decorado').value;
    if (!decorado) {
        alert('Campo "decorado" é obrigatório.');
        return;
    }

    // Validar o campo 'rua'
    const rua = document.getElementById('rua').value;
    if (!rua) {
        alert('Campo "rua" é obrigatório.');
        return;
    }

    // Validar o campo 'condominio'
    const condominio = document.getElementById('condominio').value;
    if (!condominio) {
        alert('Campo "condominio" é obrigatório.');
        return;
    }

    // Validar o campo 'cidade'
    const cidade = document.getElementById('cidade').value;
    if (!cidade) {
        alert('Campo "cidade" é obrigatório.');
        return;
    }

    // Validar o campo 'iptu'
    const iptu = document.getElementById('iptu').value;
    if (!iptu) {
        alert('Campo "iptu" é obrigatório.');
        return;
    }

    // Validar o campo 'valor'
    const valor = document.getElementById('valor').value;
    if (!valor) {
        alert('Campo "valor" é obrigatório.');
        return;
    }

    // Exibe um alerta após o envio bem-sucedido
    alert('Dados e imagens inseridos com sucesso!');

    // Redireciona o usuário ou realize outras ações necessárias após o envio bem-sucedido
    window.location.href = "/";
});





