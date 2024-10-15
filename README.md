# Drill And Practice

## Web application for repeated practice of learned content

### Prerequisites:

#### Docker and Docker Compose
* The app requires [docker](https://www.docker.com/get-started/)
 and [docker compose](https://docs.docker.com/compose/) 
to be installed.

### Application usage:
This Deno application can be used to create multiple-choice questions for a provided list of topics.
The questions can then be answered and thus used for repeated practice.

#### Some properties of the app:
* Only admins can create new topics.
* Only registered users can users can create questions and answers to those questions.
* Only registered users can start a quiz.
* Non-registered users can receive and answer a random question through api.

### Launching the application

Launching the application starts the Deno application, a PostgreSQL server and a database migration process (flyway).

#### To start the application:
1. Navigate to the folder containing the `docker-compose.yml` file.
2. Type `docker compose up`.
3. Access the application from browser: address: `localhost:7777`

#### To stop the application:
1. Press ctrl+c (or similar) in the same terminal where you started the application.
OR
2. Open a new terminal, navigate to the folder with the `docker-compose.yml` file 
and type `docker compose stop`.

#### Api usage example:
The application has an api that can be used without registering/logging in.

request a random question:
type `curl localhost:7777/api/questions/random`

server response:
`{"questionId":3,"questionText":"Who is the current president?","answerOptions":[{"id":5,"option_text":"Sauli Niinistö"},{"id":7,"option_text":"Tarja Halonen"},{"id":8,"option_text":"Mauno Koivisto"},{"id":6,"option_text":"Martti Ahtisaari"}]}`

Answer with a POST request and use the `questionId` and `answerOptions id`.
In this case:
`curl -X POST -d '{"questionId": 3,"optionId": 5}' localhost:7777/api/questions/answer`

server response:
`{"correct":true}`

### Database

When the database container `database-p2-8148f552-a160-4410-af87-07d05afc01dd` is running, you
can access the database from the terminal by typing:
docker exec -it database-p2-8148f552-a160-4410-af87-07d05afc01dd psql -U username database

This opens up `psql` console, where you can write SQL commands.

### Database migrations

When the application is started, SQL commands inside the `flyway/sql` -folder are executed.
The default SQL commands include for e.g creation of the required tables and adding an admin user to the database.
If you need to alter the database schema, you need to make a new file in the folder and restart the application.
One can also modify the existing file but then needs to clear the docker volumes with the command
`docker compose down -v`.

### Deno cache
The application uses the `drill-and-practice-cache`-folder for storing the application dependencies.
Clear this folder if you want to clear the cache.

### The project.env and test.env files
Database configurations for the application and test environments are stored in the .env files in
`Drill-and-practice/config/`-folder.

### Testing the application
The folder `e2e-playwright` provides a configuration for running some end-to-end tests. One can use a separate testing environment
 to ensure that the "production" database is not altered during testing.

Launching the tests:
1. Navigate to the folder containing the `docker-compose-test.yml`-file.
2. Type `docker compose -f docker-compose-test.yml run --entrypoint=npx  e2e-playwright playwright test && docker compose -f docker-compose-test.yml rm -sf`

The command builds a separate environment for testing and then removes the built containers. NOTE:
The removal only happens if the tests are successful.
