FROM golang:1.23.0-bookworm

RUN mkdir -p /home/app

COPY . /home/app

COPY go.mod go.sum ./

RUN go mod download

COPY . .

EXPOSE 8080

CMD ["go", "run", "/home/app/main.go"]
