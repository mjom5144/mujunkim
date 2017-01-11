// import modules
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mysql = require('mysql');

// create database
var connection = mysql.createConnection({
  host : '10.131.102.123',
  user : 'root',
  password : 'admin',
  port : '3306',
  database : 'LTESS'
});
connection.connect();
console.log("DB connected!");
// set models

// set views
app.set("view engine", "ejs");

// set middlewares
app.use(express.static(__dirname + '/public'));
app.use(bodyParser());

// testing
//Test start
app.get("/helloTest", function(req, res) {
  res.render("tests/helloTest", {name:"HTML"});
});
app.get("/helloTest/:nameParam", function(req, res) {
  res.render("tests/helloTest", {name:req.params.nameParam});
});

// set main routes
// 메인 화면 호출
app.get('/goMain', function(req,res){
  res.render("main");
});
// 시나리오 등록 페이지 호출
app.get("/reqScreen_RegTestScenario", function(req, res) {
  res.render("form_regTestScenario");
});
// 시나리오 등록
app.post("/req_regTestScenario", function(req, res){
  //console.log(req.body);
  // 삽입
  var isCritical;
  if(req.body.isCritical == 'on') isCritical = true;
  else isCritical = false;

  var setQuery = "INSERT INTO SCENARIO (ID, NAME, TYPE_CD, MB_CD, CORE, CREATE_ID, CREATE_DT, SUMMARY, PRECONDITIONING, WORKFLOW, HANDLE_ERR, ESTIMATED_TIME) VALUES (?, ?, ?, ?, ?, ?, NOW(), ?, ?, ?, ?, ?);";
  var params = [req.body.scenario_id, req.body.scenario_name, req.body.scenario_type, req.body.manage_type, isCritical, req.body.regMan, req.body.overview_scenario, req.body.requireFor_scenario, req.body.process_scenario, req.body.errors_scenario, req.body.expectedTime];

  connection.query(setQuery, params, function(err, result){
    if(err){
      console.log(err);
    } else{
      console.log("Insert Complete!");
    }
  });
  // 전체 목록 조회
  setQuery = "SELECT * FROM SCENARIO";
  connection.query(setQuery, function(err, rows, fields){
    if(err){
      console.log(err);
    } else{
      console.log('rows', rows[0].ID);
      //console.log('fields', fields);
      res.render("lists_testScenario", {data:rows});
    }
  });
  //res.redirect("/reqScreen_RegTestScenario");
});
// 테스트 결과 등록 페이지 호툴
app.get("/reqScreen_RegTestResult", function(req, res) {
  res.render("form_regTestResult");
});

// start server
app.listen(3000, function() {
  console.log('Server On !');
});
