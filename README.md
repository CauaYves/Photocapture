# Aplicação de Captura de Biometria Facial

Esta é uma aplicação React para captura de biometria facial. O projeto permite o uso de temas personalizados para diferentes clientes, com logos e favicons específicos. Siga as instruções abaixo para configurar e executar o projeto.

## Requisitos

Antes de começar, certifique-se de ter os seguintes softwares instalados no seu ambiente:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/) (geralmente vem junto com o Node.js)
- [Visual Studio Code](https://code.visualstudio.com/Download) (recomendado para edição de código)

## Compatibilidade com Navegadores

A aplicação é compatível com as seguintes e mais recentes versões dos principais navegadores:

- **Chrome**: 125
- **Edge**: 124
- **Firefox**: 125
- **Opera**: 110
- **Safari**: 17.3

**Observações:**

1. Estes navegadores não foram testados totalmente mas estão entre os mais utilizados mundialmente. É possivel que outros navegadores também consigam rodar a aplicação sem problemas.
2. Não foram realizados testes exaustivos em todas as versões de cada navegador dessa lista e ela serve somente como um guia inicial e não definitivo.
3. As versões mínimas são estimativas baseadas no suporte de algumas propriedades CSS mais recentes usadas no projeto.
4. Algumas versões antigas dos navegadores podem rodar o site sem problemas, mas recomendamos a versão mais recente para garantir compatibilidade total. Qualquer navegador atualizado em junho de 2024 deve rodar o app normalmente.
5. As limitações se concentram em propriedades CSS específicas. Navegadores mais antigos podem não exibir certos elementos visuais, mas o impacto para o usuário tende a ser mínimo.
6. A aplicação utiliza postcss e autoprefixer, permitindo que navegadores com suporte parcial a certas propriedades rodem o site normalmente.

### Verificando a instalação

Execute os seguintes comandos no terminal para verificar se o Node.js e o npm estão instalados corretamente:

```
node -v
npm -v
```

Ambos os comandos devem retornar a versão instalada.

## Estrutura do Projeto

`src/`: Contém os arquivos principais do código-fonte da aplicação React.

`public/`: Contém arquivos estáticos, incluindo temas específicos para clientes.

`public/App_Themes/`: Diretório onde são armazenados os temas de clientes.

`appSettings.json`: Arquivo onde é configurado o nome do cliente e a URL da API.

### Configuração do tema

A aplicação utiliza temas específicos para cada cliente. Para adicionar um novo tema, siga os passos abaixo:

- Navegue até a pasta **public/App_Themes**.
- Crie uma subpasta com o nome do cliente.
- icione os seguintes arquivos de imagem dentro da nova pasta do cliente:

  - **logo.png** (logo principal)
  - **logo192.png** (usado para ícones da web)
  - **favicon.ico** (ícone do navegador)

### Configuração do `appSettings.json`

O arquivo `appSettings.json` é usado para armazenar o nome do cliente e a URL da API correspondente.

- Navegue até a pasta `public` e abra o arquivo `appSettings.json`.
- Altere as informações para o cliente desejado, como no exemplo abaixo:

```
{
  "clientName": "ClienteXYZ",
  "apiUrl": "https://api.clienteXYZ.com"
}
```

Certifique-se de que o valor **clientName** corresponde ao nome da subpasta criada em **public/App_Themes**.

## Executar a Aplicação

###### WebStorm

- Pressione **F5** para abrir as opções de execução, ao abrir o projeto pela primeira vez, use "**Install**", uma vez instalado, as demais vezes pode ser usado o comando "**Execute**".

###### Visual Studio Code

- Pressione **CTRL** + **SHIFT** + **D** para abrir a janela de execução e selecione a opção "**Install**" ao abrir o projeto pela primeira vez, as demais vezes pode ser usado o comando "**Execute**".
