// comum.js
// Funções usadas por todas as telas internas.

// ---------- Funções auxiliares ----------

function formatarMoeda(valor) {
  return "R$ " + valor.toLocaleString("pt-BR");
}

function formatarData(dataIso) {
  const partes = dataIso.split("-");
  return partes[2] + "/" + partes[1] + "/" + partes[0];
}

function dataDeHoje() {
  const hoje = new Date();
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  const dia = String(hoje.getDate()).padStart(2, "0");
  return hoje.getFullYear() + "-" + mes + "-" + dia;
}

// Mostra só o DDD e os 4 últimos dígitos do telefone (proteção de dados)
function mascararTelefone(telefone) {
  const ddd = telefone.slice(1, 3);
  const final = telefone.slice(-4);
  return "(" + ddd + ") ••••-" + final;
}

function iniciais(nome) {
  const partes = nome.split(" ");
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
}

// Cria um elemento já com classe e texto
function criarElemento(tag, classe, texto) {
  const elemento = document.createElement(tag);
  if (classe) elemento.className = classe;
  if (texto !== undefined) elemento.textContent = texto;
  return elemento;
}

function criarIcone(nome) {
  const icone = document.createElement("img");
  icone.className = "icone";
  icone.src = "img/icones/" + nome + ".svg";
  icone.alt = "";
  return icone;
}

function criarPlaca(placa) {
  return criarElemento("span", "placa", placa);
}

// Mensagem de um formulário: tipo "erro" ou "sucesso"
function mostrarMensagem(elemento, texto, tipo) {
  elemento.textContent = texto;
  elemento.classList.remove("erro", "sucesso");
  if (tipo) elemento.classList.add(tipo);
}

// Aviso temporário na parte de baixo da tela
function avisar(texto) {
  let area = document.querySelector("#area-avisos");
  if (!area) {
    area = criarElemento("div", "area-avisos");
    area.id = "area-avisos";
    area.setAttribute("role", "status");
    document.body.appendChild(area);
  }
  const aviso = criarElemento("p", "aviso");
  aviso.appendChild(criarIcone("circle-check"));
  aviso.appendChild(document.createTextNode(texto));
  area.appendChild(aviso);
  setTimeout(() => aviso.remove(), 4000);
}

// ---------- Topo: tema, privacidade e pendências ----------

function configurarTopo() {
  const html = document.documentElement;
  const botaoTema = document.querySelector("#botao-tema");
  const botaoPrivacidade = document.querySelector("#botao-privacidade");
  if (!botaoTema || !botaoPrivacidade) return;

  const atualizarBotoes = () => {
    const escuro = html.classList.contains("escuro");
    botaoTema.querySelector("img").src = escuro ? "img/icones/sun.svg" : "img/icones/moon.svg";
    botaoTema.setAttribute("aria-pressed", escuro);

    const privacidade = html.classList.contains("privacidade");
    botaoPrivacidade.querySelector("img").src = privacidade ? "img/icones/eye-off.svg" : "img/icones/eye.svg";
    botaoPrivacidade.setAttribute("aria-pressed", privacidade);
  };

  botaoTema.addEventListener("click", () => {
    html.classList.toggle("escuro");
    localStorage.setItem("tema", html.classList.contains("escuro") ? "escuro" : "claro");
    atualizarBotoes();
  });

  botaoPrivacidade.addEventListener("click", () => {
    html.classList.toggle("privacidade");
    localStorage.setItem("privacidade", html.classList.contains("privacidade") ? "ligada" : "desligada");
    atualizarBotoes();
  });

  atualizarBotoes();
}

function atualizarPendencias() {
  const lista = document.querySelector("#lista-pendencias");
  const contador = document.querySelector("#contador-pendencias");
  if (!lista || !contador) return;

  let semMecanico = 0;
  for (const ordem of ORDENS) {
    if (ordem.status === "aberta" && ordem.mecanicoId === null) semMecanico++;
  }

  lista.textContent = "";
  if (RELATORIOS.length > 0) {
    const item = document.createElement("li");
    const link = criarElemento("a", "", RELATORIOS.length + " relatos aguardam sua revisão");
    link.href = "curadoria.html";
    item.appendChild(link);
    lista.appendChild(item);
  }
  if (semMecanico > 0) {
    const item = document.createElement("li");
    const link = criarElemento("a", "", semMecanico + " O.S. estão sem mecânico alocado");
    link.href = "ordens-servico.html";
    item.appendChild(link);
    lista.appendChild(item);
  }
  if (lista.children.length === 0) {
    lista.appendChild(criarElemento("li", "", "Nenhuma pendência no momento."));
  }

  const total = RELATORIOS.length + semMecanico;
  contador.textContent = total;
  contador.hidden = total === 0;
}

// Fecha os menus do topo (<details>) ao clicar fora deles
function configurarMenusSuspensos() {
  const menus = document.querySelectorAll(".menu-suspenso");
  document.addEventListener("click", (evento) => {
    menus.forEach((menu) => {
      if (!menu.contains(evento.target)) menu.open = false;
    });
  });
}

// ---------- Assistente de IA ----------
// No sistema final, a pergunta irá para o back-end, que consulta a base de
// relatos aprovados (RAG) e o modelo de linguagem. Aqui a resposta é simulada
// procurando palavras da pergunta nos relatos de dados.js.

function responderPergunta(pergunta) {
  const palavras = pergunta.toLowerCase().split(" ");
  let melhorRelato = null;
  let maiorPontuacao = 0;

  for (const relato of RELATORIOS) {
    const ordem = buscarOrdem(relato.osNumero);
    const texto = (relato.relato + " " + relato.resumo + " " + ordem.sintoma + " " + ordem.placa).toLowerCase();
    let pontuacao = 0;
    for (const palavra of palavras) {
      if (palavra.length > 3 && texto.includes(palavra)) pontuacao++;
    }
    if (pontuacao > maiorPontuacao) {
      maiorPontuacao = pontuacao;
      melhorRelato = relato;
    }
  }

  if (melhorRelato === null) {
    return "Não encontrei um caso parecido nos relatos da oficina. Tente descrever o sintoma com outras palavras ou informe o código de falha.";
  }
  const ordem = buscarOrdem(melhorRelato.osNumero);
  return "Encontrei um caso parecido na O.S. " + ordem.numero + " (" + ordem.placa + "): " + melhorRelato.relato;
}

function adicionarMensagemAssistente(texto, autor) {
  const conversa = document.querySelector("#assistente-conversa");
  conversa.appendChild(criarElemento("li", "mensagem-chat " + autor, texto));
  conversa.scrollTop = conversa.scrollHeight;
}

// Abre o assistente. Pergunta e resposta podem vir prontas (ex.: "Sugerir mecânico").
function abrirAssistente(pergunta, resposta) {
  const janela = document.querySelector("#assistente");
  janela.showModal();
  if (pergunta) {
    adicionarMensagemAssistente(pergunta, "usuario");
    adicionarMensagemAssistente(resposta, "ia");
  }
  document.querySelector("#assistente-pergunta").focus();
}

function configurarAssistente() {
  const janela = document.querySelector("#assistente");
  const formulario = document.querySelector("#assistente-formulario");
  const campo = document.querySelector("#assistente-pergunta");
  if (!janela) return;

  document.querySelector("#abrir-assistente").addEventListener("click", () => abrirAssistente());
  document.querySelector("#fechar-assistente").addEventListener("click", () => janela.close());

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const pergunta = campo.value.trim();
    adicionarMensagemAssistente(pergunta, "usuario");
    adicionarMensagemAssistente(responderPergunta(pergunta), "ia");
    formulario.reset();
    campo.focus();
  });
}

configurarTopo();
atualizarPendencias();
configurarMenusSuspensos();
configurarAssistente();
