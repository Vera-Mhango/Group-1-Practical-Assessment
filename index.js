const fs = require("fs");
const path = require("path");

const productsFile = path.join(__dirname, "products.json");

function getProducts() {
  const data = fs.readFileSync(productsFile);
  return JSON.parse(data);
}

function saveProducts(products) {
  fs.writeFileSync(productsFile, JSON.stringify(products, null, 2));
}

const express = require("express");
const app = express();
const PORT = 5000;


app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("styles"));

app.get("/products", (req, res) => {
    const products = getProducts();
    res.render("products.ejs", { products });
  });

app.get("/newproducts", (req, res) => {
    res.render("newproducts.ejs");
});

app.get("/dashboard", (req, res) => {
    res.render("dashboard.ejs");
});

app.get("/login", (req, res) => {
    res.render("login.ejs");
});

app.get("/Home", (req, res) => {
    res.render("Home.ejs");
});

app.get("/homeadmin", (req, res) => {
    res.render("/homeadmin.ejs");
});  

app.use(express.urlencoded({ extended: true }));

app.post("/login", (req, res) => {
    const Admin = {
        username: "admin",
        password: "12345"
    }

    const Standard = {
        username: "standard",
        password: "12345"
    }

    const nope = "Incorrect username or password! Please try again"

    if (Admin.username === req.body.username && Admin.password === req.body.password) {
        res.render("homeadmin.ejs", { user: Admin.username });
    }
    
    else if (Standard.username === req.body.username && Standard.password === req.body.password) {
        res.render("Home.ejs", { user: Standard.username });
    }

    else {
        return res.render("login.ejs", { 
          nope: "Incorrect username or password! Please try again"
        });
      }
});

app.post("/products", (req, res) => {
  const products = getProducts();
  const newId = products.length > 0 ? products[products.length - 1].id + 1 : 1;

  const newProduct = {
    id: newId,
    name: req.body.name,
    category: req.body.category,
    quantity: parseInt(req.body.quantity),
    price: parseFloat(req.body.price)
  };

  products.push(newProduct);
  saveProducts(products);

  res.redirect("/products");
});

app.post("/products/delete/:id", (req, res) => {
    const products = getProducts();
    const idToDelete = parseInt(req.params.id);
    const updatedProducts = products.filter(product => product.id !== idToDelete);
    saveProducts(updatedProducts);
    res.redirect("/products");
  });

app.listen(PORT, () => {
    console.log("Server running ...")
}); 

//the edit feature isnt working but the delete feature is working fine.

//the charts are not working as well, but the data is being passed to the charts.