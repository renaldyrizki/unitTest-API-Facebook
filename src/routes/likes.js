'use strict';
var express = require('express');
const app = express.Router();
require('dotenv').config();
var func = require('../function/function');
var graph = require('fbgraph');
graph.setVersion("3.1");
//GET

//get 10 newest feeds
app.get('/fanspage-likes/:obj/:type/:access_token', async function(req, res) {
  	graph.setAccessToken(req.params.access_token);
	var url = req.params.obj + '/likes?fields=id,link,name,pic,pic_large,pic_square,profile_type,username&summary=1&limit=10';
	try{
		var data = await func.get_likes(url, req.params.obj, req.params.type,10);
	}catch(err){
		var ret = {};
		ret.status = 0;
		console.log(err);
		res.json(ret);
	}
	res.json(data);
 });

app.get('/fanspage-likes/getall/:obj/:type/:access_token', async function(req, res) {
  	graph.setAccessToken(req.params.access_token);
	var url = req.params.obj + '/likes?fields=id,link,name,pic,pic_large,pic_square,profile_type,username&summary=1&limit=100';
	try{
		var data = await func.get_likes(url, req.params.obj, req.params.type, null);
	}catch(err){
		var ret = {};
		ret.status = 0;
		console.log(err);
		res.json(ret);
	}
	res.json(data);
 });

app.get('/fanspage-likes/:obj/:type/:limit/:access_token', async function(req, res) {
  	graph.setAccessToken(req.params.access_token);
	var url = req.params.obj + '/likes?fields=id,link,name,pic,pic_large,pic_square,profile_type,username&summary=1';
	url += '&limit='+req.params.limit;
	try{
		var data = await func.get_likes(url, req.params.obj, req.params.type, req.params.limit);
	}catch(err){
		var ret = {};
		ret.status = 0;
		console.log(err);
		res.json(ret);
	}
	res.json(data);
 });

app.get('/fanspage-likes/:obj/:type/:limit/:statement/:cursors/:access_token', async function(req, res) {
  	graph.setAccessToken(req.params.access_token);
	var url = req.params.obj + '/likes?fields=id,link,name,pic,pic_large,pic_square,profile_type,username&summary=1';
	url += '&limit='+req.params.limit;
	url += '&'+req.params.statement+'='+req.params.cursors;
	try{
		var data = await func.get_likes(url, req.params.obj, req.params.type, req.params.limit);
	}catch(err){
		var ret = {};
		ret.status = 0;
		console.log(err);
		res.json(ret);
	}
	res.json(data);
 });

app.post("/fanspage-like/obj=:obj/token=:access_token/", async function(req, response) {
	// token who will like
	graph.setAccessToken(req.params.access_token);
	var obj = req.params.obj;
	var url = obj + '/likes/';
	try{
		data = await func.graph_post_likes(url);
	}catch(err){
		var ret = {};
		ret.status = 0;
		console.log(err);
		res.json(ret);	
	}
	res.json(data);	
});

module.exports = app;

