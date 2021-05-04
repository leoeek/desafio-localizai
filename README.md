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
Esta utilizando somente tecnologia Frontend.
Para consultar a documentação e exemplos da API de teste, acesse REQ|RES (https://reqres.in/).
Para acessar a documentação da API do Google Places acesse (https://cloud.google.com/maps-platform/places/).

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
Home
![Image da tela de Login](https://github.com/leoeek/desafio-localizai/blob/master/image/Home.png?raw=true)

Mapa
![Image da tela de Mapa](https://github.com/leoeek/desafio-localizai/blob/master/image/maps_1.png?raw=true)

Perfil
![Image da tela de edição do Perfil](https://github.com/leoeek/desafio-localizai/blob/master/image/perfil.png?raw=true)

Responsiva Mapa
![Image da tela de Mapa Responsiva](https://github.com/leoeek/desafio-localizai/blob/master/image/menor_1.png?raw=true)

Responsiva Login
![Image da tela de Mapa Responsiva](https://github.com/leoeek/desafio-localizai/blob/master/image/menor_2.png?raw=true)
