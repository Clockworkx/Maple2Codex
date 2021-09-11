require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const Person = require("./models/person");

app.use(cors());

app.use(express.json());

//app.use(express.static('build'))

morgan.token("postData", (req, res) => {
  if (req.method === "POST") return console.log(req.body);
});
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :postData"
  )
);

app.get("/", (request, response) => {
  response.send("<h1>Seite wäre hier</h1>");
});

app.get("/api/persons", (request, response) => {
  //read from xml....
  //return xml entry for item id
  Person.find({}).then((persons) => response.json(persons));
});

app.get("/info", (request, response) => {
  Person.find({})
    .then((persons) =>
      response.send(`Phonebook has entries for ${persons.length} people 
    <br> Time of request: ${new Date()}`)
    )
    .catch((error) => console.log(error));
});

app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id).then((person) => response.json(person));

  //else// response.status(404).end()
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const body = request.body;
  if (!body.name || !body.number)
    return response.status(400).json({
      error: "Number and or name of the person are missing",
    });

  // if (persons.some(person => person.name === body.name))
  // return response.status(400).json({
  //     error: "The name already exists in the phonebook"
  // })

  const person = new Person({ ...body });
  console.log("new person", person);

  person.save().then((savedPerson) => response.json(person));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}
