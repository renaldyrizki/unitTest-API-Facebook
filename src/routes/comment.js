'use strict';
var express = require('express');
const app = express.Router();
require('dotenv').config();
var func = require('../function/function');
var graph = require('fbgraph');
graph.setVersion("3.1");

//get 10 newest feeds
app.get('/:obj/:type/:access_token/', async function(req, res) {
  	graph.setAccessToken(req.params.access_token);
	var url = req.params.obj + '/comments?fields=message,can_remove,created_time,from,comment_count,like_count,attachment{description,media,target,title,type,url}&filter=toplevel&summary=1&limit=10';
  	try{
		var data = await func.get_comments(url, req.params.obj, req.params.type, 10);
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

//get all feeds
app.get('/getall/:obj/:type/:access_token/', async function(req, res) {
  	graph.setAccessToken(req.params.access_token);
  	var url = req.params.obj + '/comments?fields=message,can_remove,created_time,from,comment_count,like_count,attachment{description,media,target,title,type,url}&filter=toplevel&summary=1&limit=100';
  	try{
		var data = await func.get_comments(url, req.params.obj, req.params.type, null);
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

//get n newest comment
app.get('/:obj/:type/:limit/:access_token/', async function(req, res) {
  	graph.setAccessToken(req.params.access_token);
  	var url = req.params.obj + '/comments?fields=message,can_remove,created_time,from,comment_count,like_count,attachment{description,media,target,title,type,url}&filter=toplevel&summary=1';
  	url += '&limit='+req.params.limit;
  	try{
		var data = await func.get_comments(url, req.params.obj, req.params.type, req.params.limit);
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

//get n to m comment
app.get('/:obj/:type/:limit/:statement/:cursors/:access_token/', async function(req, res) {
  	graph.setAccessToken(req.params.access_token);
  	var url = req.params.obj + '/comments?fields=message,can_remove,created_time,from,comment_count,like_count,attachment{description,media,target,title,type,url}&filter=toplevel&summary=1';
  	url += '&limit='+req.params.limit;
	url += '&'+req.params.statement+'='+req.params.cursors;
  	try{
		var data = await func.get_comments(url, req.params.obj, req.params.type, req.params.limit);
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

app.post("/comment/:obj/:access_token/", async function(req, res) {
	// token who will comment
	// var access_token = req.params.access_token;
	graph.setAccessToken(req.params.access_token);
	var obj = req.params.obj;
	// var msg = req.params.msg
	console.log(req.body);
	var msg = {
  		message: req.body.msg
	};
	var url = obj + '/comments/';
	try{
		var data = await func.graph_post(url, msg);
	}catch(err){
		var ret = {};
		ret.status = 0;
		console.log(err);
		res.json(ret);
	}
	res.json(data);	
});

module.exports = app;