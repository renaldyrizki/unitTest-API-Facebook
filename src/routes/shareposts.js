'use strict';
var express = require('express');
const app = express.Router();
require('dotenv').config();
var func = require('../function/function');
var graph = require('fbgraph');
graph.setVersion("3.1");
//GET

module.exports = app;


//get 10 newest feeds
app.get('/:obj/:access_token', async function(req, res) {
  	graph.setAccessToken(req.params.access_token);
	var url = req.params.obj + '/sharedposts?fields=id,created_time,from,description,caption,name,target,story,message,link,object_id,parent_id,place,picture,targeting,comments.summary(true),likes.summary(true)&limit=10';
	try{
		var data = await func.get_shareposts(url, req.params.obj, 10);
	}catch(err){
		var ret = {};
		ret.status = 0;
		console.log(err);
		res.json(ret);
	}
	res.json(data);
 });

app.get('/getall/:obj/:access_token', async function(req, res) {
  	graph.setAccessToken(req.params.access_token);
	var url = req.params.obj + '/sharedposts?fields=id,created_time,from,description,caption,name,target,story,message,link,object_id,parent_id,place,picture,targeting,comments.summary(true),likes.summary(true)&limit=100';
	try{
		var data = await func.get_shareposts(url, req.params.obj, null);
	}catch(err){
		var ret = {};
		ret.status = 0;
		console.log(err);
		res.json(ret);
	}
	res.json(data);
 });

app.get('/:obj/:limit/:access_token', async function(req, res) {
  	graph.setAccessToken(req.params.access_token);
	var url = req.params.obj + '/sharedposts?fields=id,created_time,from,description,caption,name,target,story,message,link,object_id,parent_id,place,picture,targeting,comments.summary(true),likes.summary(true)';
	url += '&limit='+req.params.limit;
	try{
		var data = await func.get_shareposts(url, req.params.obj, req.params.limit);
	}catch(err){
		var ret = {};
		ret.status = 0;
		console.log(err);
		res.json(ret);
	}
	res.json(data);
 });

app.get('/:obj/:limit/:statement/:cursors/:access_token', async function(req, res) {
  	graph.setAccessToken(req.params.access_token);
	var url = req.params.obj + '/sharedposts?fields=id,created_time,from,description,caption,name,target,story,message,link,object_id,parent_id,place,picture,targeting,comments.summary(true),likes.summary(true)';
	url += '&limit='+req.params.limit;
	url += '&'+req.params.statement+'='+req.params.cursors;
	try{
		var data = await func.get_shareposts(url, req.params.obj, req.params.limit);
	}catch(err){
		var ret = {};
		ret.status = 0;
		console.log(err);
		res.json(ret);
	}
	res.json(data);
 });
