// ordens.js
// Quadro de ordens de serviço, alocação de mecânico e abertura de nova O.S.

const COLUNAS = ["aberta", "andamento", "curadoria", "finalizada"];

// Sugere o mecânico ativo com mais habilidades em comum com a O.S.;
// no empate, o que tem menos O.S. em andamento.
function sugerirMecanico(ordem) {
  let melhor = null;
  let melhorComum = 0;
  let melhorOcupacao = 0;

  for (const mecanico of mecanicosAtivos()) {
    let emComum = 0;
    for (const habilidade of mecanico.habilidades) {
      if (ordem.habilidades.includes(habilidade)) emComum++;
    }
    let ocupacao = 0;
    for (const outra of ORDENS) {
      if (outra.status === "andamento" && outra.mecanicoId === mecanico.id) ocupacao++;
    }
    if (emComum > melhorComum || (emComum === melhorComum && emComum > 0 && ocupacao < melhorOcupacao)) {
      melhor = mecanico;
      melhorComum = emComum;
      melhorOcupacao = ocupacao;
    }
  }

  if (melhor === null) {
    return "Nenhum mecânico ativo tem as habilidades desta O.S. Vale revisar as habilidades da equipe na tela Colaboradores.";
  }
  const ocupacao = melhorOcupacao === 0 ? "nenhuma O.S. em andamento" : melhorOcupacao + " O.S. em andamento";
  return "Sugiro " + melhor.nome + ": tem " + melhorComum + " das habilidades pedidas e " + ocupacao + ". A alocação continua sendo decisão sua, pelo campo \"Escolher mecânico\" no cartão.";
}

// Formulário de alocação que aparece nos cartões sem mecânico
function criarFormularioAlocacao(ordem) {
  const formulario = criarElemento("form", "alocar");
  const seletor = document.createElement("select");
  seletor.required = true;
  seletor.setAttribute("aria-label", "Mecânico para a O.S. " + ordem.numero);

  const opcaoVazia = criarElemento("option", "", "Escolher mecânico");
  opcaoVazia.value = "";
  seletor.appendChild(opcaoVazia);
  for (const mecanico of mecanicosAtivos()) {
    const opcao = criarElemento("option", "", mecanico.nome);
    opcao.value = mecanico.id;
    seletor.appendChild(opcao);
  }

  const botao = criarElemento("button", "botao botao-secundario botao-pequeno", "Alocar");
  botao.type = "submit";

  formulario.appendChild(seletor);
  formulario.appendChild(botao);

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const mecanico = buscarColaborador(Number(seletor.value));
    ordem.mecanicoId = mecanico.id;
    ordem.status = "andamento";
    desenharQuadro();
    atualizarPendencias();
    avisar("O.S. " + ordem.numero + " alocada para " + mecanico.nome + ".");
  });
  return formulario;
}

function criarCartao(ordem) {
  const cliente = buscarCliente(ordem.clienteId);
  const cartao = criarElemento("article", "ficha-os");
  cartao.setAttribute("aria-label", "O.S. " + ordem.numero);

  const cabecalho = document.createElement("header");
  cabecalho.appendChild(criarElemento("span", "numero", "O.S. " + ordem.numero));
  cabecalho.appendChild(criarPlaca(ordem.placa));
  cartao.appendChild(cabecalho);

  cartao.appendChild(criarElemento("p", "cliente sensivel", cliente.nome));
  cartao.appendChild(criarElemento("p", "sintoma", ordem.sintoma));

  const etiquetas = criarElemento("div", "etiquetas");
  for (const habilidade of ordem.habilidades) {
    etiquetas.appendChild(criarElemento("span", "etiqueta", habilidade));
  }
  cartao.appendChild(etiquetas);

  if (ordem.mecanicoId === null) {
    const aviso = criarElemento("p", "responsavel sem-mecanico");
    aviso.appendChild(criarIcone("user-x"));
    aviso.appendChild(document.createTextNode("Sem mecânico alocado"));
    cartao.appendChild(aviso);
    cartao.appendChild(criarFormularioAlocacao(ordem));

    const botaoSugerir = criarElemento("button", "botao botao-ia botao-pequeno");
    botaoSugerir.type = "button";
    botaoSugerir.appendChild(criarIcone("sparkles"));
    botaoSugerir.appendChild(document.createTextNode("Sugerir mecânico com IA"));
    botaoSugerir.addEventListener("click", () => {
      const pergunta = "Qual mecânico devo alocar na O.S. " + ordem.numero + " (" + ordem.placa + ")?";
      abrirAssistente(pergunta, sugerirMecanico(ordem));
    });
    cartao.appendChild(botaoSugerir);
  } else {
    const mecanico = buscarColaborador(ordem.mecanicoId);
    let papel = "Mecânico";
    let icone = "user-bolt";
    if (ordem.status === "curadoria") {
      papel = "Relato enviado por";
      icone = "user-check";
    } else if (ordem.status === "finalizada") {
      papel = "Finalizada por";
      icone = "user-check";
    }
    const responsavel = criarElemento("p", "responsavel");
    responsavel.appendChild(criarIcone(icone));
    responsavel.appendChild(document.createTextNode(papel + ": "));
    responsavel.appendChild(criarElemento("strong", "", mecanico.nome));
    cartao.appendChild(responsavel);
  }

  if (ordem.status === "curadoria") {
    const link = criarElemento("a", "botao botao-secundario botao-pequeno", "Revisar relato");
    link.href = "curadoria.html#os-" + ordem.numero;
    cartao.appendChild(link);
  }
  return cartao;
}

function desenharQuadro() {
  const termo = document.querySelector("#filtro-os").value.trim().toLowerCase();
  const ordenadas = ORDENS.slice().sort((a, b) => b.numero - a.numero);

  for (const status of COLUNAS) {
    const lista = document.querySelector("#lista-" + status);
    lista.textContent = "";
    let quantidade = 0;

    for (const ordem of ordenadas) {
      if (ordem.status !== status) continue;
      const cliente = buscarCliente(ordem.clienteId);
      const texto = (ordem.numero + " " + ordem.placa + " " + cliente.nome + " " + ordem.sintoma).toLowerCase();
      if (termo !== "" && !texto.includes(termo)) continue;
      lista.appendChild(criarCartao(ordem));
      quantidade++;
    }

    if (quantidade === 0) {
      lista.appendChild(criarElemento("p", "vazio", termo ? "Nenhuma O.S. corresponde ao filtro." : "Nenhuma O.S. nesta etapa."));
    }
    document.querySelector("#total-" + status).textContent = quantidade;
  }
}

// ---------- Nova O.S. ----------

function preencherFormularioOs() {
  const seletorCliente = document.querySelector("#os-cliente");
  const clientes = CLIENTES.slice().sort((a, b) => a.nome.localeCompare(b.nome));
  for (const cliente of clientes) {
    const opcao = criarElemento("option", "", cliente.nome);
    opcao.value = cliente.id;
    seletorCliente.appendChild(opcao);
  }

  const grupo = document.querySelector("#os-habilidades");
  for (const habilidade of HABILIDADES) {
    const rotulo = criarElemento("label", "opcao");
    const caixa = document.createElement("input");
    caixa.type = "checkbox";
    caixa.name = "habilidades";
    caixa.value = habilidade;
    rotulo.appendChild(caixa);
    rotulo.appendChild(document.createTextNode(" " + habilidade));
    grupo.appendChild(rotulo);
  }

  const seletorMecanico = document.querySelector("#os-mecanico");
  for (const mecanico of mecanicosAtivos()) {
    const opcao = criarElemento("option", "", mecanico.nome + " (" + mecanico.habilidades.join(", ") + ")");
    opcao.value = mecanico.id;
    seletorMecanico.appendChild(opcao);
  }

  // A previsão de entrega não pode ser uma data que já passou
  document.querySelector("#os-previsao").min = dataDeHoje();
}

// Mostra apenas os veículos do cliente escolhido
function atualizarVeiculos() {
  const seletorVeiculo = document.querySelector("#os-veiculo");
  const cliente = buscarCliente(Number(document.querySelector("#os-cliente").value));
  seletorVeiculo.textContent = "";

  if (cliente === null) {
    const opcao = criarElemento("option", "", "Escolha o cliente primeiro");
    opcao.value = "";
    seletorVeiculo.appendChild(opcao);
    seletorVeiculo.disabled = true;
    return;
  }

  seletorVeiculo.disabled = false;
  if (cliente.veiculos.length > 1) {
    const opcao = criarElemento("option", "", "Selecione o veículo");
    opcao.value = "";
    seletorVeiculo.appendChild(opcao);
  }
  for (const veiculo of cliente.veiculos) {
    const opcao = criarElemento("option", "", veiculo.placa + ", " + veiculo.modelo + " (" + veiculo.ano + ")");
    opcao.value = veiculo.placa;
    seletorVeiculo.appendChild(opcao);
  }
}

function proximoNumeroOs() {
  let maior = 0;
  for (const ordem of ORDENS) {
    if (ordem.numero > maior) maior = ordem.numero;
  }
  return maior + 1;
}

function iniciarOrdens() {
  const janela = document.querySelector("#janela-nova-os");
  const formulario = document.querySelector("#formulario-os");
  const mensagem = document.querySelector("#mensagem-os");
  const sintoma = document.querySelector("#os-sintoma");
  const contador = document.querySelector("#os-sintoma-contador");

  const fecharJanela = () => {
    formulario.reset();
    atualizarVeiculos();
    contador.textContent = "0 de 500 caracteres";
    mostrarMensagem(mensagem, "");
    janela.close();
  };

  document.querySelector("#filtro-os").addEventListener("input", desenharQuadro);
  document.querySelector("#abrir-nova-os").addEventListener("click", () => janela.showModal());
  document.querySelector("#fechar-nova-os").addEventListener("click", fecharJanela);
  document.querySelector("#cancelar-nova-os").addEventListener("click", fecharJanela);
  document.querySelector("#os-cliente").addEventListener("change", atualizarVeiculos);
  sintoma.addEventListener("input", () => {
    contador.textContent = sintoma.value.length + " de 500 caracteres";
  });

  // Os atributos required, minlength e min do HTML já barram campos vazios
  // ou fora do limite. Aqui ficam as regras que o HTML não cobre.
  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const placa = document.querySelector("#os-veiculo").value;
    const marcadas = document.querySelectorAll("#os-habilidades input:checked");

    if (marcadas.length === 0) {
      mostrarMensagem(mensagem, "Marque ao menos uma habilidade para orientar a alocação.", "erro");
      return;
    }
    for (const ordem of ORDENS) {
      if (ordem.placa === placa && ordem.status !== "finalizada") {
        mostrarMensagem(mensagem, "Este veículo já está na O.S. " + ordem.numero + ", que ainda não foi finalizada.", "erro");
        return;
      }
    }

    const habilidades = [];
    marcadas.forEach((caixa) => habilidades.push(caixa.value));
    const valorMecanico = document.querySelector("#os-mecanico").value;

    const nova = {
      numero: proximoNumeroOs(),
      placa: placa,
      clienteId: Number(document.querySelector("#os-cliente").value),
      sintoma: sintoma.value.trim(),
      habilidades: habilidades,
      status: valorMecanico ? "andamento" : "aberta",
      mecanicoId: valorMecanico ? Number(valorMecanico) : null,
      abertura: dataDeHoje(),
    };
    ORDENS.push(nova);

    fecharJanela();
    document.querySelector("#filtro-os").value = "";
    desenharQuadro();
    atualizarPendencias();
    avisar("O.S. " + nova.numero + " aberta para o veículo " + nova.placa + ".");
  });

  preencherFormularioOs();
  desenharQuadro();
}

iniciarOrdens();
