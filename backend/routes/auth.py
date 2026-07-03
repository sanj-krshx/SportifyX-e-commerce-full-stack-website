from fastapi import APIRouter
from db import connection
from schemas import UserSignup, UserLogin
import pymysql

router = APIRouter()


@router.post("/signup")
def signup(user: UserSignup):

    cursor = connection.cursor(
        pymysql.cursors.DictCursor
    )

    cursor.execute(
        "SELECT * FROM users WHERE email=%s",
        (user.email,)
    )

    existing_user = cursor.fetchone()

    if existing_user:
        return {
            "success": False,
            "message": "Email already registered"
        }

    cursor = connection.cursor()

    cursor.execute(
        """
        INSERT INTO users
        (fullname,email,mobile,password)
        VALUES (%s,%s,%s,%s)
        """,
        (
            user.fullname,
            user.email,
            user.mobile,
            user.password
        )
    )

    connection.commit()

    return {
        "success": True,
        "message": "User Registered Successfully"
    }


@router.post("/login")
def login(user: UserLogin):

    cursor = connection.cursor(
        pymysql.cursors.DictCursor
    )

    cursor.execute(
        """
        SELECT * FROM users
        WHERE email=%s
        AND password=%s
        """,
        (
            user.email,
            user.password
        )
    )

    existing_user = cursor.fetchone()

    if existing_user:

        return {
            "success": True,
            "user": {
                "id": existing_user["id"],
                "fullname": existing_user["fullname"],
                "email": existing_user["email"]
            }
        }

    return {
        "success": False,
        "message": "Invalid Email or Password"
    }