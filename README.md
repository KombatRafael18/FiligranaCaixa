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

Execute no terminal o seguinte comando:

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

# Instruções para rodar o frontend

Esse projeto foi feito utilizando os frameworks React e Tailwind CSS

## Instalação de dependências e execução

Após clonar o repositório navegue até o diretório Codigo\frontend\src e execute os seguintes comandos no terminal:

### `npm install`
### `npm start`

Isso vai executar o projeto localmente em modo de desenvolvimento.\
Abra [http://localhost:3000](http://localhost:3000) para acessar pelo browser.

## Deploy

O projeto está hospedado em uma instância EC2 da AWS. A implantação foi feita utilizando o Docker e Docker Compose. O arquivo de configuração do Docker Compose utilizado foi o `compose.deploy.yaml` localizado na pasta `Codigo/`.

Para atualizar a versão do projeto no servidor, siga os passos abaixo:

### Passo 1

Faça o build da imagem Docker do projeto e publique no GitHub Container Registry. Para isso, crie uma tag no projeto no formato `X.Y.Z` e o CI do GitHub Actions será acionado automaticamente e irá fazer o build e publicar a imagem no GitHub Container Registry.

```sh
# Use a interface gráfica do GitHub para criar a tag

# ou crie uma tag no terminal e faça o push
git tag 0.0.1 -m "Versão com funcionalidade X, Y e Z"
git push origin 0.0.1

# ou crie uma tag de teste de build no terminal e faça o push
git tag 0.0.1-alpha.1-build -m "Teste de build"
git push origin 0.0.1-alpha.1-build
```

### Passo 2

Acesse o servidor EC2 via SSH e navegue até a pasta `deploy/`.

### Passo 3

Edite o arquivo `compose.yaml` e altere as tags das imagens Docker para a nova versão criada anteriormente. Por exemplo:

```yaml
# Antes - versão 1.0.0
services:
  frontend:
    image: <nome_imagem>:1.0.0

# Depois - versão 1.0.1
services:
  frontend:
    image: <nome_imagem>:1.0.1
```

### Passo 4

Execute o comando abaixo para baixar a nova versão da imagem Docker:

```bash
docker-compose pull
```

### Passo 5

Execute o comando abaixo para subir os containers com a nova versão do projeto:

```bash
docker-compose up -d
```
