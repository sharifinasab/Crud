import chai from 'chai';
import chaiHttp from 'chai-http';
import { Guid } from 'guid-typescript';
import mongoUnit from 'mongo-unit';
import ToDoList from '../model/todoList';
import mongoTestData from './mongo-test-data.json';
import { app as server, initialize } from '../../src/index';


after(function() {
    mongoUnit.stop();
})

let should = chai.should();
chai.use(chaiHttp);

describe('TodoList', function() {
  before(async function () {
    await mongoUnit.start({ dbName: 'Todo' });
    console.log('Mongo in memory started: ', mongoUnit.getUrl());
    process.env.DATABASE_URL = mongoUnit.getUrl();
    initialize();
  });

  beforeEach(function(done) {
        if(process.env.DATABASE_URL) {
            mongoUnit.initDb(process.env.DATABASE_URL, mongoTestData);
        }
        done();
    });

  afterEach(function() { mongoUnit.drop() } );

  describe('/GET todo list', function() {
      it('it should GET all todo lists', (done) => {
            chai.request(server)
            .get('/api/list')
            .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('array');
                  res.body.length.should.be.eql(1);
              done();
            });
      });
  });

  describe('/POST todo list', () => {
      it('it should not POST a todo list without name field', (done) => {
          let list = {};
          chai.request(server)
            .post('/api/list')
            .send(list)
            .end((err, res) => {
                  res.should.have.status(404);
                  res.body.should.be.a('object');
              done();
            });
      });
      it('it should POST a todo list ', (done) => {
          let list = {
              name: 'Test list',
          }
          chai.request(server)
            .post('/api/list')
            .send(list)
            .end((err, res) => {
                  res.should.have.status(201);
                  res.body.should.be.a('object');
                  res.body.should.have.property('message').eql('Successfully added');
              done();
            });
      });
  });

  describe('/GET/:id todo list', () => {
      it('it should GET a todo list by the given id', (done) => {
          let list = new ToDoList();
          list.id =  Guid.parse('d60f24cd-7c4c-d72b-2a80-d6fece6f5335');
          list.name = 'list3';
          
          chai.request(server)
            .get('/api/list/' + list.id)
            .send(list)
            .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('object');
                  res.body.should.have.property('name');
                  res.body.should.have.nested.property('id.value').eql(list.id.toString());
              done();
            });
          });

      });

  describe('/PUT/ todo list', () => {
      it('it should UPDATE a todo list given the id', (done) => {
        chai.request(server)
        .put('/api/list')
        .send({id: 'd60f24cd-7c4c-d72b-2a80-d6fece6f5335', name: 'list2'})
        .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('message').eql('Successfully updated');
          done();
        });
      });
  });

  describe('/DELETE/:id todo list', () => {
      it('it should DELETE a todo list given the id', (done) => {
        chai.request(server)
        .delete('/api/list/' + 'd60f24cd-7c4c-d72b-2a80-d6fece6f5335')
        .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('message').eql('Successfully deleted');
          done();
        });
      });
  });
});