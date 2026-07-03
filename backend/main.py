from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from routes.auth import router as auth_router
from routes.products import router as products_router
from routes.cart import router as cart_router
from routes.admin import router as admin_router
from routes.banner import router as banner_router
from routes.football import router as football_router

app = FastAPI()

# ==========================
# STATIC FILES
# ==========================
app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads"
)

# ==========================
# CORS
# ==========================
app.add_middleware(
    CORSMiddleware,
    allow_origins=[],
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1):[0-9]+",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================
# HOME
# ==========================
@app.get("/")
def home():
    return {
        "message": "SportifyX Backend Running Successfully"
    }

# ==========================
# ROUTERS
# ==========================
app.include_router(auth_router)

app.include_router(products_router)

app.include_router(cart_router)

app.include_router(admin_router)

app.include_router(banner_router)

app.include_router(football_router)
