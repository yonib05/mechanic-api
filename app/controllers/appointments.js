import mongoose from 'mongoose';
import moment from 'moment/moment';

const Appointment = mongoose.model('Appointments');

export function list_all_appointments(req, res) {
    let filters = {};
    if(req.query.start_time){
        const startDate = moment(req.query.start_time, moment.ISO_8601).toDate(); //req.params.startTime = 2016-09-25T00:00:00
        if(!filters.start_time) filters.start_time = {};
        filters.start_time.$gte = startDate;
    }
    if(req.query.end_time){
        const endDate   = moment(req.query.end_time, moment.ISO_8601).toDate(); //req.params.endTime = 2016-09-25T01:00:00
        if(!filters.start_time) filters.start_time = {};
        filters.start_time.$lte = endDate;
    }
    Appointment.find(
        filters,
        null,
        {
           sort : {
               price: -1 //Sort by price DESC
           }
        })
        .exec()
        .then (appointment => res.json(appointment))
        .catch(err => res.status(500).send(err));
}


export function create_an_appointment(req, res) {
    if(!req.body.start_time) return res.status(400).json({message: "When would you like to have your vehicle serviced?"});
    const startTime = moment(req.body.start_time, moment.ISO_8601); //req.params.startTime = 2016-09-25T00:00:00
    req.body.start_time = startTime.toDate();
    if(req.body.end_time){ // there is a default 1 hour end_time if not end_date is provided
        const endTime = moment(req.body.end_time, moment.ISO_8601); //req.params.endTime = 2016-09-25T01:00:00
        req.body.end_time   = endTime.toDate();
    }

    const new_app = new Appointment(req.body);
    new_app.save()
        .then (appointment => res.status(201).json(appointment))
        .catch(err => res.status(409).json({message: err.message}));
}


export function get_an_appointment(req, res) {
    Appointment.findById(req.params.appointmentId)
        .exec()
        .then (appointment => res.json(appointment))
        .catch(err => res.status(404).send(err));
}


export function update_an_appointment(req, res) {
    Appointment.findOneAndUpdate({_id: req.params.appointmentId}, req.body, {new: true})
        .exec()
        .then (appointment => res.json(appointment))
        .catch(err => res.status(500).send(err));
}


export function delete_an_appointment(req, res) {
    Appointment.deleteOne({
        _id: req.params.appointmentId
    })
        .then ( () => res.json({ message: 'Appointment successfully deleted' }))
        .catch(err => res.json({message: err.message}));
}
