//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const _ = require("lodash");
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true});

const itemsSchema = {
  name: String
};

const Item = mongoose.model("Item",itemsSchema);

const item1 = new Item({
  name: "Welcome to your To-Do List"
});

const item2 = new Item({
  name: "Hit the + button to add a new item."
});

const item3 = new Item({
  name: "<-- Hit this to delete an item."
});

const defaultItems = [item1, item2, item3]

const listSchema = {
  name: String,
  items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);

app.get("/", function(req, res) {
  Item.find({})
    .then((itemsFound) => {
      if (itemsFound.length === 0) {
        Item.insertMany(defaultItems)
          .then(() => {
            console.log("Successfully saved into our DB");
          })
          .catch((err) => {
            console.log(err);
          });
          res.redirect("/");
      } else {
      res.render("list", {listTitle: "Today", newListItems: itemsFound});
}})
    .catch((err)=>{
      console.log(err);
    });
});

app.post("/", function(req, res){
  const itemName = req.body.newItem;
  const listName = req.body.list
  console.log(listName);
  const item = new Item ({
    name: itemName
  });

  if (listName === "Today") {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({name: _.lowerCase(listName)})
      .then((foundList) => {
        foundList.items.push(item);
        foundList.save();
        res.redirect("/"+_.lowerCase(listName));
      })
      .catch((err) => {
        console.log(err)
      });
  };
});

app.post("/delete", function (req, res) {
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;
    console.log(checkedItemId," ",listName)
 
    if (listName === "Today") {
        Item.findOneAndDelete({ _id: checkedItemId })
            .then(function () {
                console.log("Successfully deleted checked item.");
                res.redirect("/");
            })
            .catch(function (err) {
                console.log(err);
            });
    } else {
        List.updateOne(
            { name: _.lowerCase(listName) },
            { $pull: { items: { _id: checkedItemId } } }
        )
            .then(function () {
                res.redirect("/" + listName);
            })
            .catch(function (err) {
                console.log(err);
            });
    }
});

app.get("/:listType", (req, res) => {
  const requestedList = _.lowerCase(req.params.listType);
  List.findOne({name: requestedList})
    .then((foundList)=>{
      if(!foundList) {
        const list = new List({
          name: requestedList,
          items: defaultItems
        });
        list.save();
        res.redirect("/"+requestedList)
      } else {
        res.render("list",{listTitle: _.capitalize(foundList.name), newListItems:foundList.items});
      }
    })
    .catch((err) => {
      console.log(err)
    });


})

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
