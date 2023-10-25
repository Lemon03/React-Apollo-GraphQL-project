import { find, remove } from 'lodash'

const peopleArray = [
    {
      id: '1',
      firstName: 'Bill',
      lastName: 'Gates'
    },
    {
      id: '2',
      firstName: 'Steve',
      lastName: 'Jobs'
    },
    {
      id: '3',
      firstName: 'Linux',
      lastName: 'Torvalds'
    }
]

const carsArray = [
    {
      id: '1',
      year: '2019',
      make: 'Toyota',
      model: 'Corolla',
      price: '40000',
      personId: '1'
    },
    {
      id: '2',
      year: '2018',
      make: 'Lexus',
      model: 'LX 600',
      price: '13000',
      personId: '1'
    },
    {
      id: '3',
      year: '2017',
      make: 'Honda',
      model: 'Civic',
      price: '20000',
      personId: '1'
    },
    {
      id: '4',
      year: '2019',
      make: 'Acura ',
      model: 'MDX',
      price: '60000',
      personId: '2'
    },
    {
      id: '5',
      year: '2018',
      make: 'Ford',
      model: 'Focus',
      price: '35000',
      personId: '2'
    },
    {
      id: '6',
      year: '2017',
      make: 'Honda',
      model: 'Pilot',
      price: '45000',
      personId: '2'
    },
    {
      id: '7',
      year: '2019',
      make: 'Volkswagen',
      model: 'Golf',
      price: '40000',
      personId: '3'
    },
    {
      id: '8',
      year: '2018',
      make: 'Kia',
      model: 'Sorento',
      price: '45000',
      personId: '3'
    },
    {
      id: '9',
      year: '2017',
      make: 'Volvo',
      model: 'XC40',
      price: '55000',
      personId: '3'
    }
]
  

const typeDefs = `
  type Person {
    id: String!
    firstName: String
    lastName: String
    cars: [Car]
  }

  type Car {
    id: String!
    year: Int  
    make: String
    model: String
    price: Float  
    personId: String
  }

  type Query {
    people: [Person]
    person(id: String!): Person
    cars: [Car]
    car(personId: String!): [Car]
  }

  type Mutation {
    addPerson(
        id: String!, 
        firstName: String!, 
        lastName: String!
    ): Person

    updatePerson(
        id: String!, 
        firstName: String, 
        lastName: String
    ): Person

    removePerson(id: String!): Person

    addCar(
        id: String!, 
        year: Int!, 
        make: String!, 
        model: String!, 
        price: Float!,
        personId: String!
    ): Car

    updateCar(
        id: String!, 
        year: Int, 
        make: String, 
        model: String,
        price: Float,
        personId: String
    ): Car

    removeCar(id: String!): Car
  }
`

const resolvers = {
    Query: {
      people: () => peopleArray,
      
      person: (root, args) => {
        const person = find(peopleArray, { id: args.id });
        if (person) {
          person.cars = carsArray.filter(car => car.personId === person.id); 
        }
        return person;
      },

      car: (root, args) => {
        return carsArray.filter(car => car.personId === args.personId);
      },      
    },

    Mutation: {
      addPerson: (root, args) => {
        const newPerson = {
          id: args.id,
          firstName: args.firstName,
          lastName: args.lastName
        }
  
        peopleArray.push(newPerson)
  
        return newPerson
      },

      updatePerson: (root, args) => {
        const updatePerson = find(peopleArray, { id: args.id })
  
        if (!updatePerson) {
          throw new Error(`No Person with id ${args.id}`)
        }
  
        if (args.firstName) {
            updatePerson.firstName = args.firstName;
        }
        
        if (args.lastName) {
            updatePerson.lastName = args.lastName;
        }        
  
        return updatePerson
      },

      removePerson: (root, args) => {
        const removedPerson = find(peopleArray, { id: args.id })
  
        if (!removedPerson) {
          throw new Error(`No Person with id ${args.id}`)
        }
  
        remove(peopleArray, c => {
          return c.id === removedPerson.id
        })
  
        return removedPerson
      },

      addCar: (root, args) => {
        const newCar = {
            id: args.id,
            year: args.year,
            make: args.make,
            model: args.model,
            price: args.price,
            personId: args.personId
        };

        carsArray.push(newCar);

        return newCar;
    },

    updateCar: (root, args) => {
        const carToUpdate = find(carsArray, { id: args.id });

        if (!carToUpdate) {
            throw new Error(`Couldn't find Car with id ${args.id}`);
        }

        if (args.year) carToUpdate.year = args.year;
        if (args.make) carToUpdate.make = args.make;
        if (args.model) carToUpdate.model = args.model;
        if (args.price) carToUpdate.price = args.price;
        if (args.personId) carToUpdate.personId = args.personId;

        return carToUpdate;
    },

    removeCar: (root, args) => {
        const carToRemove = find(carsArray, { id: args.id });

        if (!carToRemove) {
            throw new Error(`Couldn't find Car with id ${args.id}`);
        }

        remove(carsArray, c => {
            return c.id === carToRemove.id;
        });

        return carToRemove;
    }
    }
}

export { typeDefs, resolvers }
  