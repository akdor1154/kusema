'use strict';

var Topic = require('../models/topic.js');
var Group = require('../models/group.js');

var mongoose = require('mongoose');

//written in shorthand as we will be writing this by hand for the near-to-medium future.
//n: name, p: [list of parents], s: short name
var topics = [
	{n:'Information Technology', s:'IT'},
	{n:'Computer Science', p:['Information Technology']},
	{n:'Programming', p:['Information Technology']},
	{n:'Introductory Programming', p:['Programming']},
	{n:'MATLAB', p:['Programming']},
	{n:'Software Engineering', p:['Information Technology']},
	{n:'Software Testing', p:['Software Engineering']},
	{n:'Software Documentation', p:['Software Engineering']},
	{n:'Object-Oriented Programming', p:['Programming']},
	{n:'Javascript', p:['Programming']},

	{n:'Mathematics'},
	{n:'Algebra'},
	{n:'Linear Algebra',p:['Algebra']},
	{n:'Computational Mathematics', p:['Mathematics', 'Computer Science']},
	{n:'Optimization',p:['Computational Mathematics']},
	{n:'Curve Fitting', p:['Computational Mathematics', 'Statistics']},
	{n:'Numerical Calculus', p:['Computational Mathematics']},
	{n:'Differential Equations', p:['Mathematics']},
	{n:'Ordinary Differential Equations', s:'ODEs', p:['Differential Equations']},
	{n:'Geometry', p:['Mathematics']},
	{n:'Calculus', p:['Mathematics']},
	{n:'Multivariable Calculus', p:['Calculus']},
	{n:'Sequences', p:['Mathematics', 'Series']},
	{n:'Series', p:['Calculus']},


	{n:'Physics'},
	{n:'Kinetics', p:['Physics']},

	{n:'Chemistry'},
	{n:'Materials Science', p:['Chemistry']},
	{n:'Microstructure', p:['Materials Science']},

	{n:'Materials Engineering'},
	{n:'Material Processing', p:['Materials Engineering']},

	{n:'Mechanical Engineering'},

	{n:'Civil Engineering'},
	{n:'Structures', p:['Civil Engineering', 'Physics']},

	{n:'Engineering Profession'},

	{n:'Electrical Engineering'},
	{n:'Circuits', p:['Electrical Engineering']},
	{n:'Digital Circuits', p:['Circuits', 'Computer Science']},

	{n:'Chemical Engineering'},
	{n:'Mass Balances', p:['Chemical Engineering']},
	{n:'Thermodynamics', p:['Chemical Engineering', 'Mechanical Engineering', 'Physics']},
];

var units = [
	{c:'eng1060',n:'Computing for Engineers',t:[
		'Introductory Programming',
		'MATLAB',
		'Linear Algebra',
		'Computational Mathematics',
		'Optimization',
		'Curve Fitting',
		'Numerical Calculus',
	]},
	{c:'eng1091',n:'Mathematics for Engineering', t:[
		'Linear Algebra',
		'Sequences',
		'Series',
		'Calculus',
		'Multivariable Calculus',
		'Ordinary Differential Equations',
	]},
	{c:'eng1001',n:'Engineering Design: Lighter, Faster Stronger', t:[
		'Civil Engineering',
		'Structures',
		'Kinetics',
		'Materials Engineering',
		'Microstructure',
		'Material Processing',
		'Engineering Profession'
	]},
	{c:'eng1002',n:'Engineering Design: Cleaner, Safer, Smarter', t:[
		'Electrical Engineering',
		'Circuits',
		'Digital Circuits',
		'Chemical Engineering',
		'Mass Balances',
		'Thermodynamics',
		'Materials Engineering',
		'Material Processing',
		'Engineering Profession'
	]},
	{c:'eng1003',n:'Engineering Mobile Apps', t:[
		'Software Engineering',
		'Software Testing',
		'Software Documentation',
		'Javascript'
	]}
];

var dbReadyPromise = new Promise(function(resolve, reject) {
	var i = 0;
	var maybeDone = function (error, result) {
		console.log('dropped');
		i++;
		if (i >= 2) {
			resolve();
		}
	}
	mongoose.connection.on('open', function() {
		mongoose.connection.db.dropCollection('topics', maybeDone),
		mongoose.connection.db.dropCollection('groups', maybeDone)
	});
}).then( function() { return Promise.all(
	topics.map( function(topicShorthand) {
		var topic = new Topic();
		topic.name = topicShorthand.n;
		return topic.save();
	})
)}).then( function() { return Promise.all(
	units.map( function(unitShorthand) {
		var unit = new Group({}, false);
		unit.name = unitShorthand.c + ': '+ unitShorthand.n;
		unit.unitCode = unitShorthand.c;
		unit.title = unitShorthand.n;
		return Topic.find({'name': {'$in': unitShorthand.t}})
	  	.then(function(topics) {
			unit.topics = topics.map(function(topic) { return topic._id } );
			unit.embeddedTopics = topics;
			return unit;
		}).then(function(unit) {
			return unit.save();
		})
		.then(
			function(saved) {
				console.log('yay');
			},
			function(error) {
				console.log('saving error');
				console.log(error);
			}
		);
	})
)}, function(error) {
	console.error('error');
	console.error(error);
});


