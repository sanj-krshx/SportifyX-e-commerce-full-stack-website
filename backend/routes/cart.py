from fastapi import APIRouter
from db import connection
from schemas import CartItem
import pymysql

router = APIRouter()


@router.post("/cart/add")
def add_to_cart(item: CartItem):

    cursor = connection.cursor(
        pymysql.cursors.DictCursor
    )

    cursor.execute(
        """
        SELECT * FROM cart
        WHERE user_id=%s
        AND product_id=%s
        """,
        (
            item.user_id,
            item.product_id
        )
    )

    existing_item = cursor.fetchone()

    if existing_item:

        cursor = connection.cursor()

        cursor.execute(
            """
            UPDATE cart
            SET quantity = quantity + %s
            WHERE user_id=%s
            AND product_id=%s
            """,
            (
                item.quantity,
                item.user_id,
                item.product_id
            )
        )

    else:

        cursor = connection.cursor()

        cursor.execute(
            """
            INSERT INTO cart
            (user_id, product_id, quantity)
            VALUES (%s,%s,%s)
            """,
            (
                item.user_id,
                item.product_id,
                item.quantity
            )
        )

    connection.commit()

    return {
        "message": "Product Added To Cart"
    }


@router.get("/cart/{user_id}")
def get_cart(user_id: int):

    cursor = connection.cursor(
        pymysql.cursors.DictCursor
    )

    cursor.execute(
        """
        SELECT

        cart.id,
        products.name,
        products.price,
        products.image,
        cart.quantity

        FROM cart

        JOIN products

        ON cart.product_id = products.id

        WHERE cart.user_id=%s
        """,
        (user_id,)
    )

    cart_items = cursor.fetchall()

    return cart_items


@router.delete("/cart/remove/{cart_id}")
def remove_cart_item(cart_id: int):

    cursor = connection.cursor()

    cursor.execute(
        """
        DELETE FROM cart
        WHERE id=%s
        """,
        (cart_id,)
    )

    connection.commit()

    return {
        "message": "Item Removed"
    }