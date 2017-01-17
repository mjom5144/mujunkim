// import modules
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mysql = require('mysql');
var methodOverride = require('method-override');

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
app.use(methodOverride("_method"));

// set main routes
// 메인 화면 호출
app.get('/main', function(req,res){
  res.render("main/mainView");
});
// 시나리오 목록
app.get("/scenarios/manage", function(req, res){
  // 전체 목록 조회
  var setQuery = "SELECT * FROM SCENARIO";
  connection.query(setQuery, function(err, rows, fields){
    if(err){
      console.log(err);
    } else{
      console.log("Find scenario lists succeeded!");
      console.log(rows);
      //res.render("scenarios/grid_scenario", {data:rows});

      var str = JSON.stringify(rows);
      console.log("JSON: " + str);
      res.JSON
    }
  });
});
// 시나리오 등록 페이지 호출
app.get("/scenarios/manage/register", function(req, res) {
  res.render("scenarios/form_registerScenario");
});
// 시나리오 등록
app.post("/scenarios/manage/register", function(req, res){
  console.log(req.body);
  // DB 삽입
  var setQuery = "INSERT INTO SCENARIO (ID, NAME, TYPE_CD, CREATE_ID, CREATE_DT, DEVELOPER_ID, SUMMARY, PRECONDITIONING, WORKFLOW) VALUES (?, ?, ?, ?, CURDATE(),? ,? ,? ,?)";
  var params = [req.body.id_scenario, req.body.name_scenario, req.body.type_scenario, req.body.writer, req.body.developer, req.body.overview_scenario, req.body.precondition_scenario, req.body.contents_scenario];
  connection.query(setQuery, params, function(err, result){
    if(err){
      console.log(err);
    } else{
      console.log("Insert Complete!");
      res.redirect("/scenarios/manage/detail/" + req.body.id_scenario);
    }
  });
});
// 시나리오 상세
app.get("/scenarios/manage/detail/:id", function(req, res){
  // DB 탐색
  var setQuery = "SELECT * FROM SCENARIO WHERE ID = '" + req.params.id + "';";
  console.log(setQuery);

  connection.query(setQuery, function(err, rows){
    if(err){
      console.log(err);
    } else{
      console.log("Search for detail Complete!");
      res.render("scenarios/detail_scenario", {data:rows[0]});
    }
  });
});
// 시나리오 수정 페이지 호출
app.get("/scenarios/manage/detail/:id/edit", function(req, res){
  var setQuery = "SELECT * FROM SCENARIO WHERE ID = '" + req.params.id + "';";

  connection.query(setQuery, function(err, rows){
    if(err){
      console.log(err);
    } else{
      console.log("Search for modify Complete!");
      res.render("scenarios/form_editScenario", {data:rows[0]});
    }
  });
});
// 시나리오 수정 내용 갱신
app.put("/scenarios/manage/detail/:id/edit", function(req, res){
  console.log("id: " + req.params.id);
  console.log("body: " + req.body);
  // DB
  var setQuery = "UPDATE  SCENARIO SET NAME=?, TYPE_CD=?, CREATE_ID=?, DEVELOPER_ID=?, SUMMARY=?, PRECONDITIONING=?, WORKFLOW=? WHERE ID = ?;";
  var params = [req.body.name_scenario, req.body.type_scenario, req.body.writer, req.body.developer, req.body.overview_scenario, req.body.precondition_scenario, req.body.contents_scenario, req.params.id];
  // 삽입 진행
  connection.query(setQuery, params, function(err, result){
    if(err){
      console.log(err);
    } else{
      console.log("Update Complete!");
    }
  });
  res.redirect("/scenarios/manage/detail/" + req.params.id);
});
//------------------------------------------------------------------------------01/13
// 차수 목록
app.get("/degrees/manage", function(req, res){
  res.render("degrees/list_degree");
});

// 차수 등록 페이지 호출
app.get("/degrees/manage/register", function(req, res){
  res.render("degrees/form_registerDegree");
});

// 차수 등록
app.post("/degrees/manage/register", function(req, res){
  console.log(req.body);

  var setQuery = "INSERT INTO DEGREE (DE_NM, DE_SD, DE_ED, DESCRIPTION, CREATE_ID, CREATE_DT) VALUES (?, ?, ?, ?, 'ADMIN', CURDATE());";
  var params = [req.body.name_degree, req.body.date_start, req.body.date_end, req.body.description_degree];
  connection.query(setQuery, params, function(err, result){
    if(err){
      console.log(err);
    } else{
      console.log("Insert Complete!");
      res.redirect("/degrees/manage/detail/" + req.body.name_degree);
    }
  });
});

// 차수 상세
app.get("/degrees/manage/detail/:id", function(req, res){
  // DB 탐색
  var setQuery = "SELECT * FROM DEGREE WHERE DE_NM = '" + req.params.id + "';";
  console.log(setQuery);

  connection.query(setQuery, function(err, rows){
    if(err){
      console.log(err);
    } else{
      console.log("Search for detail Complete!");
      res.render("degrees/detail_degree", {data:rows[0]});
    }
  });
});

// 차수 수정 페이지 호출
app.get("/degrees/manage/detail/:id/edit", function(req, res){
  var setQuery = "SELECT * FROM DEGREE WHERE DE_NM = '" + req.params.id + "';";

  connection.query(setQuery, function(err, rows){
    if(err){
      console.log(err);
    } else{
      console.log("Search for modify Complete!");
      res.render("degrees/form_editDegree", {data:rows[0]});
    }
  });
});
// 차수 수정 내용 갱신
app.put("/degrees/manage/detail/:id/edit", function(req, res){
  console.log("id: " + req.params.id);
  console.log("body: " + req.body);
  // DB
  var setQuery = "UPDATE  SCENARIO SET NAME=?, TYPE_CD=?, CREATE_ID=?, DEVELOPER_ID=?, SUMMARY=?, PRECONDITIONING=?, WORKFLOW=? WHERE ID = ?;";
  var params = [req.body.name_scenario, req.body.type_scenario, req.body.writer, req.body.developer, req.body.overview_scenario, req.body.precondition_scenario, req.body.contents_scenario, req.params.id];
  // 삽입 진행
  connection.query(setQuery, params, function(err, result){
    if(err){
      console.log(err);
    } else{
      console.log("Update Complete!");
    }
  });
  res.redirect("/degrees/manage/detail/" + req.params.id);
});

//------------------------------------------------------------------------------
// 테스트 결과 등록 페이지 호툴
app.get("/results/manage/register/:id/:num", function(req, res) {
  var setQuery = " SELECT	A.ID,	A.NAME, A.TYPE_CD, A.DEVELOPER_ID, A.TESTER_ID,	B.DE_NM, B.DE_SD,	B.DE_ED,	A.TEST_YN, A.TEST_RESULT,	A.CREATOR_DT,	A.DEFECT_CONTENT	FROM  (SELECT S.ID, S.NAME, S.TYPE_CD, S.DEVELOPER_ID, R.TESTER_ID, R.DE_NM, R.TEST_YN, R.TEST_RESULT, R.CREATOR_DT, R.DEFECT_CONTENT, R.USE_YN FROM SCENARIO S JOIN RESULT R  ON S.ID = R.ID AND R.USE_YN = 1) A JOIN DEGREE B ON A.DE_NM = B.DE_NM WHERE	A.ID = ? AND B.DE_NM = ?;";
  var params = [req.params.id, req.params.num];
  connection.query(setQuery, params, function(err, rows){
    if(err){
      console.log(err);
    } else{
      console.log(rows[0]);
      res.render("results/form_registerResult", {data:rows[0]});
    }
  });
});

// 테스트 결과 등록
app.put("/results/manage/register/:id/:num", function(req,res){
  console.log(req.body);
  var setQuery = "UPDATE RESULT SET TESTER_ID = ?, TEST_YN = ?, TEST_RESULT = ?, DEFECT_CONTENT = ?, CREATOR_DT = CURDATE() WHERE ID = ? AND DE_NM = ?;";
  var params = [req.body.tester, req.body.isTested, req.body.result, req.body.defectsDetail, req.params.id, req.params.num];
  connection.query(setQuery, params, function(err, result){
    if(err){
      console.log(err);
    } else{
      console.log("Update Complete!");
      // 목록으로
      // res.redirect("/results/manage/register/" + req.params.id + "/" + req.params.num);
    }
  });
});

// start server
app.listen(3000, function() {
  console.log('Server On!');
});
