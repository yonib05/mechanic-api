process.env.NODE_ENV = 'test';

let Appointments = require('./utils/model');

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../start');
let should = chai.should();


chai.use(chaiHttp);

describe('Appointments', () => {
    beforeEach((done) => {
        Appointments.deleteMany({}, (err) => {
            done();
        });
    });
    describe('/GET Appointments', () => {
        it('it should GET all the Appointments', (done) => {
            chai.request(server)
                .get('/appointments?start_time=2020-09-25T01:00:00.000Z&end_time=2020-09-26T01:30:00.000Z')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(0);
                    done();
                });
        });
    });
    describe('/POST Appointment', () => {
        it('it should not POST a appointment without start_time', (done) => {
            let appointmentTime = {
                "name": "John Doe",
                "price": 23
            };
            chai.request(server)
                .post('/appointments')
                .send(appointmentTime)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message');
                    res.body.message.should.equal('When would you like to have your vehicle serviced?');
                    done();
                });
        });
        it('it should POST a appointment ', (done) => {
            let appointmentTime = {
                "name": "John Doe",
                "start_time": "2020-09-25T01:00:00.000Z",
                "end_time": "2020-09-25T01:30:00.000Z",
                "price": 23
            };
            chai.request(server)
                .post('/appointments')
                .send(appointmentTime)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('_id');
                    res.body.should.have.property('name');
                    res.body.should.have.property('start_time');
                    res.body.should.have.property('end_time');
                    done();
                });
        });
    });
    describe('/GET/:id appointment', () => {
        it('it should GET a appointment by the given id', (done) => {
            let appointmentTime = new Appointments({
                "type": "sedan",
                "status": "pending",
                "name": "John Doe",
                "start_time": "2020-09-25T00:00:00.000Z",
                "end_time": "2020-09-25T01:30:00.000Z",
                "price": 23
            });
            appointmentTime.save((err) => {
                if(err) done(err);
                chai.request(server)
                    .get('/appointments/' + appointmentTime.id)
                    .send()
                    .end((err, res) => {
                        res.should.have.status(200);
                        should.exist(res.body);
                        res.body.should.be.a('object');
                        res.body.should.have.property('type');
                        res.body.should.have.property('status');
                        res.body.should.have.property('name');
                        res.body.should.have.property('start_time');
                        res.body.should.have.property('end_time');
                        res.body.should.have.property('_id').eql(appointmentTime.id);
                        done();
                    });
            });

        });
    });
    describe('/PUT/:id appointment', () => {
        it('it should UPDATE a appointment given the id', (done) => {
            let appointmentTime = new Appointments({
                "type": "sedan",
                "status": "pending",
                "name": "John Doe",
                "start_time": "2020-09-25T01:00:00.000Z",
                "end_time": "2020-09-25T01:30:00.000Z",
                "price": 23
            });
            appointmentTime.save((err) => {
                if(err) done(err);
                chai.request(server)
                    .put('/appointments/' + appointmentTime.id)
                    .send({status: "completed"})
                    .end((err, res) => {
                        res.should.have.status(200);
                        should.exist(res.body);
                        res.body.should.be.a('object');
                        res.body.should.have.property('status').eql('completed');
                        done();
                    });
            });
        });
    });
    /*
     * Test the /DELETE/:id route
     */
    describe('/DELETE/:id appointment', () => {
        it('it should DELETE a appointment given the id', (done) => {
            let appointmentTime = new Appointments({
                "type": "sedan",
                "status": "pending",
                "name": "John Doe",
                "start_time": "2020-09-25T01:00:00.000Z",
                "end_time": "2020-09-25T01:30:00.000Z",
                "price": 23
            });
            appointmentTime.save((err) => {
                if(err) done(err);
                chai.request(server)
                    .delete('/appointments/' + appointmentTime.id)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('message').eq('Appointment successfully deleted');
                        done();
                    });
            });
        });
    });
});
