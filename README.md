# PetQuestServer

## Start the project to development
1. Clone the project
```bash
git clone https://github.com/DanyFC/PetQuestServer
```

2. Install the dependencies
```bash
pnpm install
```

3. Run the docker engine (you need to have it installed)

4. Run the command to raise the database
```bash
docker compose up -d
```

5. Change the name of the .env.template to .env and fill the variables

6. Run the project in dev mode
```bash
pnpm run start:dev
```

To interact with the API, you can use the requests in the folder `requests` or you can use a tool like Postman.

To see the documentation of the API, you can access it at http://localhost:3000/docs when the project is running in dev mode.