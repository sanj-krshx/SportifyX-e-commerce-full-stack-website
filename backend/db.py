import pymysql

def get_connection():

    return pymysql.connect(
        host="localhost",
        user="root",
        password="test1234",
        database="sports_ecommerce",
        cursorclass=pymysql.cursors.DictCursor,
        autocommit=True
    )


# Initial connection
connection = get_connection()


def reconnect():

    global connection

    try:
        connection.ping(reconnect=True)

    except:
        connection = get_connection()

    return connection