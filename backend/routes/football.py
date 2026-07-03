from fastapi import APIRouter
from db import connection
import pymysql

router = APIRouter()


# FOOTBALL PRODUCTS
@router.get("/football")
def get_football_products():

    cursor = connection.cursor(
        pymysql.cursors.DictCursor
    )

    cursor.execute(
        """
        SELECT *
        FROM football_products
        """
    )

    products = cursor.fetchall()

    return products


# CRICKET PRODUCTS
@router.get("/cricket")
def get_cricket_products():

    cursor = connection.cursor(
        pymysql.cursors.DictCursor
    )

    cursor.execute(
        """
        SELECT *
        FROM cricket_products
        """
    )

    products = cursor.fetchall()

    return products


# BASKETBALL PRODUCTS
@router.get("/basketball")
def get_basketball_products():

    cursor = connection.cursor(
        pymysql.cursors.DictCursor
    )

    cursor.execute(
        """
        SELECT *
        FROM basketball_products
        """
    )

    products = cursor.fetchall()

    return products


# TENNIS PRODUCTS
@router.get("/tennis")
def get_tennis_products():

    cursor = connection.cursor(
        pymysql.cursors.DictCursor
    )

    cursor.execute(
        """
        SELECT *
        FROM tennis_products
        """
    )

    products = cursor.fetchall()

    return products