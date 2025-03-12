# Xest Framework
![xest-logo](https://user-images.githubusercontent.com/1476886/147765281-e871657c-37a8-495d-b08b-c5dccf6334c3.png)


# To install globally 
`npm i xest -g`


# Quick Start
### After installing xest framework globally; you can create your api with one simple command

>     `xx <app-name-goes-here>`

The above command will create your new api project then install requied packages and start your database. 
Please note in the project directory you will find many usefull utils, packages and middlewares. 

You can start building your costum database architecturefrom `database-schema.sql`. Please remember to alter your `seed-schema.sql` accordingly to match with your database. This will automatically write your mock data into database in the following steps.

#### Now you are ready to start writing your endpoints.
Please note xest framework has already got a few endpoints prepared for you to get you going. just start looking for users in the route.js file and follow upto query to get the idea.


## Run the project. 
`xx run`

## Refresh your database & Run the project
`xx fresh`

# Using the xest CLI to build your endpoints
Xest framework gives you the flexibility to write your routes, controllers actions and query by using cli. 
It will aitomaticaly create the 

## Building your sql query 
Start building your queries by writing the following command in your cli and pick the required options. 

`xx new`

## Building database-schema seed queries 
Generate your mock data by writing the following command in your cli and pick the required options. 

`xx new` ->seed
