import express from "express";
import bodyParser from "body-parser";


const app = express();
const port = 3000;
var todoList = [];
var workList = [];

var currentDate = new Date();



app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("index.ejs", personalData);
});

app.get("/work", (req, res) => {
    res.render("work.ejs", workData);
});

app.post("/", (req, res) => {
    var listItem = req.body.addListItem;
    todoList.push(listItem);
    res.render("index.ejs", personalData);
});

app.post("/work", (req, res) => {
    var listItem = req.body.addWorkListItem;
    workList.push(listItem);
    res.render("work.ejs", workData)
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

const monthList = ["January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"];
const dayList = ["Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thurdsday",
    "Friday",
    "Saturday"];

var personalData = {
    title: "Personal",
    todoList: todoList,
    month: monthList[currentDate.getMonth()],
    dayOfWeek: dayList[currentDate.getDay()],
    day: currentDate.getDate(),
    year: currentDate.getFullYear()
};

var workData = {
    title: "Work",
    todoList: workList,
    month: monthList[currentDate.getMonth()],
    dayOfWeek: dayList[currentDate.getDay()],
    day: currentDate.getDate(),
    year: currentDate.getFullYear()
};