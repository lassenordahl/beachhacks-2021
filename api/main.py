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
INSTRUMENTS = [0, 1, 2]
STEPS = 8


def startup_data_structures():
    """
    Initializes the shared sequence information that will be edited on collaboratively.
    """
    # Setup sequence data
    sequence_data = []
    for _ in INSTRUMENTS:
        notes = []
        for _ in range(STEPS):
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


@app.get("/sequence/")
def sequence():
    with open(FILE_NAME) as f:
        return json.load(f)

@app.get("/sequence/{name}")
def sequence(name: str):
    with open(FILE_NAME, "r+") as f:
        data = json.load(f)
        f.seek(0)
        for instrument in INSTRUMENTS:
            if instrument not in data["assignments"].values():
                data["assignments"][name] = instrument
                json.dump(data, f)
                f.truncate()
                break
        return data

@app.post("/update-sequence")
def sequence(payload: dict = Body(...)):
    if payload:
        with open(FILE_NAME,'w') as f:
            data = json.dump(payload, f)
    return data

@app.post("/leave/{name}")
def leave(name: str):
    with open(FILE_NAME, "r+") as f:
        data = json.load(f)
        f.seek(0)
        if name in data["assignments"]:
            del data["assignments"][name]
        json.dump(data, f)
        f.truncate()
        return data
