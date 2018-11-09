var app_name = "Facebook Sync";
var app_port = "1234";
var express = require("express");
var request = require("request");
var app = express();

var mysql = require('mysql');
var MySQLdb = mysql.createConnection({
  host     : 'localhost',
  port 	   : '3306',
  user     : 'root',
  password : '',
  database : 'facebook',
});
MySQLdb.connect();

var graph = require('fbgraph');
graph.setVersion("3.1");


function get_fplist(url){
	return new Promise(async function(resolve, reject){
		var datafb = {};
	  	var data_arr = {};
	  	var data_post = [];
	  	var database = [];
		var ctr = 0;
		var data_length = 0;
		while(true){
			try{
				if(ctr == 0){
					var data = await graph_get(url);
				}else{
					var data = await graph_get(url2);
				}
			}catch(err){
				var ret = {};
				ret.status = 0;
				ret.type = err.type;
				ret.code = err.code;
				ret.message = err.message;
				console.log(err);
				// res.json(ret);
				return reject(ret);
			}

			for(i=0;i<data.accounts.data.length;i++){
				data_arr[i] = data.accounts.data[i];
				data_post = [];
				data_post.push(data.accounts.data[i].id);
				data_post.push(data.accounts.data[i].about);
				data_post.push(data.accounts.data[i].category);
				if (data.accounts.data[i].cover) {
					data_post.push(data.accounts.data[i].cover.source);
				}else{
					data_post.push(null);
				}
				data_post.push(data.accounts.data[i].display_subtext);
				data_post.push(data.accounts.data[i].description);
				data_post.push(data.accounts.data[i].emails);
				data_post.push(data.accounts.data[i].engagement.count);
				data_post.push(data.accounts.data[i].fan_count);
				data_post.push(data.accounts.data[i].general_info);
				data_post.push(data.accounts.data[i].impressum);
				data_post.push(data.accounts.data[i].is_owned);
				data_post.push(data.accounts.data[i].name);
				data_post.push(data.accounts.data[i].name_with_location_descriptor);
				data_post.push(data.accounts.data[i].new_like_count);
				data_post.push(data.accounts.data[i].phone);
				data_post.push(data.accounts.data[i].rating_count);
				if(data.accounts.data[i].start_info){
					data_post.push(data.accounts.data[i].start_info.type);
					var date = '';
					var acc_date = data.accounts.data[i].start_info.date;
					if (acc_date){
						if (acc_date['year']) {
							date += acc_date['year'] + '/';
						}else{
							date += '0001/';
						}
						if (acc_date['month']) {
							date += acc_date['month'] + '/';
						}else{
							date += '1/';
						}
						if (acc_date['day']) {
							date += acc_date['day'];
						}else{
							date += '1';
						}
						data_post.push(date);
					}else{
						data_post.push(null);
					}
				} else {
					data_post.push(null);
					data_post.push(null);
				}
				data_post.push(data.accounts.data[i].username);
				data_post.push(data.id);
				data_post.push(data.accounts.data[i].website);
				var event1 = new Date();
				data_post.push(event1.getFullYear()+"/"+(event1.getMonth()+1)+"/"+event1.getDate()+" "+event1.getHours()+":"+event1.getMinutes()+":"+event1.getSeconds());			
				database.push(data_post);
			}

			data_length += data.accounts.data.length;
			if (data.accounts.paging) {
				if(typeof data.accounts.paging.next == 'undefined'){
					break;
				}else{
					var next = data.accounts.paging.cursors.after;
					url2 = url + "&after="+next;
				}
			} else{
				break;
			}

			ctr++;
		}
		datafb['data'] = data_arr;
		datafb['length'] = data_length;
		if (data_length > 0) {
			var query = 'INSERT INTO pages (ID_PAGE,ABOUT,CATEGORY,COVER,DISPLAY_SUBTEXT,DESCRIPTION,EMAILS,ENGAGEMENT,FAN_COUNT,GENERAL_INFO,IMPRESSIUM,IS_OWNED,NAME,NAME_WITH_LOCATION_DETECTOR,NEW_LIKE_COUNT,PHONE,RATING_COUNT,START_INFO_TYPE,START_INFO_DATE,USERNAME,USER_ID,WEBSITE,LAST_UPDATE) VALUES ? ON DUPLICATE KEY UPDATE ID_PAGE=VALUES(ID_PAGE)';
			var wkw = MySQLdb.query(query,[database], function (error, results, fields) {
			if (error) throw error;
				console.log('yeay berhasil');
			});
		}
		resolve(datafb);
	});
}

function get_comments(url, obj, type, limit){
	// console.log(datafb);
	return new Promise(async function(resolve, reject){
		var datafb = {};
	  	var data_arr = [];
	  	var data_post = [];
	  	var data_attch = [];
	  	var database = [];
	  	var database_attch = [];
		var ctr = 0;
		var data_length = 0;
		while(true){
			try{
				if(ctr == 0){
					var data = await graph_get(url);
				}else{
					var data = await graph_get(url2);
				}
			}catch(err){
				var ret = {};
				ret.status = 0;
				// console.log(err);
				// res.json(ret);
				return reject(ret);
			}
			for(i=0;i<data.data.length;i++){
				data_post = [];
				data_attch = [];
				data_post.push(data.data[i].id);
				if (type == 'comment') {
					data_post.push(obj);
				}else{
					data_post.push(null);
				}
				if (type == 'attachment') {
					data_post.push(obj);
				}else{
					data_post.push(null);
				}
				if (type == 'post') {
					data_post.push(obj);
				}else{
					data_post.push(null);
				}
				data_post.push(data.data[i].can_remove);
				var event1 = new Date(data.data[i].created_time);
				data.data[i].created_time = event1.getFullYear()+"/"+(event1.getMonth()+1)+"/"+event1.getDate()+" "+event1.getHours()+":"+event1.getMinutes()+":"+event1.getSeconds();
				data_post.push(data.data[i].created_time);
				if(data.data[i].from){
					data_post.push(data.data[i].from.id);
					data_post.push(data.data[i].from.name);
				} else {
					data_post.push(null);
					data_post.push(null);
				}
				data_post.push(data.data[i].message);
				data_post.push(data.data[i].comment_count);
				data_post.push(data.data[i].like_count);
				var event1 = new Date();
				data_post.push(event1.getFullYear()+"/"+(event1.getMonth()+1)+"/"+event1.getDate()+" "+event1.getHours()+":"+event1.getMinutes()+":"+event1.getSeconds());
				database.push(data_post);
				data_arr[i] = data.data[i];
				if (data.data[i].type=='photo' || data.data[i].type == 'video') {
					data_attch.push(data.data[i].object_id);
					data_attch.push(data.data[i].attachments.data[0].target.id);
					data_attch.push(data.data[i].attachments.data[0].description);
					data_attch.push(data.data[i].attachments.data[0].target.url);
					data_attch.push(data.data[i].attachments.data[0].title);
					data_attch.push(data.data[i].attachments.data[0].type);
					data_attch.push(data.data[i].attachments.data[0].url);
					data_attch.push(data.data[i].attachments.data[0].media.image.src);
					database_attch.push(data_attch);
				}
			}
			data_length += data.data.length;
			if (data.paging) {
				if(typeof data.paging.next == 'undefined' || limit != null){
					// console.log("aaawwww");
					if(typeof data.paging.next == 'undefined'){
						datafb['next'] = '';
				  	}else{
				  		datafb['next'] = data.paging.cursors.after;
				  	}
				  	if(typeof data.paging.previous == 'undefined'){
				  		datafb['previous'] = '';
				  	}else{
				  		datafb['previous'] = data.paging.cursors.before;
				  	}
					break;
				}else{
					var next = data.paging.cursors.after;
					url2 = url + "&after="+next;
				}
			} else{
				break;
			}
			ctr++;
		}
		datafb['data'] = data_arr;
		datafb['length'] = data_length;
		console.log(data_length);
		if (data_length > 0 ) {
			var query = 'INSERT INTO comments (ID_COMMENT,ID_COM_COMMENT, ID_ATTACHMENT, ID_POST,CAN_REMOVE,CREATED_TIME,FROM_ID,FROM_NAME,MESSAGE,TOTAL_COMMENT,TOTAL_LIKE,UPDATE_TIME) VALUES ? ON DUPLICATE KEY UPDATE ID_COMMENT=VALUES(ID_COMMENT), MESSAGE=VALUES(MESSAGE), TOTAL_LIKE = VALUES(TOTAL_LIKE),TOTAL_COMMENT= VALUES(TOTAL_COMMENT),UPDATE_TIME= VALUES(UPDATE_TIME)';
			var wkw = MySQLdb.query(query,[database], function (error, results, fields) {
			if (error) return reject(error);
				// console.log('yeay berhasil');
			});
			if (database_attch.length > 0) {
				console.log('HAHHAHAHHAHAHAHHAHAHHAHAHHAHAHAHAHAH');
				var query_attch = 'INSERT IGNORE INTO attachments (ID_ATTACHMENT,ID_COMMENT,DESCRIPTION_ATTACHMENT,TARGET,TITTLE,TYPE_ATTACHMENT,URL,MEDIA) VALUES ?';
				var wkw = MySQLdb.query(query_attch,[database_attch], function (error, results, fields) {
				if (error) return reject(error);
					// console.log('yeay okee');
				});
			}
		}
		resolve(datafb);
	});
}

function get_feed(url, limit){
	// console.log(datafb);
	return new Promise(async function(resolve, reject){
		var datafb = {};
	  	var data_arr = [];
	  	var data_post = [];
	  	var data_attch = [];
	  	var database = [];
	  	var database_attch = [];
		var ctr = 0;
		var data_length = 0;
		while(true){
			try{
				if(ctr == 0){
					var data = await graph_get(url);
				}else{
					var data = await graph_get(url2);
				}
			}catch(err){
				var ret = {};
				ret.status = 0;
				ret.type = err.type;
				ret.code = err.code;
				ret.message = err.message;
				console.log('hai');
				return reject(ret);
			}

			for(i=0;i< data.data.length;i++){
				data_attch = [];
				data_post = [];
				data_post.push(data.data[i].id);
	    		var hai = data.data[i].id.split("_");
	    		data_post.push(hai[0]);
				if (data.data[i].caption) {
					data_post.push(data.data[i].caption);
				}else{
					data_post.push(null);
				}
				console.log(data.data[i].created_time);
				var event1 = new Date(data.data[i].created_time);
				data.data[i].created_time = event1.getFullYear()+"/"+(event1.getMonth()+1)+"/"+event1.getDate()+" "+event1.getHours()+":"+event1.getMinutes()+":"+event1.getSeconds();
				data_post.push(data.data[i].created_time);
				console.log(data.data[i].created_time);
				console.log('======================================');
				// console.log(event1.getFullYear()+"/"+(event1.getMonth()+1)+"/"+event1.getDate());
				if (data.data[i].description) {
					data_post.push(data.data[i].description);
				}else{
					data_post.push(null);
				}
				if(data.data[i].from){
					data_post.push(data.data[i].from.id);
					data_post.push(data.data[i].from.name);
				} else {
					data_post.push(null);
					data_post.push(null);
				}
				if (data.data[i].full_picture) {
					data_post.push(data.data[i].full_picture);
				}else{
					data_post.push(null);
				}
				data_post.push(data.data[i].message);
				if (data.data[i].name) {
					data_post.push(data.data[i].name);
				}else{
					data_post.push(null);
				}
				if (data.data[i].object_id) {
					data_post.push(data.data[i].object_id);
				}else{
					data_post.push(null);
				}
				if (data.data[i].picture) {
					data_post.push(data.data[i].picture);
				}else{
					data_post.push(null);
				}
				if(data.data[i].place){
					data_post.push(data.data[i].place.name);
					data_post.push(data.data[i].place.id);
				} else {
					data_post.push(null);
					data_post.push(null);
				}
				if (data.data[i].source) {
					data_post.push(data.data[i].source);
				}else{
					data_post.push(null);
				}
				data_post.push(data.data[i].status_type);
				if (data.data[i].story) {
					data_post.push(data.data[i].story);
				}else{
					data_post.push(null);
				}
				if(data.data[i].to){
					data_post.push(data.data[i].to.id);
					data_post.push(data.data[i].to.name);
				} else {
					data_post.push(null);
					data_post.push(null);
				}
				data_post.push(data.data[i].type);
				data_post.push(data.data[i].likes.summary.total_count);
				data_post.push(data.data[i].comments.summary.total_count);
				if (data.data[i].shares) {
					data_post.push(data.data[i].shares.count);
				}else{
					data_post.push(0);
				}
				var event1 = new Date();
				// console.log(event1.getFullYear()+"/"+(event1.getMonth()+1)+"/"+event1.getDate()+" "+event1.getHours()+":"+event1.getMinutes()+":"+event1.getSeconds());
				data_post.push(event1.getFullYear()+"/"+(event1.getMonth()+1)+"/"+event1.getDate()+" "+event1.getHours()+":"+event1.getMinutes()+":"+event1.getSeconds());
				// console.log(data_post);
				database.push(data_post);
				data_arr[i] = data.data[i];
				if (data.data[i].type=='photo' || data.data[i].type == 'video') {
					// console.log('OOOOYYYYY');//
					// data_post.push()
					data_attch.push(data.data[i].object_id);
					data_attch.push(data.data[i].id);
					data_attch.push(data.data[i].attachments.data[0].description);
					data_attch.push(data.data[i].attachments.data[0].target.url);
					data_attch.push(data.data[i].attachments.data[0].title);
					data_attch.push(data.data[i].attachments.data[0].type);
					data_attch.push(data.data[i].attachments.data[0].url);
					data_attch.push(data.data[i].attachments.data[0].media.image.src);
					database_attch.push(data_attch);
				}
			}
			data_length += data.data.length;
			if (data.paging) {
				if(typeof data.paging.next == 'undefined' || limit != null){
					// console.log("aaawwww");
					if(typeof data.paging.next == 'undefined'){
						datafb['next'] = '';
				  	}else{
				  		datafb['next'] = data.paging.cursors.after;
				  	}
				  	if(typeof data.paging.previous == 'undefined'){
				  		datafb['previous'] = '';
				  	}else{
				  		datafb['previous'] = data.paging.cursors.before;
				  	}
					break;
				}else{
					var next = data.paging.cursors.after;
					url2 = url + "&after="+next;
				}
			} else{
				break;
			}
			ctr++;
		}
		datafb['data'] = data_arr;
		datafb['length'] = data_length;
		console.log(data_length);
		if (data_length > 0 ) {
			var query = 'INSERT INTO posts (ID_POST,ID_PAGE,CAPTION,CREATED_TIME,DESCRIPTION,FROM_ID,FROM_NAME,FULL_PICTURE,MESSAGE,NAME,OBJECT_ID,PICTURE,PLACE_NAME,PLACE_ID,SOURCE,STATUS_TYPE,STORY,TO_ID,TO_NAME,TYPE,TOTAL_LIKE,TOTAL_COMMENT,TOTAL_SHAREPOST,UPDATED_TIME) VALUES ? ON DUPLICATE KEY UPDATE ID_POST=VALUES(ID_POST), MESSAGE=VALUES(MESSAGE), TOTAL_LIKE = VALUES(TOTAL_LIKE),TOTAL_COMMENT= VALUES(TOTAL_COMMENT),TOTAL_SHAREPOST= VALUES(TOTAL_SHAREPOST),UPDATED_TIME= VALUES(UPDATED_TIME)';
			var wkw = MySQLdb.query(query,[database], function (error, results, fields) {
			if (error) return reject(error);
				// console.log('yeay berhasil');
			});
			console.log(database_attch.length);
			if (database_attch.length > 0) {
				console.log('HAHHAHAHHAHAHAHHAHAHHAHAHHAHAHAHAHAH');
				var query_attch = 'INSERT IGNORE INTO attachments (ID_ATTACHMENT,ID_POST,DESCRIPTION,TARGET,TITTLE,TYPE,URL,MEDIA) VALUES ?';
				var wkw = MySQLdb.query(query_attch,[database_attch], function (error, results, fields) {
				if (error) return reject(error);
					// console.log('yeay okee');
				});
			}
		}
		
		// console.log(wkw.sql); 
		// console.log(database);
		// res.json(data);
		resolve(datafb);
	});
}

function get_post(url){
	// console.log(datafb);
	return new Promise(async function(resolve, reject){
		var datafb = {};
	  	var data_arr = [];
	  	var data_post = [];
	  	var data_attch = [];
	  	var database_attch = [];
		try{
			var data = await graph_get(url);
		}catch(err){
			var ret = {};
			ret.status = 0;
			ret.type = err.type;
			ret.code = err.code;
			ret.message = err.message;
			console.log(err);
			return reject(ret);
		}
		console.log(data);
		data_attch = [];
		data_post = [];
		data_post.push(data.id);
		var hai = data.id.split("_");
		data_post.push(hai[0]);
		if (data.caption) {
			data_post.push(data.caption);
		}else{
			data_post.push(null);
		}
		var event1 = new Date(data.created_time);
		data.created_time = event1.getFullYear()+"/"+(event1.getMonth()+1)+"/"+event1.getDate()+" "+event1.getHours()+":"+event1.getMinutes()+":"+event1.getSeconds();
		data_post.push(data.created_time);
		if (data.description) {
			data_post.push(data.description);
		}else{
			data_post.push(null);
		}
		if(data.from){
			data_post.push(data.from.id);
			data_post.push(data.from.name);
		} else {
			data_post.push(null);
			data_post.push(null);
		}
		if (data.full_picture) {
			data_post.push(data.full_picture);
		}else{
			data_post.push(null);
		}
		data_post.push(data.message);
		if (data.name) {
			data_post.push(data.name);
		}else{
			data_post.push(null);
		}
		if (data.object_id) {
			data_post.push(data.object_id);
		}else{
			data_post.push(null);
		}
		if (data.picture) {
			data_post.push(data.picture);
		}else{
			data_post.push(null);
		}
		if(data.place){
			data_post.push(data.place.name);
			data_post.push(data.place.id);
		} else {
			data_post.push(null);
			data_post.push(null);
		}
		if (data.source) {
			data_post.push(data.source);
		}else{
			data_post.push(null);
		}
		data_post.push(data.status_type);
		if (data.story) {
			data_post.push(data.story);
		}else{
			data_post.push(null);
		}
		if(data.to){
			data_post.push(data.to.id);
			data_post.push(data.to.name);
		} else {
			data_post.push(null);
			data_post.push(null);
		}
		data_post.push(data.type);
		data_post.push(data.likes.summary.total_count);
		data_post.push(data.comments.summary.total_count);
		if (data.shares) {
			data_post.push(data.shares.count);
		}else{
			data_post.push(0);
		}
		var event1 = new Date();
		data_post.push(event1.getFullYear()+"/"+(event1.getMonth()+1)+"/"+event1.getDate()+" "+event1.getHours()+":"+event1.getMinutes()+":"+event1.getSeconds());
		if (data.type=='photo' || data.type == 'video') {
			data_attch.push(data.object_id);
			data_attch.push(data.id);
			data_attch.push(data.attachments.data[0].description);
			data_attch.push(data.attachments.data[0].target.url);
			data_attch.push(data.attachments.data[0].title);
			data_attch.push(data.attachments.data[0].type);
			data_attch.push(data.attachments.data[0].url);
			data_attch.push(data.attachments.data[0].media.image.src);

		}
	if (data.id) {
		var query = 'INSERT INTO posts (ID_POST,ID_PAGE,CAPTION,CREATED_TIME,DESCRIPTION,FROM_ID,FROM_NAME,FULL_PICTURE,MESSAGE,NAME,OBJECT_ID,PICTURE,PLACE_NAME,PLACE_ID,SOURCE,STATUS_TYPE,STORY,TO_ID,TO_NAME,TYPE,TOTAL_LIKE,TOTAL_COMMENT,TOTAL_SHAREPOST,UPDATED_TIME) VALUES ? ON DUPLICATE KEY UPDATE ID_POST=VALUES(ID_POST), MESSAGE=VALUES(MESSAGE), TOTAL_LIKE = VALUES(TOTAL_LIKE),TOTAL_COMMENT= VALUES(TOTAL_COMMENT),TOTAL_SHAREPOST= VALUES(TOTAL_SHAREPOST),UPDATED_TIME= VALUES(UPDATED_TIME)';
		var wkw = MySQLdb.query(query,data_post, function (error, results, fields) {
		if (error) return reject(error);
			// console.log('yeay berhasil');
		});
		if (data_attch.length > 0) {
			var query_attch = 'INSERT IGNORE INTO attachments (ID_ATTACHMENT,ID_POST,DESCRIPTION,TARGET,TITTLE,TYPE,URL,MEDIA) VALUES ?';
			var wkw = MySQLdb.query(query_attch,data_attch, function (error, results, fields) {
			if (error) return reject(error);
				// console.log('yeay okee');
			});
		}
		console.log(wkw.sql);
	}
		resolve(data);
	});
}

function get_likes(url, obj, type, limit){
	return new Promise(async function(resolve, reject){
		var datafb = {};
	  	var data_arr = [];
	  	var data_post = [];
	  	var data_attch = [];
	  	var database = [];
	  	var database_attch = [];
		var ctr = 0;
		var data_length = 0;
		while(true){
			try{
				if(ctr == 0){
					var data = await graph_get(url);
				}else{
					var data = await graph_get(url2);
				}
			}catch(err){
				var ret = {};
				ret.status = 0;
				console.log(err);
				// res.json(ret);
				return reject(ret);
			}
			for(i=0;i<data.data.length;i++){
				data_arr[i] = data.data[i];
				data_post = [];
				data_post.push(data.data[i].id);
				if (type == 'page') {
					data_post.push(obj);
				}else{
					data_post.push(null);
				}
				if (type == 'sharepost') {
					data_post.push(obj);
				}else{
					data_post.push(null);
				}
				if (type == 'post') {
					data_post.push(obj);
				}else{
					data_post.push(null);
				}
				if (type == 'comment') {
					data_post.push(obj);
				}else{
					data_post.push(null);
				}
				data_post.push(data.data[i].link);
				data_post.push(data.data[i].name);
				data_post.push(data.data[i].pic);
				data_post.push(data.data[i].pic_large);
				data_post.push(data.data[i].pic_square);
				data_post.push(data.data[i].profile_type);
				data_post.push(data.data[i].username);
				database.push(data_post);
			}
			data_length += data.data.length;
			if (data.paging) {
				if(typeof data.paging.next == 'undefined' || limit != null){
					// console.log("aaawwww");
					if(typeof data.paging.next == 'undefined'){
						datafb['next'] = '';
				  	}else{
				  		datafb['next'] = data.paging.cursors.after;
				  	}
				  	if(typeof data.paging.previous == 'undefined'){
				  		datafb['previous'] = '';
				  	}else{
				  		datafb['previous'] = data.paging.cursors.before;
				  	}
					break;
				}else{
					var next = data.paging.cursors.after;
					url2 = url + "&after="+next;
				}
			} else{
				break;
			}
			ctr++;
		}
		datafb['data'] = data_arr;
		datafb['length'] = data_length;
		console.log(data_length);
		if (data_length > 0 ) {
			var query = 'INSERT IGNORE INTO likes (ID_LIKE,ID_PAGE,ID_SHAREPOST,ID_POST,ID_COMMENT,LINK,NAME,PIC,PIC_LARGE,PIC_SQUARE,PROFIL_TYPE,USERNAME) VALUES ?';
			var wkw = MySQLdb.query(query,[database], function (error, results, fields) {
			if (error) return reject(error);
				// console.log('yeay berhasil');
			});
		}
		resolve(datafb);
	});
}

function get_shareposts(url, obj, limit){
	return new Promise(async function(resolve, reject){
		var datafb = {};
	  	var data_arr = [];
	  	var data_post = [];
	  	var data_attch = [];
	  	var database = [];
	  	var database_attch = [];
		var ctr = 0;
		var data_length = 0;
		while(true){
			try{
				if(ctr == 0){
					var data = await graph_get(url);
				}else{
					var data = await graph_get(url2);
				}
			}catch(err){
				var ret = {};
				ret.status = 0;
				console.log(err);
				// res.json(ret);
				return reject(ret);
			}
			for(i=0;i<data.data.length;i++){
				data_post = [];
				data_attch = [];
				data_post.push(data.data[i].id);
				data_post.push(obj);
				var event1 = new Date(data.data[i].created_time);
				data.data[i].created_time = event1.getFullYear()+"/"+(event1.getMonth()+1)+"/"+event1.getDate()+" "+event1.getHours()+":"+event1.getMinutes()+":"+event1.getSeconds();
				data_post.push(data.data[i].created_time);
				if(data.data[i].from){
					data_post.push(data.data[i].from.id);
					data_post.push(data.data[i].from.name);
				} else {
					data_post.push(null);
					data_post.push(null);
				}
				data_post.push(data.data[i].link);
				data_post.push(data.data[i].message);
				data_post.push(data.data[i].name);
				data_post.push(data.data[i].object_id);
				data_post.push(data.data[i].parent_id);
				data_post.push(data.data[i].picture);
				if(data.data[i].place){
					data_post.push(data.data[i].place.name);
					data_post.push(data.data[i].place.id);
				} else {
					data_post.push(null);
					data_post.push(null);
				}
				data_post.push(data.data[i].story);
				data_post.push(data.data[i].likes.summary.total_count);
				data_post.push(data.data[i].comments.summary.total_count);
				var event1 = new Date();
				data_post.push(event1.getFullYear()+"/"+(event1.getMonth()+1)+"/"+event1.getDate()+" "+event1.getHours()+":"+event1.getMinutes()+":"+event1.getSeconds());
				database.push(data_post);
				data_arr[i] = data.data[i];
			}
			data_length += data.data.length;
			if (data.paging) {
				if(typeof data.paging.next == 'undefined' || limit != null){
					// console.log("aaawwww");
					if(typeof data.paging.next == 'undefined'){
						datafb['next'] = '';
				  	}else{
				  		datafb['next'] = data.paging.cursors.after;
				  	}
				  	if(typeof data.paging.previous == 'undefined'){
				  		datafb['previous'] = '';
				  	}else{
				  		datafb['previous'] = data.paging.cursors.before;
				  	}
					break;
				}else{
					var next = data.paging.cursors.after;
					url2 = url + "&after="+next;
				}
			} else{
				break;
			}
			ctr++;
		}
		datafb['data'] = data_arr;
		datafb['length'] = data_length;
		console.log(data_length);
		if (data_length > 0 ) {
			var query = 'INSERT INTO shareposts (ID_SHAREPOST,ID_POST,CREATED_TIME_SHAREPOST,FROM_ID_SHAREPOST,FROM_NAME_SHAREPOST,LINK_SHAREPOST,MESSAGE_SHAREPOST,NAME_OBJECT,OBJECT_ID_SHAREPOST,PARENT_ID_SHAREPOST,PICTURE_SHAREPOST,PLACE_NAME_SHAREPOST,PLACE_ID_SHAREPOST,STORY_SHAREPOST,TOTAL_LIKE_SHAREPOST,TOTAL_COMMENT_SHAREPOST,UPDATE_TIME_SHAREPOST) VALUES ? ON DUPLICATE KEY UPDATE ID_SHAREPOST=VALUES(ID_SHAREPOST), MESSAGE_SHAREPOST=VALUES(MESSAGE_SHAREPOST), TOTAL_LIKE_SHAREPOST = VALUES(TOTAL_LIKE_SHAREPOST),TOTAL_COMMENT_SHAREPOST= VALUES(TOTAL_COMMENT_SHAREPOST),UPDATE_TIME_SHAREPOST= VALUES(UPDATE_TIME_SHAREPOST)';
			var wkw = MySQLdb.query(query,[database], function (error, results, fields) {
			if (error) return reject(error);
				// console.log('yeay berhasil');
			});
		}
		resolve(datafb);
	});
}

function graph_get(url){
	return new Promise(function(resolve, reject){
		graph.get(url, function(err, res) {
			if(err) return reject(err);
			resolve(res);
		});
	});
}

function graph_post(url, msg){
	return new Promise(function(resolve, reject){
		graph.post(url,msg, function(err, res) {
			if(err) return reject(err);
			resolve(res);
		});
	});
}

function graph_post_likes(url){
	return new Promise(function(resolve, reject){
		graph.post(url, function(err, res) {
			if(err) return reject(err);
			resolve(res);
		});
	});
}

function graph_delete(url){
	return new Promise(function(resolve, reject){
		graph.del(url, function(err, res) {
			if(err) return reject(err);
			resolve(res);
		});
	});
}

module.exports = { graph_get, graph_post, graph_post_likes, graph_delete, get_post, get_feed,
 get_comments, get_likes, get_fplist, get_shareposts};
