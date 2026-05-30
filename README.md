# Contexto Acadêmico - Projeto de Extensão

Este sistema está sendo desenvolvido como parte do Projeto de Extensão da Faculdade de Tecnologia de Campinas (Fatec Campinas), com o auxílio de professores de diversas disciplinas ao longo do curso de Análise e Desenvolvimento de Sistemas.

# Equipe:

**Larissa Escobar Garcia Silveira**
**Wender Egídio Paraíso Silva Filho**

# Sistema de Gestão Inteligente

Este projeto consiste no desenvolvimento de um sistema para a **Ophicina da Injeção Eletrônica**, uma oficina mecânica familiar de pequeno porte. O foco do sistema é otimizar a gestão de Ordens de Serviço e introduzir suporte técnico inteligente através de Geração Aumentada por Recuperação (RAG).

# Status do Projeto: Em Desenvolvimento

O projeto ainda está em fases embrionárias de desenvolvimento, tendo passado pela etapa da **Administração Geral**, onde foram recolhidas informações sobre a empresa, a fim de criar um sistema para solucionar possíveis deficiências. Depois disso, o sistema passou pela disciplina de **Engenharia de Software I**, onde foi estruturado uma modelagem e organização iniciais do software.

---

## Objetivo do Projeto

O sistema visa potencializar a gestão administrativa através de:
* **Digitalização de Processos:** Triagem, abertura e acompanhamento de Ordens de Serviço.
* **Inteligência Artificial (RAG):** Assistente técnico que consulta um banco de dados de casos resolvidos anteriormente para auxiliar mecânicos em diagnósticos complexos.
* **Gestão de Conhecimento:** Curadoria de dados técnicos para transformar a experiência dos mecânicos em um ativo digital da empresa.

## Público-Alvo e Atores

O sistema foi estruturado em duas interfaces distintas:

1. **Gestor (Interface Desktop):** Responsável pelo login administrativo, gestão de colaboradores, abertura de O.S. e curadoria dos dados da IA.
2. **Mecânico (Interface Mobile):** Responsável por visualizar tarefas, interagir com o assistente de IA via voz/chat e submeter relatos técnicos de consertos.

## Tecnologias e Ferramentas

* **Documentação:** Google Workspace (Docs) e Notion.
* **Interface (UI/UX):** Página Protótipo em HTML (Design Desktop e Mobile).
* **Gestão e Versionamento:** GitHub (Git).
* **IA/Back-end:** Provedor de LLM e Banco de Dados em Nuvem (Previstos).

---

## Plano de Gestão de Configuração

Para garantir a organização, rastreabilidade e integridade de todos os artefatos produzidos, este repositório segue as seguintes diretrizes:

### 1. Estrutura de Diretórios
Os arquivos são organizados por categoria de item de configuração:
* `/docs`: Contém toda a documentação analítica e de requisitos do projeto (Identificação de Atores, Requisitos Funcionais/Não Funcionais, Narrativas, Casos de Uso e Manuais).
* `/design`: Diretório reservado para as propostas de interface (Protótipos de tela e mapeamento de navegação).
* `/src`: Diretório futuro destinado ao código-fonte da aplicação.

### 2. Política de Nomenclatura e Versionamento
* **Arquivos:** Todos os arquivos recebem nomes padronizados e diretos (ex: `Requisitos.pdf`). 
* **Sem Versão Manual:** O controle de evolução, correções e edições da documentação é gerenciado pela linha do tempo de **Commits** do repositório.
* **Mensagens de Commit:** As alterações devem ser registradas com mensagens claras que facilitem a auditoria da equipe.

### 3. Marcos de Entrega (Releases)
Utilizamos o recurso de **Releases** do GitHub para determinar as versões finalizadas, ex:
* **`v1.0`**: Entrega Inicial.
* **`v2.0`**: Entrega de próximas fases.