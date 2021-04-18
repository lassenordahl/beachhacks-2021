# BeachHacks Project

## Getting Started 


### Create Local Environment File

```
touch frontend/.env
```

Then paste the text below to set the route to point to the local API. In the react application you can access it as REACT_APP_API_URL when you're making API requests

```
API_URL=http://localhost:8000
# API_URL=
```

Use the empty API Url before you build the project to point it to the local API for deployment

### First Commands 

Run the commands below to initialize the API to build the frontend so the API can serve it

```
mkdir api/templates

cd frontend
npm install
npm run build
```