from db import connection

if connection.open:
    print("MySQL Connected Successfully")
else:
    print("Connection Failed")