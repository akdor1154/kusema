var frisby = require('frisby');

var baseUrl = "http://localhost:3000";

// Questions
frisby.create('Get all questions')
  .get(baseUrl + '/api/questions')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
.toss();

frisby.create('Add a question')
  .post(baseUrl + '/api/questions', {
 		author: 	"test",
 		title: 		"test",
  		message: 	"test",
 		imageUrl: 	"test",
 		videoUrl: 	"test"
    }, {json: true})
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
.toss();

// Answers
frisby.create('Get answer from question id')
  .get(baseUrl + '/api/answers/5507a96f16f490995ec0fbd9')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
.toss();

