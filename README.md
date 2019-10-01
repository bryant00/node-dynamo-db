# DEV setup

### yarn

### download/extract latest dynamodb_local_latest into root

### cd dynamodb_local_latest
```
java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -sharedDb"
```
### yarn start
### create db
```
yarn create-db
```
### load seed data
```
yarn load-data
```

## Routes

### get /cars
```
http://localhost:3000/cars
```

### put /cars
```
http://localhost:3000/cars
```

### get /cars/id
```
http://localhost:3000/cars/1
```
