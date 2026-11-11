// curadoria.js
// Revisão dos relatos técnicos antes de entrarem na base de conhecimento da IA.

let totalNaBase = 1258; // relatos já aprovados (fictício)
let relatoAtual = null;

function desenharFila() {
  const fila = document.querySelector("#fila-relatos");
  fila.textContent = "";

  for (const relato of RELATORIOS) {
    const ordem = buscarOrdem(relato.osNumero);
    const mecanico = buscarColaborador(ordem.mecanicoId);

    const botao = criarElemento("button", "item-fila");
    botao.type = "button";
    botao.setAttribute("aria-pressed", relato === relatoAtual);

    const linhaTopo = criarElemento("span", "linha");
    linhaTopo.appendChild(criarPlaca(ordem.placa));
    linhaTopo.appendChild(criarElemento("span", "", relato.enviadoEm));

    botao.appendChild(linhaTopo);
    botao.appendChild(criarElemento("strong", "", relato.resumo));
    botao.appendChild(criarElemento("span", "linha", "O.S. " + ordem.numero + ", por " + mecanico.nome));
    botao.addEventListener("click", () => selecionarRelato(relato));

    const item = document.createElement("li");
    item.appendChild(botao);
    fila.appendChild(item);
  }

  document.querySelector("#total-pendentes").textContent = RELATORIOS.length;
  document.querySelector("#total-homologados").textContent = totalNaBase.toLocaleString("pt-BR");

  const vazia = RELATORIOS.length === 0;
  document.querySelector("#formulario-curadoria").hidden = vazia;
  document.querySelector("#fila-vazia").hidden = !vazia;
}

function adicionarDado(lista, titulo, valor, largo) {
  const grupo = document.createElement("div");
  if (largo) grupo.className = "largo";
  grupo.appendChild(criarElemento("dt", "", titulo));
  grupo.appendChild(criarElemento("dd", "", valor));
  lista.appendChild(grupo);
}

function selecionarRelato(relato) {
  relatoAtual = relato;
  fecharDevolucao();
  document.querySelector("#formulario-curadoria").reset();
  mostrarMensagem(document.querySelector("#mensagem-curadoria"), "");

  if (relato) {
    const ordem = buscarOrdem(relato.osNumero);
    const mecanico = buscarColaborador(ordem.mecanicoId);
    document.querySelector("#titulo-editor").textContent = "Relato da O.S. " + ordem.numero;

    const ficha = document.querySelector("#ficha-tecnica");
    ficha.textContent = "";
    adicionarDado(ficha, "Placa", ordem.placa);
    adicionarDado(ficha, "Mecânico", mecanico.nome);
    adicionarDado(ficha, "Aberta em", formatarData(ordem.abertura));
    adicionarDado(ficha, "Enviado", relato.enviadoEm);
    adicionarDado(ficha, "Sintoma relatado pelo cliente", ordem.sintoma, true);

    document.querySelector("#texto-relato").value = relato.relato;
  }
  desenharFila();
}

function removerDaFila() {
  const posicao = RELATORIOS.indexOf(relatoAtual);
  RELATORIOS.splice(posicao, 1);
  atualizarPendencias();
  selecionarRelato(RELATORIOS.length > 0 ? RELATORIOS[0] : null);
}

function fecharDevolucao() {
  const formulario = document.querySelector("#formulario-devolucao");
  formulario.reset();
  formulario.hidden = true;
}

// O relato vai para a base da IA: não pode levar telefone ou e-mail de cliente
function temDadoPessoal(texto) {
  const telefone = /\(?\d{2}\)?\s?9?\d{4}-?\d{4}/;
  const email = /\S+@\S+\.\S+/;
  return telefone.test(texto) || email.test(texto);
}

function iniciarCuradoria() {
  const formulario = document.querySelector("#formulario-curadoria");
  const mensagem = document.querySelector("#mensagem-curadoria");
  const formularioDevolucao = document.querySelector("#formulario-devolucao");

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const texto = document.querySelector("#texto-relato").value;
    if (temDadoPessoal(texto)) {
      mostrarMensagem(mensagem, "O relato parece conter telefone ou e-mail. Remova os dados pessoais antes de aprovar.", "erro");
      return;
    }

    const ordem = buscarOrdem(relatoAtual.osNumero);
    ordem.status = "finalizada";
    ordem.enviadaPosVenda = false;
    totalNaBase++;

    const agora = new Date();
    const hora = String(agora.getHours()).padStart(2, "0") + ":" + String(agora.getMinutes()).padStart(2, "0");
    document.querySelector("#ultima-aprovacao").textContent = "Hoje, " + hora;

    removerDaFila();
    avisar("Relato da O.S. " + ordem.numero + " aprovado e enviado à base da IA.");
  });

  document.querySelector("#abrir-devolucao").addEventListener("click", () => {
    formularioDevolucao.hidden = false;
    document.querySelector("#motivo-devolucao").focus();
  });
  document.querySelector("#cancelar-devolucao").addEventListener("click", fecharDevolucao);

  formularioDevolucao.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const ordem = buscarOrdem(relatoAtual.osNumero);
    const mecanico = buscarColaborador(ordem.mecanicoId);
    ordem.status = "andamento";
    removerDaFila();
    avisar("Relato devolvido a " + mecanico.nome + ". A O.S. " + ordem.numero + " voltou para \"Em andamento\".");
  });

  // curadoria.html#os-1045 abre direto o relato daquela O.S.
  let inicial = RELATORIOS[0];
  for (const relato of RELATORIOS) {
    if (location.hash === "#os-" + relato.osNumero) inicial = relato;
  }
  selecionarRelato(inicial);
}

iniciarCuradoria();
