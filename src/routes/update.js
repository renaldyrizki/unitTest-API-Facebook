'use strict';
require('dotenv').config();
var express = require('express');
const app = express.Router();
var func = require('../function/function');
var graph = require('fbgraph');
graph.setVersion("3.1");
//GET

module.exports = app;

//Update
app.post("/:obj/:access_token", async function(req, response) {
	graph.setAccessToken(req.params.access_token);
	var msg = {
  		message: req.body.msg
	};
	try{
		data = await func.graph_post(req.params.obj, msg);
	}catch(err){
		var ret = {};
		ret.status = 0;
		ret.type = err.type;
		ret.code = err.code;
		ret.message = err.message;
		console.log(err);
		res.json(ret);
	}

	res.json(data);		
});