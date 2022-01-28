const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 5000;
const app = express();
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
app.use(cors());
app.use(express.json());
require("dotenv").config();

const uri = `mongodb+srv://recipeAdmin:J000tVks8WkgZpV8@cluster0.sg7vl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("recipeDB");
        const recipeCollection = database.collection("recipes");

        // POST API For Adding new recipe
        app.post("/addRecipe", async (req, res) => {
            const result = await recipeCollection.insertOne(req.body);
            res.json(result);
        });


        // GET API For all recipes
        app.get("/allRecipes", async (req, res) => {
            const result = await recipeCollection.find({}).toArray();
            res.send(result);
        });

        // GET API For single recipe 
        app.get("/recipe/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await recipeCollection.findOne(query);
            res.send(result);
        });


        // UPDATE - edit the recipe
        app.put("/recipe/:id", async (req, res) => {
            const id = req.params.id;
            const updatedRecipe = req.body;
            const filter = { _id: ObjectId(id) };
            const newRecipe = {
                $set: {
                    recipeName: updatedRecipe.recipeName,
                    ingredients: updatedRecipe.ingredients,
                    description: updatedRecipe.description,
                },
            };
            const result = await recipeCollection.updateOne(filter, newRecipe);
            res.json(result);
        });


        // DELETE API For single recipe
        app.delete("/recipe/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await recipeCollection.deleteOne(query);
            res.json(result);
        });



    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("Hello World! form recipe server");
});

app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`);
});