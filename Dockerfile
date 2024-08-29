FROM mcr.microsoft.com/mssql/server:2019-latest

# Copiar el archivo de respaldo y el script de restauración al contenedor
COPY gorm.bak /var/opt/mssql/backup/
COPY restore_db.sh /usr/src/app/restore_db.sh

# Hacer ejecutable el script
RUN chmod +x /usr/src/app/restore_db.sh

# Comando para ejecutar SQL Server y restaurar la base de datos
CMD /bin/bash /usr/src/app/restore_db.sh & /opt/mssql/bin/sqlservr

# docker exec -it ingesoftwareuss-db-1 /opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P 'Inge1234@' -Q "BACKUP DATABASE IngeSoftware TO DISK='/var/opt/mssql/backup/gorm.bak'"  
