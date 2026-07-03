from fastapi import APIRouter, UploadFile, File, Form
from db import connection, reconnect
import pymysql
import shutil
import os

router = APIRouter()

UPLOAD_FOLDER = "uploads"

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)


def get_stock_column(cursor, table_name):

    cursor.execute(
        f"""
        SHOW COLUMNS
        FROM {table_name}
        LIKE 'stock'
        """
    )

    if cursor.fetchone():
        return "stock"

    return "quantity"


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


def update_product(table_name, product_id, product):

    db = reconnect()

    cursor = db.cursor(
        pymysql.cursors.DictCursor
    )

    try:
        ensure_product_table(
            cursor,
            table_name
        )

        stock_column = get_stock_column(
            cursor,
            table_name
        )

        cursor.execute(
            f"""
            UPDATE {table_name}
            SET
                name=%s,
                price=%s,
                {stock_column}=%s
            WHERE id=%s
            """,
            (
                product["name"],
                product["price"],
                product["quantity"],
                product_id
            )
        )

        db.commit()

        return {
            "success": True,
            "message": "Product Updated"
        }

    except pymysql.MySQLError as error:

        return {
            "success": False,
            "message": str(error)
        }


def add_product(table_name, name, price, quantity, file, success_message):

    db = reconnect()

    cursor = db.cursor(
        pymysql.cursors.DictCursor
    )

    try:
        ensure_product_table(
            cursor,
            table_name
        )

        stock_column = get_stock_column(
            cursor,
            table_name
        )

        file_path = f"{UPLOAD_FOLDER}/{file.filename}"

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        cursor.execute(
            f"""
            INSERT INTO {table_name}
            (name,price,image,{stock_column})
            VALUES(%s,%s,%s,%s)
            """,
            (
                name,
                price,
                file.filename,
                quantity
            )
        )

        db.commit()

        return {
            "success": True,
            "message": success_message
        }

    except pymysql.MySQLError as error:

        return {
            "success": False,
            "message": str(error)
        }


# =====================================
# ADMIN LOGIN
# =====================================
@router.post("/admin/login")
def admin_login(admin: dict):

    cursor = connection.cursor(
        pymysql.cursors.DictCursor
    )

    cursor.execute(
        """
        SELECT *
        FROM admins
        WHERE username=%s
        AND password=%s
        """,
        (
            admin["username"],
            admin["password"]
        )
    )

    result = cursor.fetchone()

    if result:

        return {
            "success": True,
            "message": "Admin Login Successful",
            "admin": {
                "id": result["id"],
                "username": result["username"]
            }
        }

    return {
        "success": False,
        "message": "Invalid Username or Password"
    }


@router.get("/admin/users")
def get_admin_users():

    cursor = connection.cursor(
        pymysql.cursors.DictCursor
    )

    cursor.execute(
        """
        SELECT id, fullname, email, mobile
        FROM users
        ORDER BY id DESC
        """
    )

    return cursor.fetchall()


@router.delete("/admin/users/{user_id}")
def delete_admin_user(user_id: int):

    cursor = connection.cursor()

    cursor.execute(
        """
        DELETE FROM users
        WHERE id=%s
        """,
        (user_id,)
    )

    connection.commit()

    return {
        "success": True,
        "message": "User deleted"
    }


@router.get("/admin/orders")
def get_admin_orders():

    cursor = connection.cursor(
        pymysql.cursors.DictCursor
    )

    try:
        cursor.execute(
            """
            SELECT *
            FROM orders
            ORDER BY id DESC
            """
        )

        return cursor.fetchall()

    except pymysql.MySQLError:
        return []


# =====================================
# FOOTBALL
# =====================================
@router.post("/football/add")
async def add_football_product(
    name: str = Form(...),
    price: int = Form(...),
    quantity: int = Form(...),
    file: UploadFile = File(...)
):

    return add_product(
        "football_products",
        name,
        price,
        quantity,
        file,
        "Football Product Added"
    )


@router.delete("/football/{product_id}")
def delete_football(product_id: int):

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

    if product:

        file_path = f"{UPLOAD_FOLDER}/{product['image']}"

        if os.path.exists(file_path):
            os.remove(file_path)

    cursor.execute(
        """
        DELETE FROM football_products
        WHERE id=%s
        """,
        (product_id,)
    )

    connection.commit()

    return {
        "success": True,
        "message": "Football Product Deleted"
    }

@router.put("/football/{product_id}")
def update_football(
    product_id: int,
    product: dict
):

    return update_product(
        "football_products",
        product_id,
        product
    )

# =====================================
# CRICKET
# =====================================
@router.post("/cricket/add")
async def add_cricket_product(
    name: str = Form(...),
    price: int = Form(...),
    quantity: int = Form(...),
    file: UploadFile = File(...)
):

    return add_product(
        "cricket_products",
        name,
        price,
        quantity,
        file,
        "Cricket Product Added"
    )


@router.delete("/cricket/{product_id}")
def delete_cricket(product_id: int):

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

    if product:

        file_path = f"{UPLOAD_FOLDER}/{product['image']}"

        if os.path.exists(file_path):
            os.remove(file_path)

    cursor.execute(
        """
        DELETE FROM cricket_products
        WHERE id=%s
        """,
        (product_id,)
    )

    connection.commit()

    return {
        "success": True,
        "message": "Cricket Product Deleted"
    }

@router.put("/cricket/{product_id}")
def update_cricket(
    product_id: int,
    product: dict
):

    return update_product(
        "cricket_products",
        product_id,
        product
    )


# =====================================
# BASKETBALL
# =====================================
@router.post("/basketball/add")
async def add_basketball_product(
    name: str = Form(...),
    price: int = Form(...),
    quantity: int = Form(...),
    file: UploadFile = File(...)
):

    return add_product(
        "basketball_products",
        name,
        price,
        quantity,
        file,
        "Basketball Product Added"
    )


@router.delete("/basketball/{product_id}")
def delete_basketball(product_id: int):

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

    if product:

        file_path = f"{UPLOAD_FOLDER}/{product['image']}"

        if os.path.exists(file_path):
            os.remove(file_path)

    cursor.execute(
        """
        DELETE FROM basketball_products
        WHERE id=%s
        """,
        (product_id,)
    )

    connection.commit()

    return {
        "success": True,
        "message": "Basketball Product Deleted"
    }

@router.put("/basketball/{product_id}")
def update_basketball(
    product_id: int,
    product: dict
):

    return update_product(
        "basketball_products",
        product_id,
        product
    )


# =====================================
# TENNIS
# =====================================
@router.post("/tennis/add")
async def add_tennis_product(
    name: str = Form(...),
    price: int = Form(...),
    quantity: int = Form(...),
    file: UploadFile = File(...)
):

    return add_product(
        "tennis_products",
        name,
        price,
        quantity,
        file,
        "Tennis Product Added"
    )


@router.delete("/tennis/{product_id}")
def delete_tennis(product_id: int):

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

    if product:

        file_path = f"{UPLOAD_FOLDER}/{product['image']}"

        if os.path.exists(file_path):
            os.remove(file_path)

    cursor.execute(
        """
        DELETE FROM tennis_products
        WHERE id=%s
        """,
        (product_id,)
    )

    connection.commit()

    return {
        "success": True,
        "message": "Tennis Product Deleted"
    }

@router.put("/tennis/{product_id}")
def update_tennis(
    product_id: int,
    product: dict
):

    return update_product(
        "tennis_products",
        product_id,
        product
    )


# =====================================
# VOLLEYBALL
# =====================================
@router.post("/volleyball/add")
async def add_volleyball_product(
    name: str = Form(...),
    price: int = Form(...),
    quantity: int = Form(...),
    file: UploadFile = File(...)
):

    return add_product(
        "volleyball_products",
        name,
        price,
        quantity,
        file,
        "Volleyball Product Added"
    )


@router.delete("/volleyball/{product_id}")
def delete_volleyball(product_id: int):

    db = reconnect()

    cursor = db.cursor(
        pymysql.cursors.DictCursor
    )

    ensure_product_table(
        cursor,
        "volleyball_products"
    )

    cursor.execute(
        """
        SELECT image
        FROM volleyball_products
        WHERE id=%s
        """,
        (product_id,)
    )

    product = cursor.fetchone()

    if product:

        file_path = f"{UPLOAD_FOLDER}/{product['image']}"

        if os.path.exists(file_path):
            os.remove(file_path)

    cursor.execute(
        """
        DELETE FROM volleyball_products
        WHERE id=%s
        """,
        (product_id,)
    )

    db.commit()

    return {
        "success": True,
        "message": "Volleyball Product Deleted"
    }


@router.put("/volleyball/{product_id}")
def update_volleyball(
    product_id: int,
    product: dict
):

    return update_product(
        "volleyball_products",
        product_id,
        product
    )
