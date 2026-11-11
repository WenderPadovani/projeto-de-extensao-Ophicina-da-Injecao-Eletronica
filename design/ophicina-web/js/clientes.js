// clientes.js
// Lista de clientes com busca e cadastro de cliente com veículo.

function contarOrdens(clienteId) {
  let total = 0;
  for (const ordem of ORDENS) {
    if (ordem.clienteId === clienteId) total++;
  }
  return total;
}

function desenharClientes() {
  const corpo = document.querySelector("#corpo-clientes");
  const termo = document.querySelector("#filtro-clientes").value.trim().toLowerCase();
  const ordenados = CLIENTES.slice().sort((a, b) => a.nome.localeCompare(b.nome));
  corpo.textContent = "";
  let exibidos = 0;

  for (const cliente of ordenados) {
    let textoBusca = cliente.nome;
    for (const veiculo of cliente.veiculos) textoBusca += " " + veiculo.placa + " " + veiculo.modelo;
    if (termo !== "" && !textoBusca.toLowerCase().includes(termo)) continue;

    const linha = document.createElement("tr");

    const celulaNome = document.createElement("td");
    celulaNome.appendChild(criarElemento("span", "sensivel", cliente.nome));
    celulaNome.appendChild(criarElemento("span", "secundario sensivel", cliente.email || "sem e-mail"));

    const celulaVeiculos = document.createElement("td");
    for (const veiculo of cliente.veiculos) {
      celulaVeiculos.appendChild(criarPlaca(veiculo.placa));
      celulaVeiculos.appendChild(criarElemento("span", "secundario", veiculo.modelo + ", " + veiculo.ano));
    }

    linha.appendChild(celulaNome);
    linha.appendChild(criarElemento("td", "sensivel", mascararTelefone(cliente.telefone)));
    linha.appendChild(celulaVeiculos);
    linha.appendChild(criarElemento("td", "", contarOrdens(cliente.id)));
    corpo.appendChild(linha);
    exibidos++;
  }

  if (exibidos === 0) {
    const linha = document.createElement("tr");
    const celula = criarElemento("td", "vazio", "Nenhum cliente encontrado. Confira a grafia ou cadastre ao lado.");
    celula.colSpan = 4;
    linha.appendChild(celula);
    corpo.appendChild(linha);
  }
  document.querySelector("#total-clientes").textContent = "(" + exibidos + " de " + CLIENTES.length + ")";
}

// Formata o celular enquanto o usuário digita: (19) 99999-9999
function formatarTelefone(campo) {
  const digitos = campo.value.replace(/\D/g, "").slice(0, 11);
  if (digitos.length <= 2) {
    campo.value = digitos;
  } else if (digitos.length <= 6) {
    campo.value = "(" + digitos.slice(0, 2) + ") " + digitos.slice(2);
  } else {
    const meio = digitos.length === 11 ? 7 : 6;
    campo.value = "(" + digitos.slice(0, 2) + ") " + digitos.slice(2, meio) + "-" + digitos.slice(meio);
  }
}

function buscarDonoDaPlaca(placa) {
  for (const cliente of CLIENTES) {
    for (const veiculo of cliente.veiculos) {
      if (veiculo.placa === placa) return cliente;
    }
  }
  return null;
}

function iniciarClientes() {
  const formulario = document.querySelector("#formulario-cliente");
  const mensagem = document.querySelector("#mensagem-cliente");
  const campoTelefone = document.querySelector("#cli-telefone");
  const campoPlaca = document.querySelector("#cli-placa");

  // Ano do veículo: até o ano seguinte ao atual (modelo do ano que vem)
  document.querySelector("#cli-ano").max = new Date().getFullYear() + 1;

  campoTelefone.addEventListener("input", () => formatarTelefone(campoTelefone));
  campoPlaca.addEventListener("input", () => {
    campoPlaca.value = campoPlaca.value.toUpperCase();
  });
  document.querySelector("#filtro-clientes").addEventListener("input", desenharClientes);
  formulario.addEventListener("reset", () => mostrarMensagem(mensagem, ""));

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const placa = campoPlaca.value;
    const dono = buscarDonoDaPlaca(placa);
    if (dono !== null) {
      mostrarMensagem(mensagem, "A placa " + placa + " já está cadastrada para " + dono.nome + ".", "erro");
      return;
    }

    const novo = {
      id: CLIENTES.length + 1,
      nome: document.querySelector("#cli-nome").value.trim(),
      telefone: campoTelefone.value,
      email: document.querySelector("#cli-email").value.trim(),
      lembretes: document.querySelector("#cli-lembretes").checked,
      veiculos: [
        {
          placa: placa,
          modelo: document.querySelector("#cli-modelo").value.trim(),
          ano: Number(document.querySelector("#cli-ano").value),
        },
      ],
    };
    CLIENTES.push(novo);

    formulario.reset();
    document.querySelector("#filtro-clientes").value = "";
    desenharClientes();
    mostrarMensagem(mensagem, novo.nome + " cadastrado com o veículo " + placa + ".", "sucesso");
    document.querySelector("#cli-nome").focus();
  });

  desenharClientes();
}

iniciarClientes();
