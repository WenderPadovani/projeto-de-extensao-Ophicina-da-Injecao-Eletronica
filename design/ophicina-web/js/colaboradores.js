// colaboradores.js
// Equipe, inativação, cadastro de colaborador e catálogo de habilidades.

const ID_USUARIO_LOGADO = 1; // Érica, a gestora

function alternarSituacao(colaborador) {
  if (colaborador.ativo) {
    let emAndamento = 0;
    for (const ordem of ORDENS) {
      if (ordem.mecanicoId === colaborador.id && ordem.status === "andamento") emAndamento++;
    }
    let pergunta = "Inativar " + colaborador.nome + "? A pessoa perde o acesso ao sistema, mas o histórico de O.S. e relatos é mantido.";
    if (emAndamento > 0) {
      pergunta += "\n\nAtenção: há " + emAndamento + " O.S. em andamento com ela, que precisarão de outro responsável.";
    }
    if (!confirm(pergunta)) return;
  }
  colaborador.ativo = !colaborador.ativo;
  desenharEquipe();
  avisar(colaborador.nome + (colaborador.ativo ? " reativado." : " inativado."));
}

function desenharEquipe() {
  const corpo = document.querySelector("#corpo-equipe");
  corpo.textContent = "";
  let ativos = 0;

  for (const colaborador of COLABORADORES) {
    if (colaborador.ativo) ativos++;
    const linha = document.createElement("tr");
    if (!colaborador.ativo) linha.className = "linha-inativa";

    const celulaNome = document.createElement("td");
    celulaNome.appendChild(document.createTextNode(colaborador.nome));
    celulaNome.appendChild(criarElemento("span", "secundario sensivel", colaborador.email));

    const celulaHabilidades = document.createElement("td");
    if (colaborador.habilidades.length === 0) {
      celulaHabilidades.appendChild(criarElemento("span", "secundario", "Não se aplica"));
    } else {
      const etiquetas = criarElemento("div", "etiquetas");
      for (const habilidade of colaborador.habilidades) {
        etiquetas.appendChild(criarElemento("span", "etiqueta", habilidade));
      }
      celulaHabilidades.appendChild(etiquetas);
    }

    const celulaSituacao = document.createElement("td");
    if (colaborador.ativo) {
      celulaSituacao.appendChild(criarElemento("span", "status status-finalizada", "Ativo"));
    } else {
      celulaSituacao.appendChild(criarElemento("span", "status status-inativo", "Inativo"));
    }

    // A gestora logada não pode inativar a própria conta
    const celulaAcao = document.createElement("td");
    if (colaborador.id === ID_USUARIO_LOGADO) {
      celulaAcao.appendChild(criarElemento("span", "secundario", "Você"));
    } else {
      const classe = colaborador.ativo ? "botao botao-pequeno botao-perigo" : "botao botao-pequeno botao-secundario";
      const botao = criarElemento("button", classe, colaborador.ativo ? "Inativar" : "Reativar");
      botao.type = "button";
      botao.setAttribute("aria-label", botao.textContent + " " + colaborador.nome);
      botao.addEventListener("click", () => alternarSituacao(colaborador));
      celulaAcao.appendChild(botao);
    }

    linha.appendChild(celulaNome);
    linha.appendChild(criarElemento("td", "", colaborador.perfil));
    linha.appendChild(celulaHabilidades);
    linha.appendChild(celulaSituacao);
    linha.appendChild(celulaAcao);
    corpo.appendChild(linha);
  }
  document.querySelector("#resumo-equipe").textContent = ativos + " ativos de " + COLABORADORES.length;
}

function desenharHabilidades() {
  const opcoes = document.querySelector("#col-habilidades-opcoes");
  const catalogo = document.querySelector("#catalogo-habilidades");
  opcoes.textContent = "";
  catalogo.textContent = "";

  for (const habilidade of HABILIDADES) {
    const rotulo = criarElemento("label", "opcao");
    const caixa = document.createElement("input");
    caixa.type = "checkbox";
    caixa.value = habilidade;
    rotulo.appendChild(caixa);
    rotulo.appendChild(document.createTextNode(" " + habilidade));
    opcoes.appendChild(rotulo);
    catalogo.appendChild(criarElemento("li", "etiqueta", habilidade));
  }
}

function iniciarColaboradores() {
  const formulario = document.querySelector("#formulario-colaborador");
  const mensagem = document.querySelector("#mensagem-colaborador");
  const grupoHabilidades = document.querySelector("#col-habilidades");

  // Gestor não precisa de habilidade técnica: o grupo fica desabilitado
  document.querySelectorAll("input[name=perfil]").forEach((opcao) => {
    opcao.addEventListener("change", () => {
      grupoHabilidades.disabled = opcao.value === "Gestor" && opcao.checked;
    });
  });
  formulario.addEventListener("reset", () => {
    grupoHabilidades.disabled = false;
    mostrarMensagem(mensagem, "");
  });

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const email = document.querySelector("#col-email").value.trim().toLowerCase();
    const perfil = document.querySelector("input[name=perfil]:checked").value;
    const marcadas = document.querySelectorAll("#col-habilidades-opcoes input:checked");

    for (const colaborador of COLABORADORES) {
      if (colaborador.email === email) {
        mostrarMensagem(mensagem, "Já existe um colaborador com este e-mail.", "erro");
        return;
      }
    }
    if (perfil === "Mecânico" && marcadas.length === 0) {
      mostrarMensagem(mensagem, "Marque ao menos uma habilidade do mecânico.", "erro");
      return;
    }

    const habilidades = [];
    if (perfil === "Mecânico") marcadas.forEach((caixa) => habilidades.push(caixa.value));

    const novo = {
      id: COLABORADORES.length + 1,
      nome: document.querySelector("#col-nome").value.trim(),
      email: email,
      perfil: perfil,
      habilidades: habilidades,
      ativo: true,
    };
    COLABORADORES.push(novo);

    formulario.reset();
    desenharEquipe();
    mostrarMensagem(mensagem, novo.nome + " cadastrado. O convite foi enviado para " + novo.email + ".", "sucesso");
  });

  const formularioHabilidade = document.querySelector("#formulario-habilidade");
  const mensagemHabilidade = document.querySelector("#mensagem-habilidade");
  formularioHabilidade.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const campo = document.querySelector("#nova-habilidade");
    const texto = campo.value.trim();

    for (const habilidade of HABILIDADES) {
      if (habilidade.toLowerCase() === texto.toLowerCase()) {
        mostrarMensagem(mensagemHabilidade, "Esta habilidade já está no catálogo.", "erro");
        return;
      }
    }

    const nome = texto[0].toUpperCase() + texto.slice(1);
    HABILIDADES.push(nome);
    formularioHabilidade.reset();
    desenharHabilidades();
    mostrarMensagem(mensagemHabilidade, nome + " adicionada ao catálogo.", "sucesso");
  });

  desenharEquipe();
  desenharHabilidades();
}

iniciarColaboradores();
