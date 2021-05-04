# Projeto: desafio-localizai
## _Desafio do projeto utilizando Maps_

Este projeto utiliza uma API com dados de teste para simular Login e novos cadastros, e também utilizar a API do Google Maps para listar serviços próximos a sua localização.

## Funcionalidades
- Login/Cadastro
- Listagem de seviços próximos a sua localização (por meio do Geolocation) em formato de Mapa e texto.
- Filro para aumentar o alcance da busca (em KM).
- Possibilidade de adicionar no favorito (com Localstorage), permitindo que outros usuários vejam.
- Possibilidade de adicionar avaliação (comentário), permitindo que outors usuários vejam (Localstorage).
- Visualização e edição do perfil do usuário.
- Responsividade nas telas.


## Tecnologia
- VueJS 3
- Axios
- REQ|RES (que até então eu não conhecia)
- Docker e Docker-compose
- Nginx e node (para deploy final no docker)
- Netlify (para deploy)

## Instalação
É necessario acessar o site https://brasil.io/covid19/ para criar um token de acesso a API.
Feito isso, adicione o token no arquivo .env.local

## Setup
Com docker:
```sh
docker-compose up --build -d
```
Com yarn ou npm:
```sh
yarn install
npm install
```


## Run
Com docker:
```sh
docker-compose up --build -d
```

Com yarn ou npm:
```sh
yarn serve
npm run serve
```

Com Make:
```sh
make run
```

![Image da tela de estados](https://github.com/leoeek/vue-covid/blob/main/img1.png?raw=true)
![Image da tela de cidades](https://github.com/leoeek/vue-covid/blob/main/img2.png?raw=true)
