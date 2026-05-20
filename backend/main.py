from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import math

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://calculator-5rl9.vercel.app/calculate"],          # tighten this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Calculation(BaseModel):
    expression: str


@app.post("/calculate")
def calculate(data: Calculation):
    try:
        expression = data.expression          # FIX 1: was `expression: data.expression`

        allowed_names = {
            "sqrt": math.sqrt,
            "sin": math.sin,
            "cos": math.cos,
            "tan": math.tan,
            "log": math.log10,
            "ln": math.log,
            "pi": math.pi,
            "e": math.e,
            "pow": math.pow,
            "abs": abs,
            "round": round,
        }

        result = eval(expression, {"__builtins__": {}}, allowed_names)  # FIX 2: was `expressions`

        return {"expression": expression, "result": result}

    except ZeroDivisionError:
        return {"error": "Division by zero"}
    except Exception as e:
        return {"error": str(e)}


@app.get("/")
def home():
    return {"message": "Scientific Calculator API is running"}