const express = require("express");
const mongoose = require('mongoose');
const Food = require('./food');
require('dotenv/config');


const app = express();

// Middleware para processar JSON e dados de formulário
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Rotas
app.get("/", (req,res)=>{
		res.send("Home Page");
});

// Listar todos os alimentos
app.get("/api/foods", async (req, res) => {
    try {
        const foods = await Food.find();
        res.json(foods);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Buscar um alimento específico pelo ID
app.get("/api/foods/:id", async (req, res) => {
    try {
        const food = await Food.findById(req.params.id);
        if (food == null) {
            return res.status(404).json({ message: "Food not found" });
        }
        res.json(food);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Criar um novo alimento
app.post("/api/foods", async (req, res) => {
    const food = new Food({
        name: req.body.name,
        category: req.body.category,
        quantity: req.body.quantity,
        expirationDate: req.body.expirationDate,
        price: req.body.price
    });
    try {
        const newFood = await food.save();
        res.status(201).json(newFood);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Atualizar um alimento existente pelo ID
app.put("/api/foods/:id", async (req, res) => {
    try {
        const updatedFood = await Food.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (updatedFood == null) {
            return res.status(404).json({ message: "Food not found" });
        }
        res.json(updatedFood);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Excluir um alimento pelo ID
app.delete("/api/foods/:id", async (req, res) => {
    try {
        const deletedFood = await Food.findByIdAndDelete(req.params.id);
        if (deletedFood == null) {
            return res.status(404).json({ message: "Food not found" });
        }
        res.json(deletedFood);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));


//Servidor
app.listen(3003, ()=>{console.log("Server is running")});