from fastapi import APIRouter
from db import get_connection
import pymysql
import os

router = APIRouter()


def ensure_product_table(cursor, table_name):

    cursor.execute(
        f"""
        CREATE TABLE IF NOT EXISTS {table_name} (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            price INT NOT NULL,
            image VARCHAR(255) NOT NULL,
            stock INT NOT NULL DEFAULT 0
        )
        """
    )


@router.get("/football")
def get_football_products():

    connection = get_connection()

    cursor = connection.cursor(
        pymysql.cursors.DictCursor
    )

    cursor.execute("""
        SELECT *
        FROM football_products
    """)

    products = cursor.fetchall()

    connection.close()

    return products


@router.get("/cricket")
def get_cricket_products():

    connection = get_connection()

    cursor = connection.cursor(
        pymysql.cursors.DictCursor
    )

    cursor.execute("""
        SELECT *
        FROM cricket_products
    """)

    products = cursor.fetchall()

    connection.close()

    return products


@router.get("/basketball")
def get_basketball_products():

    connection = get_connection()

    cursor = connection.cursor(
        pymysql.cursors.DictCursor
    )

    cursor.execute("""
        SELECT *
        FROM basketball_products
    """)

    products = cursor.fetchall()

    connection.close()

    return products


@router.get("/tennis")
def get_tennis_products():

    connection = get_connection()

    cursor = connection.cursor(
        pymysql.cursors.DictCursor
    )

    cursor.execute("""
        SELECT *
        FROM tennis_products
    """)

    products = cursor.fetchall()

    connection.close()

    return products


@router.get("/volleyball")
def get_volleyball_products():

    connection = get_connection()

    cursor = connection.cursor(
        pymysql.cursors.DictCursor
    )

    ensure_product_table(
        cursor,
        "volleyball_products"
    )

    cursor.execute("""
        SELECT *
        FROM volleyball_products
    """)

    products = cursor.fetchall()

    connection.close()

    return products

# =========================
# DELETE FOOTBALL PRODUCT
# =========================
@router.delete("/football/{product_id}")
def delete_football_product(product_id: int):

    connection = get_connection()

    cursor = connection.cursor(
        pymysql.cursors.DictCursor
    )

    cursor.execute(
        """
        SELECT image
        FROM football_products
        WHERE id=%s
        """,
        (product_id,)
    )

    product = cursor.fetchone()

    if not product:
        connection.close()

        return {
            "success": False,
            "message": "Product not found"
        }

    image_path = f"uploads/{product['image']}"

    if os.path.exists(image_path):
        os.remove(image_path)

    cursor.execute(
        """
        DELETE FROM football_products
        WHERE id=%s
        """,
        (product_id,)
    )

    connection.commit()
    connection.close()

    return {
        "success": True,
        "message": "Football Product Deleted Successfully"
    }


# =========================
# DELETE CRICKET PRODUCT
# =========================
@router.delete("/cricket/{product_id}")
def delete_cricket_product(product_id: int):

    connection = get_connection()

    cursor = connection.cursor(
        pymysql.cursors.DictCursor
    )

    cursor.execute(
        """
        SELECT image
        FROM cricket_products
        WHERE id=%s
        """,
        (product_id,)
    )

    product = cursor.fetchone()

    if not product:
        connection.close()

        return {
            "success": False,
            "message": "Product not found"
        }

    image_path = f"uploads/{product['image']}"

    if os.path.exists(image_path):
        os.remove(image_path)

    cursor.execute(
        """
        DELETE FROM cricket_products
        WHERE id=%s
        """,
        (product_id,)
    )

    connection.commit()
    connection.close()

    return {
        "success": True,
        "message": "Cricket Product Deleted Successfully"
    }


# =========================
# DELETE BASKETBALL PRODUCT
# =========================
@router.delete("/basketball/{product_id}")
def delete_basketball_product(product_id: int):

    connection = get_connection()

    cursor = connection.cursor(
        pymysql.cursors.DictCursor
    )

    cursor.execute(
        """
        SELECT image
        FROM basketball_products
        WHERE id=%s
        """,
        (product_id,)
    )

    product = cursor.fetchone()

    if not product:
        connection.close()

        return {
            "success": False,
            "message": "Product not found"
        }

    image_path = f"uploads/{product['image']}"

    if os.path.exists(image_path):
        os.remove(image_path)

    cursor.execute(
        """
        DELETE FROM basketball_products
        WHERE id=%s
        """,
        (product_id,)
    )

    connection.commit()
    connection.close()

    return {
        "success": True,
        "message": "Basketball Product Deleted Successfully"
    }


# =========================
# DELETE TENNIS PRODUCT
# =========================
@router.delete("/tennis/{product_id}")
def delete_tennis_product(product_id: int):

    connection = get_connection()

    cursor = connection.cursor(
        pymysql.cursors.DictCursor
    )

    cursor.execute(
        """
        SELECT image
        FROM tennis_products
        WHERE id=%s
        """,
        (product_id,)
    )

    product = cursor.fetchone()

    if not product:
        connection.close()

        return {
            "success": False,
            "message": "Product not found"
        }

    image_path = f"uploads/{product['image']}"

    if os.path.exists(image_path):
        os.remove(image_path)

    cursor.execute(
        """
        DELETE FROM tennis_products
        WHERE id=%s
        """,
        (product_id,)
    )

    connection.commit()
    connection.close()

    return {
        "success": True,
        "message": "Tennis Product Deleted Successfully"
    }
