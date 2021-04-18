FROM nikolaik/python-nodejs:latest

WORKDIR /app
COPY . .

RUN cd frontend && npm install
RUN cd frontend && npm run build
RUN pip install -r requirements.txt

EXPOSE 80
CMD ["uvicorn", "api.main:app", "--host", "0.0.0.0", "--port", "80"]