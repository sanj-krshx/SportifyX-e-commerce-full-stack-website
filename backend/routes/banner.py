from fastapi import APIRouter, UploadFile, File
from db import connection
import pymysql
import shutil
import os

router = APIRouter()

UPLOAD_FOLDER = "uploads"

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)


# ===============================
# UPLOAD BANNER
# ===============================
@router.post("/admin/banner/upload")
async def upload_banner(file: UploadFile = File(...)):

    file_path = f"{UPLOAD_FOLDER}/{file.filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    cursor = connection.cursor()

    cursor.execute(
        """
        INSERT INTO banners(image)
        VALUES(%s)
        """,
        (file.filename,)
    )

    connection.commit()

    return {
        "success": True,
        "message": "Banner Uploaded Successfully"
    }


# ===============================
# GET ALL BANNERS
# ===============================
@router.get("/banner")
def get_banners():

    cursor = connection.cursor(
        pymysql.cursors.DictCursor
    )

    cursor.execute(
        """
        SELECT *
        FROM banners
        ORDER BY id DESC
        """
    )

    banners = cursor.fetchall()

    return banners


# ===============================
# DELETE BANNER
# ===============================
@router.delete("/admin/banner/{banner_id}")
def delete_banner(banner_id: int):

    cursor = connection.cursor(
        pymysql.cursors.DictCursor
    )

    cursor.execute(
        """
        SELECT image
        FROM banners
        WHERE id=%s
        """,
        (banner_id,)
    )

    banner = cursor.fetchone()

    if not banner:
        return {
            "success": False,
            "message": "Banner not found"
        }

    file_path = f"{UPLOAD_FOLDER}/{banner['image']}"

    if os.path.exists(file_path):
        os.remove(file_path)

    cursor.execute(
        """
        DELETE FROM banners
        WHERE id=%s
        """,
        (banner_id,)
    )

    connection.commit()

    return {
        "success": True,
        "message": "Banner Deleted Successfully"
    }