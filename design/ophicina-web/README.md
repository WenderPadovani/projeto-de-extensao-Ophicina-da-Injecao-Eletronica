# Ophicina: front-end da interface do gestor

Atividade de Programação Web (50% da P1), Fatec Campinas, 2026.
Equipe: 
* Larissa Escobar Garcia Silveira 
* Wender Egídio Paraíso Silva Filho

## Como abrir

Abra `index.html` no navegador (Chrome, Edge ou Firefox atualizados). Não precisa de servidor nem de internet.

O back-end ainda não existe, então o login não confere a senha: qualquer e-mail válido com senha de
8 ou mais caracteres leva ao painel. Todos os dados são fictícios (`js/dados.js`) e os cadastros feitos
na tela somem ao recarregar a página.

## Telas (7)

| Arquivo | Tela |
|---|---|
| `index.html` | Login e recuperação de senha |
| `painel.html` | Painel de indicadores e gráficos |
| `ordens-servico.html` | Quadro de ordens de serviço |
| `clientes.html` | Clientes e veículos |
| `colaboradores.html` | Equipe e catálogo de habilidades |
| `curadoria.html` | Revisão dos relatos técnicos |
| `pos-venda.html` | Envio ao pós-venda e avaliações |

## Pastas

```
css/estilos.css        folha de estilos única
js/tema.js             aplica o tema escuro antes de a página aparecer
js/dados.js            dados fictícios
js/comum.js            funções usadas por todas as telas internas
js/<tela>.js           comportamento de cada tela
js/libs/chart.umd.js   biblioteca Chart.js 4.4.1 (licença MIT), usada nos gráficos do painel
img/                   logotipo e favicon
img/icones/            ícones SVG do Tabler Icons (licença MIT)
```
