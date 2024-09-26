# Filigrana

O Filigrana é um sistema desenvolvido para facilitar o fechamento de caixa na loja de semijoias e bijuterias. Ele visa proporcionar uma gestão eficiente e precisa das transações diárias, permitindo que os lojistas acompanhem o fluxo de caixa de forma organizada e sem complicações.

![Imagem de capa](./assets/capa.jpg)

## Alunos integrantes da equipe

- Guilherme Cantoni
- Guilherme Felipe Costa Rodrigues
- Isabelle Cristine
- Pedro Barcelos
- Rafael Ferraz
- Samuel Lincoln

## Professores responsáveis

- Joyce Christina de Paiva Carvalho
- Soraia Lúcia da Silva

## Instruções de utilização

O código do projeto está localizado na pasta `Codigo`. O sistema possui duas partes principais: o back-end (API e banco de dados) e o front-end (UI). Para executar o sistema, siga os passos abaixo:

### Back-end

**Configuração do Banco de Dados**

Para executar o back-end, é necessário ter um banco de dados MySQL disponível. Dentro da pasta `Codigo/db`, há um arquivo `compose.yaml` que pode ser utilizado para subir um container Docker com o MySQL. Certifique-se de ter o Docker instalado. Neste arquivo, é possível ver a versão da imagem MySQL utilizada, o nome do banco de dados, o usuário e a senha. Se necessário, esses valores podem ser alterados.

Para subir o container, basta abrir um terminal, navegar até a pasta `Codigo/db` e executar o comando:

```bash
cd Codigo/db
docker compose up
```

Após a execução do comando com sucesso, o banco de dados estará disponível no endereço `localhost:13306`.

**Inicialização do Banco de Dados**

Para conectar no Banco de Dados insira todas as informações que está no compose.yaml e quando for conectar no MySQL provavelmente vai ter que adicionar uma nova propriedade no Driver Properties:
- Nome: allowPublicKeyRetrieval
- Valor: true

Com o banco de dados disponível, crie as tabelas e popule o banco com dados iniciais. Utilize uma ferramenta de gerenciamento de banco de dados (como MySQL Workbench ou DBeaver) e execute os scripts SQL disponíveis na pasta `Codigo/db` na ordem em que estão numerados.

**Execução da API**

Para executar a API, é necessário ter o Node.js na versão especificada no arquivo `Codigo/api/.nvmrc` instalada (v20.16.0). Recomenda-se o uso de um gerenciador de versões Node.js como **nvm**. Com o Node.js instalado, basta abrir um terminal, navegar até a pasta `Codigo/api`, instalar as dependências do projeto, especificar as variáveis de ambiente e executar o arquivo `server.js`:

### Passo 1
```bash
cd Codigo/api
npm install
```
### Passo 2

- Linux e macOS
```bash
export MYSQL_CONNECTION_URI="mysql://filigranadev:my-secret-pw-dev@localhost:13306/filigrana"
```
- Windows PowerShell
```bash
$env:MYSQL_CONNECTION_URI="mysql://filigranadev:my-secret-pw-dev@localhost:13306/filigrana"
```
- Windows CMD
```bash
set MYSQL_CONNECTION_URI=mysql://filigranadev:my-secret-pw-dev@localhost:13306/filigrana
```
### Passo 3
```bash
node server.js
```

Com a API em execução, o back-end estará disponível no endereço `http://localhost:3000`. A API possui uma documentação Swagger disponível no endereço `http://localhost:3000/api/docs/`.

### Front-end

[Assim que a primeira versão do sistema estiver disponível, deverá complementar com as instruções de utilização. Descreva como instalar eventuais dependências e como executar a aplicação.]
