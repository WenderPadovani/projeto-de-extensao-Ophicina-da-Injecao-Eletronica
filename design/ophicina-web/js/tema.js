// tema.js
// Carregado no <head> sem defer: aplica o tema escuro e o modo privacidade
// antes de a página aparecer, para a tela não piscar ao trocar de página.
if (localStorage.getItem("tema") === "escuro") {
  document.documentElement.classList.add("escuro");
}
if (localStorage.getItem("privacidade") === "ligada") {
  document.documentElement.classList.add("privacidade");
}
