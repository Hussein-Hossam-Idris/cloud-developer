import express, { Router, Request, Response } from 'express';
// import bodyParser from 'body-parser'; deprecated
const bodyParser = require('body-parser')

import { Car, cars as cars_list } from './cars';

(async () => {
  let cars: Car[] = cars_list;

  //Create an express application
  const app = express();
  //default port to listen
  const port = 8082;

  //use middleware so post bodies 
  //are accessable as req.body.{{variable}}
  app.use(bodyParser.json());
  app.use(express.urlencoded({ extended: true })) //for requests from forms-like data

  // Root URI call
  app.get("/", (req: Request, res: Response) => {
    res.status(200).send("Welcome to the Cloud!");
  });

  // Get a greeting to a specific person 
  // to demonstrate routing parameters
  // > try it {{host}}/persons/:the_name
  app.get("/persons/:name",
    (req: Request, res: Response) => {
      let { name } = req.params;

      if (!name) {
        return res.status(400)
          .send(`name is required`);
      }

      return res.status(200)
        .send(`Welcome to the Cloud, ${name}!`);
    });

  // Get a greeting to a specific person to demonstrate req.query
  // > try it {{host}}/persons?name=the_name
  app.get("/persons/", (req: Request, res: Response) => {
    let { name } = req.query;

    if (!name) {
      return res.status(400)
        .send(`name is required`);
    }

    return res.status(200)
      .send(`Welcome to the Cloud, ${name}!`);
  });

  // Post a greeting to a specific person
  // to demonstrate req.body
  // > try it by posting {"name": "the_name" } as 
  // an application/json body to {{host}}/persons
  app.post("/persons",
    async (req: Request, res: Response) => {

      const { name } = req.body;

      if (!name) {
        return res.status(400)
          .send(`name is required`);
      }

      return res.status(200)
        .send(`Welcome to the Cloud, ${name}!`);
    });

  // @TODO Add an endpoint to GET a list of cars
  // it should be filterable by make with a query paramater
  app.get("/cars",
    async (req: Request, res: Response) => {
      const { make } = req.query
      
      

      if (!make) {
        return res.status(200)
          .send(cars);

      } else {
        const new_list: Car[] = cars.filter((car) => {
          return car.make == make
        })

        if(new_list.length == 0){
          return res.status(404).send("No car with that make")
        }else{
          return res.status(200).send(new_list)
        }
      }
    });

  // @TODO Add an endpoint to get a specific car
  // it should require id
  // it should fail gracefully if no matching car is found
  app.get('/cars/:id',
    async (req: Request, res: Response) => {
      const {id} = req.params
      const id_int:number = +id 

      if(!id){
        return res.status(400).send("Id is requried")
      }

      const new_list = cars.filter((car)=>{
        return car.id == id_int
      })

      if (new_list.length == 0) {
          return res.status(404).send('this car id was not found')
      } else {
          return res.status(200).send(new_list)
      }
    }
  );

  /// @TODO Add an endpoint to post a new car to our list
  // it should require id, type, model, and cost
  app.post('/cars',async (req:Request, res: Response) => {
    const car:Car = req.body
    
    if(car.cost==null || car.id==null || car.model==null || car.type == null || car.make == null){
      return res.status(400).send("Please fill the following, car cost,id,make, type, model")
    }else{
      var new_car: Car = {
        make: car.make,
        id: car.id,
        model: car.model,
        cost: car.cost,
        type: car.type
      };
      cars.push(new_car)
      return res.status(201).send(`New Car added with the following cost = ${car.cost}, id = ${car.id}, make = ${car.make}, type = ${car.type}, model = ${car.model}`)
    }
    

  });

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
