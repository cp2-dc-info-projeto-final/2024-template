# Como rodar o projeto

O sistema é dividido em duas aplicações:
 - Backend em Node.js/Express
 - Frontend em Svelte

Se você está com dificuldade de rodar o projeto, será mais fácil baixar este modelo, colocar no seu repositório (copiar as duas pastas para dentro do seu projeto) e depois que estiver tudo funcionando aplicar suas alterações.

## Windows, Linux e WSL

Este projeto funciona melhor rodando em ambiente Linux. Se você está utilizando Windows, basta rodar tudo dentro do WSL (linha de comando). Ao abrir sua IDE (VS Code recomendado) se certifique que está acessando o sistema no WSL e não no Windows, do contrário não funcionará corretamente. Se for este o caso, se certifique de que o projeto está dentro da pasta do WSL, não no sistema do Windows. Sugestão de caminho para clonar seu repositório: `/home/labcaxias/git`

## Instalando o node na versão correta

Recomendamos node na versão `v22.8.0` e npm versão `10.8.2`. Abaixo um passo a passo para instalar em ambiente Linux baseado em Ubuntu, que é a distro padrão do WSL:

 - instalar o comando n: `sudo npm install -g n`
 - usar o n para atualizar o node: `sudo n latest`
 - atualizar a hash para verificar versao: `hash -r`
 - checar versão do node: `node -v`
 - checar versão do npm: `npm -v`

Se você estiver no labotratório de informática será necessário desativar o SSL por um problema da rede do CPII:

`npm set strict-ssl false`

## Rodando o backend

Com o projeto clonado (sem pastas `node_modules`) ir na pasta `api` e instalar as dependências:

`npm install`

Rodar o node na pasta api: 

`node server.js`

O Backend está configurado para rodar na porta `3000`. Para seguir você precisa abrir outra aba do terminal porque a atual ficará ocupada com o servidor do backend.

## Rodando o frontend

Com o projeto clonado (sem pastas `node_modules`) ir na pasta `frontend-app` e instalar as dependências:

`npm install`

Depois rodar a aplicação (outro terminal com o node ainda rodando):

`npm run dev`

Neste momento se você estiver na IDE VSCode uma notificação fará sugestão de abrir o link para aplicação frontend rodando na porta `5173`, acessível pelo caminho `localhost:5173`.

Obs.: Se você estiver no WSL esta etapa efetua um encaminhamento de porta para o host (windows), que não é automática mas o VS Code Captura e sugere. Rodando diretamente do terminal você precisará fazer o port forwarding manualmente para abrir no navegador do windows.

Caso você queira configurar manualmente o projeto procure o [Vite](https://vitejs.dev/) e utilize o padrão Svelte (não SvelteKit) com JavaScript (não TypeScript).

