// login.js
// Os atributos required, type="email" e minlength="8" do HTML já validam os
// campos antes do envio. A verificação da senha será feita pelo back-end;
// por enquanto, com os campos válidos, o gestor segue para o painel.

function iniciarLogin() {
  const formularioLogin = document.querySelector("#formulario-login");
  const formularioRecuperacao = document.querySelector("#formulario-recuperacao");
  const botaoRecuperacao = document.querySelector("#abrir-recuperacao");
  const botaoSenha = document.querySelector("#mostrar-senha");
  const campoSenha = document.querySelector("#senha");
  const mensagem = document.querySelector("#mensagem-recuperacao");

  formularioLogin.addEventListener("submit", (evento) => {
    evento.preventDefault();
    window.location.href = "painel.html";
  });

  botaoSenha.addEventListener("click", () => {
    const visivel = campoSenha.type === "text";
    campoSenha.type = visivel ? "password" : "text";
    botaoSenha.setAttribute("aria-pressed", !visivel);
    botaoSenha.querySelector("img").src = visivel ? "img/icones/eye.svg" : "img/icones/eye-off.svg";
  });

  const alternarRecuperacao = (abrir) => {
    formularioRecuperacao.hidden = !abrir;
    botaoRecuperacao.setAttribute("aria-expanded", abrir);
    if (abrir) {
      // aproveita o e-mail que já foi digitado no login
      document.querySelector("#email-recuperacao").value = document.querySelector("#email").value;
      document.querySelector("#email-recuperacao").focus();
    } else {
      formularioRecuperacao.reset();
      mensagem.textContent = "";
    }
  };

  botaoRecuperacao.addEventListener("click", () => alternarRecuperacao(formularioRecuperacao.hidden));
  document.querySelector("#cancelar-recuperacao").addEventListener("click", () => alternarRecuperacao(false));

  formularioRecuperacao.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const email = document.querySelector("#email-recuperacao").value.trim();
    // A resposta é a mesma exista ou não o e-mail, para não revelar quais contas existem
    mensagem.textContent = "Se " + email + " estiver cadastrado, o link chegará em alguns minutos.";
    mensagem.classList.add("sucesso");
  });
}

iniciarLogin();
