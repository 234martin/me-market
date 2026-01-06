# backend/main.py
from fastapi import FastAPI, Depends, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import Column, Integer, String, Float, DateTime, JSON, create_engine
from sqlalchemy.orm import sessionmaker, declarative_base, Session
from typing import List, Optional
import stripe
import paypalrestsdk
import requests
import base64
import datetime
import asyncio

# =========================================================
# ENV / CONFIG
# =========================================================

STRIPE_SECRET_KEY = "sk_test_xxxxx"
PAYPAL_CLIENT_ID = "your_paypal_client_id"
PAYPAL_SECRET = "your_paypal_secret"

MPESA_CONSUMER_KEY = "your_mpesa_key"
MPESA_CONSUMER_SECRET = "your_mpesa_secret"
MPESA_SHORTCODE = "174379"
MPESA_PASSKEY = "your_passkey"
MPESA_CALLBACK_URL = "https://yourdomain.com/mpesa/callback"

stripe.api_key = STRIPE_SECRET_KEY

paypalrestsdk.configure({
    "mode": "sandbox",
    "client_id": PAYPAL_CLIENT_ID,
    "client_secret": PAYPAL_SECRET
})

# =========================================================
# DATABASE
# =========================================================

DATABASE_URL = "sqlite:///./market.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# =========================================================
# MODELS
# =========================================================

class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True)
    name = Column(String)
    price = Column(Float)
    image = Column(String)
    category = Column(String)
    description = Column(String)
    seller_id = Column(Integer)

class Order(Base):
    __tablename__ = "orders"
    id = Column(Integer, primary_key=True)
    guest_name = Column(String, nullable=False)
    guest_email = Column(String, nullable=False)
    guest_phone = Column(String, nullable=False)
    guest_address = Column(String, nullable=True)
    cart_items = Column(JSON)
    total_amount = Column(Float)
    payment_method = Column(String)
    payment_status = Column(String, default="Pending")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

Base.metadata.create_all(bind=engine)

# =========================================================
# SCHEMAS
# =========================================================

class ProductCreate(BaseModel):
    name: str
    price: float
    image: Optional[str] = None
    category: str
    description: Optional[str] = None
    seller_id: int

class ProductOut(ProductCreate):
    id: int

class PaymentRequest(BaseModel):
    amount: float
    currency: str = "USD"
    phone: Optional[str] = None

class OrderCreate(BaseModel):
    guest_name: str
    guest_email: str
    guest_phone: str
    guest_address: Optional[str] = None
    cart_items: List[dict]
    total_amount: float
    payment_method: str

class OrderOut(OrderCreate):
    id: int
    payment_status: str
    created_at: datetime.datetime

# =========================================================
# APP
# =========================================================

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================================================
# WEBSOCKET MANAGER
# =========================================================

class ConnectionManager:
    def __init__(self):
        self.connections: List[WebSocket] = []

    async def connect(self, ws: WebSocket):
        await ws.accept()
        self.connections.append(ws)

    def disconnect(self, ws: WebSocket):
        if ws in self.connections:
            self.connections.remove(ws)

    async def broadcast(self, data: dict):
        for ws in self.connections:
            try:
                await ws.send_json(data)
            except:
                self.disconnect(ws)

manager = ConnectionManager()

# =========================================================
# PRODUCT ENDPOINTS
# =========================================================

@app.get("/products", response_model=List[ProductOut])
def get_products(db: Session = Depends(get_db)):
    return db.query(Product).all()

@app.post("/products", response_model=ProductOut, status_code=201)
async def create_product(payload: ProductCreate, db: Session = Depends(get_db)):
    product = Product(**payload.dict())
    db.add(product)
    db.commit()
    db.refresh(product)

    # Broadcast to WebSocket clients
    await manager.broadcast({
        "action": "new_product",
        "product": payload.dict() | {"id": product.id}
    })

    return product

@app.delete("/products/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).get(product_id)
    if not product:
        return {"error": "Product not found"}
    db.delete(product)
    db.commit()
    return {"status": "deleted"}

# =========================================================
# WEBSOCKET
# =========================================================

@app.websocket("/ws/products")
async def ws_products(ws: WebSocket):
    await manager.connect(ws)
    try:
        while True:
            await asyncio.sleep(10)
            await ws.send_json({"ping": "alive"})
    except WebSocketDisconnect:
        manager.disconnect(ws)

# =========================================================
# PAYMENTS
# =========================================================

@app.post("/pay/stripe")
def pay_stripe(payload: PaymentRequest):
    intent = stripe.PaymentIntent.create(
        amount=int(payload.amount * 100),
        currency=payload.currency,
        payment_method_types=["card"]
    )
    return {"client_secret": intent.client_secret}

@app.post("/pay/paypal")
def pay_paypal(payload: PaymentRequest):
    payment = paypalrestsdk.Payment({
        "intent": "sale",
        "payer": {"payment_method": "paypal"},
        "transactions": [{
            "amount": {"total": str(payload.amount), "currency": payload.currency},
            "description": "Marketplace Order"
        }],
        "redirect_urls": {
            "return_url": "http://localhost:5173/success",
            "cancel_url": "http://localhost:5173/cancel"
        }
    })

    if payment.create():
        for link in payment.links:
            if link.rel == "approval_url":
                return {"approval_url": link.href}
    return {"error": "PayPal failed"}

def mpesa_token():
    auth = base64.b64encode(f"{MPESA_CONSUMER_KEY}:{MPESA_CONSUMER_SECRET}".encode()).decode()
    res = requests.get(
        "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
        headers={"Authorization": f"Basic {auth}"}
    )
    return res.json()["access_token"]

@app.post("/pay/mpesa")
def pay_mpesa(payload: PaymentRequest):
    token = mpesa_token()
    timestamp = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
    password = base64.b64encode(f"{MPESA_SHORTCODE}{MPESA_PASSKEY}{timestamp}".encode()).decode()

    response = requests.post(
        "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "BusinessShortCode": MPESA_SHORTCODE,
            "Password": password,
            "Timestamp": timestamp,
            "TransactionType": "CustomerPayBillOnline",
            "Amount": payload.amount,
            "PartyA": payload.phone,
            "PartyB": MPESA_SHORTCODE,
            "PhoneNumber": payload.phone,
            "CallBackURL": MPESA_CALLBACK_URL,
            "AccountReference": "Marketplace",
            "TransactionDesc": "Order Payment"
        }
    )
    return response.json()

@app.post("/pay/bank")
def pay_bank(payload: PaymentRequest):
    return {
        "status": "pending",
        "bank": "ABC Bank",
        "account": "123456789",
        "amount": payload.amount
    }

# =========================================================
# ORDERS
# =========================================================

@app.post("/orders", response_model=OrderOut)
def create_order(order: OrderCreate, db: Session = Depends(get_db)):
    new_order = Order(
        guest_name=order.guest_name,
        guest_email=order.guest_email,
        guest_phone=order.guest_phone,
        guest_address=order.guest_address,
        cart_items=order.cart_items,
        total_amount=order.total_amount,
        payment_method=order.payment_method,
        payment_status="Paid"
    )
    db.add(new_order)
    db.commit()
    db.refresh(new_order)
    return new_order
