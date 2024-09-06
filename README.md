# Programas

https://code.visualstudio.com/ \
https://docs.docker.com/desktop/install/windows-install/ \
https://go.dev/ \
https://desktop.github.com/download/ 

# Instalación 

1.-Deben instalar todas las cosas y clonar el repositorio 

```
git clone https://github.com/IsaiHD/IngeSoftwareUSS.git
```
u ocupar Github Desktop

2.- Descarguen e instalen Docker, luego vayan a VScode y en la terminal coloquen:
```
docker compose build
docker compose up
```
Esto les abirira un docker con todas la dependecias que necesitan.
Deben crear un arhivo que se llame 
**.env**

y dentro debe tener esto:

```
DB_USER = 'sa'
DB_PASSWORD = 'Inge1234%40'
DB_HOST = 'localhost'
DB_PORT = '1433'
DB_NAME = 'IngeSoftware'

```

luego pongan este comando:

```
go mod tidy
```


para iniciar la api deben correr este comando en la carpeta raiz
```
go run main.go
```

Luego inician la pág web con LIVE SERVER (Extension de VS code)
y prueban la pág 

:D
