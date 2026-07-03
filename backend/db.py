import pymysql
import os
from pathlib import Path


def load_env_file():

    env_path = Path(__file__).with_name(".env")

    if not env_path.exists():
        return

    for line in env_path.read_text().splitlines():
        line = line.strip()

        if not line or line.startswith("#") or "=" not in line:
            continue

        key, value = line.split("=", 1)
        os.environ.setdefault(
            key.strip(),
            value.strip()
        )


load_env_file()

def get_connection():

    return pymysql.connect(
        host=os.getenv("DB_HOST", "localhost"),
        user=os.getenv("DB_USER", "root"),
        password=os.getenv("DB_PASSWORD", "test1234"),
        database=os.getenv("DB_NAME", "sports_ecommerce"),
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
