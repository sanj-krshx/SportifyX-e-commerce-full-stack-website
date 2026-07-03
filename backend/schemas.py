from pydantic import BaseModel

class UserSignup(BaseModel):
    fullname: str
    email: str
    mobile: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class CartItem(BaseModel):
    user_id: int
    product_id: int
    quantity: int