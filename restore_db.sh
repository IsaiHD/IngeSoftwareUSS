#!/bin/bash

# Esperar a que SQL Server esté listo
until /opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P 'Inge1234@' -Q 'SELECT 1'; do
    sleep 1
done

# Restaurar la base de datos si no existe
/opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P 'Inge1234@' -Q "IF DB_ID('IngeSoftware') IS NULL RESTORE DATABASE [IngeSoftware] FROM DISK = N'/var/opt/mssql/backup/gorm.bak' WITH FILE = 1, NOUNLOAD, REPLACE, STATS = 5"
