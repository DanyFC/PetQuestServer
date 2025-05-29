# PetQuestServer

## Start the project to development
1. Clone the project
```bash
git clone https://github.com/DanyFC/PetQuestServer
```

3. Install the dependencies
```bash
pnpm install
```

3. Run the docker engine (you need to have it installed)

3. Run the command to raise the database
```bash
docker compose up -d
```

4. Change the name of the .env.template to .env and fill the variables

4. Run the project in dev mode
```bash
pnpm run start:dev
```