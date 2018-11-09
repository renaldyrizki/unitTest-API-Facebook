'use strict';
var express = require('express');
const app = express.Router();
require('dotenv').config();
const func = require('../function/function');
var graph = require('fbgraph');
graph.setVersion("3.1");


//get 10 newest feeds
app.get('/:access_token/', async function(req, res) {
	graph.setAccessToken(req.params.access_token);
	var url = 'me/feed?fields=caption,created_time,description,from,full_picture,message,name,object_id,picture,place,properties,shares,source,status_type,story,to{name,id},type,updated_time,attachments{description,media,target,title,type,url,description_tags},comments.summary(true),likes.summary(true)&limit=10';
	try{
		var data = await func.get_feed(url, 10);
	}catch(err){
		var ret = {};
		ret.status = 0;
		ret.type = err.type;
		ret.code = err.code;
		ret.message = err.message;
		res.json(ret);
	}
	res.json(data);
	// res.json(JSON.stringify(data, null, '\t'));
 });

//get all feeds
app.get('/getall/:access_token/', async function(req, res) {
  	graph.setAccessToken(req.params.access_token);
  	var url = 'me/feed?fields=caption,created_time,description,from,full_picture,message,name,object_id,picture,place,properties,shares,source,status_type,story,to{name,id},type,updated_time,attachments{description,media,target,title,type,url,description_tags},comments.summary(true),likes.summary(true)&limit=100';
  	try{
		var data = await func.get_feed(url, null);
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

//get n newest feeds
app.get('/:limit/:access_token/', async function(req, res) {
	graph.setAccessToken(req.params.access_token);
	var url = 'me/feed?fields=caption,created_time,description,from,full_picture,message,name,object_id,picture,place,properties,shares,source,status_type,story,to{name,id},type,updated_time,attachments{description,media,target,title,type,url,description_tags},comments.summary(true),likes.summary(true)&limit='+req.params.limit;
	try{
		var data = await func.get_feed(url, req.params.limit);
	}catch(err){
		var ret = {};
		ret.status = 0;
		ret.type = err.type;
		ret.code = err.code;
		ret.message = err.message;
		res.json(ret);
	}
	res.json(data);
 });

//get n to m feeds
app.get('/:limit/:statement/:cursors/:access_token', async function(req, res) {
  	graph.setAccessToken(req.params.access_token);
	var url = 'me/feed?fields=caption,created_time,description,from,full_picture,message,name,object_id,picture,place,properties,shares,source,status_type,story,to{name,id},type,updated_time,attachments{description,media,target,title,type,url,description_tags},comments.summary(true),likes.summary(true)';
	url += '&limit='+req.params.limit;
	url += '&'+req.params.statement+'='+req.params.cursors;
	try{
		var data = await func.get_feed(url, req.params.limit);
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

//get a post
app.get("/detail/:obj/:access_token/", async function(req, res) {
	graph.setAccessToken(req.params.access_token);
	var url = req.params.obj+'?fields=caption,created_time,description,from,full_picture,message,name,object_id,picture,place,properties,shares,source,status_type,story,to{name,id},type,updated_time,attachments{description,media,target,title,type,url,description_tags},comments.summary(true),likes.summary(true)';
	try{
		var data = await func.get_post(url);
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

app.post("/posting/:access_token/", async function(req, res) {
	graph.setAccessToken(req.params.access_token);
	// console.log(req.body);
	// res.json(req.body);
	var msg = {
  		message: req.body.msg,
	};
	var url = 'feed/';
	try{
		var data = await func.graph_post(url, msg);
		var url = data.id+'?fields=caption,created_time,description,from,full_picture,message,name,object_id,picture,place,properties,shares,source,status_type,story,to{name,id},type,updated_time,attachments{description,media,target,title,type,url,description_tags},comments.summary(true),likes.summary(true)';
		var data = await func.get_post(url);
	}catch(err){
		var ret = {};
		ret.status = err.code;
		ret.error_user_tittle = err.error_user_tittle;
		ret.error_user_msg = err.error_user_msg;
		console.log(err);
		res.json(ret);
	}
	res.json(data);
});

module.exports = app;