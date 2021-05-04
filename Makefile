docker_version = docker --version

setup:
ifndef docker_version
    $(error "Ops! Docker não instalado na máquina, realize a instalação primeiro! ;)")
endif

run:
	echo "-----> Subindo o ambiente no docker"
	docker-compose up --build -d

stop:
	echo "-----> Preparando para desligar tudo e você poder dormir"
	docker-compose down
