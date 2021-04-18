from typing import Optional

from fastapi import FastAPI, Body, Request
from fastapi.encoders import jsonable_encoder
from fastapi.middleware.cors import CORSMiddleware
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
import json

app = FastAPI()

app.mount("/static", StaticFiles(directory="api/templates/static"), name="static")
templates = Jinja2Templates(directory="api/templates")

FILE_NAME = "data.json"

def startup_data_structures():
    """
    Initializes the shared sequence information that will be edited on collaboratively.
    """
    # Setup sequence data
    sequence_data = []
    instruments = 3
    steps = 8
    for _ in range(instruments):
        notes = []
        for _ in range(steps):
            notes.append(0)
        sequence_data.append(notes)
    # Setup named assignments
    assignments = {}

    return {
        "sequence_data": sequence_data,
        "assignments": assignments
    }

with open(FILE_NAME,'w') as f:
    json.dump(startup_data_structures(), f)

# Allow CORS since that's the main way we'll be interacting with the API
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


@app.get("/sequence/{name}")
def sequence():
    with open(FILE_NAME) as f:
        return json.load(f)

@app.post("/update-sequence")
def sequence(payload: dict = Body(...)):
    if payload:
        with open(FILE_NAME,'w') as f:
            data = json.dump(payload, f)
    return data

@app.post("/leave/{name}")
def leave(name: str):
    return name