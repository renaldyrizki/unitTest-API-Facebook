'use strict';
var express = require('express');
const app = express.Router();
require('dotenv').config();
var func = require('../function/function');
var graph = require('fbgraph');
graph.setVersion("3.1");
//GET

module.exports = app;

app.get('/:access_token', async function(req, res) {
  	graph.setAccessToken(req.params.access_token);
	var url = "me/?fields=accounts{about,access_token,category,cover,display_subtext,emails,engagement,fan_count,general_info,id,impressum,is_owned,name,name_with_location_descriptor,new_like_count,phone,rating_count,start_info,username,website,description},id&limit=10";
	try{
		var data = await func.get_fplist(url);
	}catch(err){
		err.status = 0;
		// console.log(err);
		res.json(err);
	}
	res.json(data);
 });
