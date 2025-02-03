## Run application

```
docker-compose up --build
```

## Run only specific container in Docker:

```
docker-compose up -d <container>
```

E.g.

```
docker-compose up -d postgres
```

## Run application using Docker:

```
docker-compose down
```

```
docker-compose build && docker-compose up
```

## Create database migration:

```
npm run migrate:generate
```

## Run migrations:

```
npm run migrate:run
```

## Seed database

```
Create migration with INSERT query
```
