docker_version = docker --version

setup:
ifndef docker_version
    $(error "Ops! Docker não instalado na máquina, realize a instalação primeiro! ;)")
endif

run:
	echo "-----> Subindo o ambiente no docker"
	docker-compose up --build -d
	echo "-----> Instalando as dependencias com npm"
	docker exec -it server-localizai npm install

stop:
	echo "-----> Preparando para desligar tudo e você poder dormir"
	cd docker && docker-compose down
