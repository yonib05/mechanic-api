const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AppointmentSchema = new Schema({
    name: {
        type: String,
        required: 'Kindly enter the name'
    },
    type: {
        type: String,
        enum: ['sedan', 'suv', 'van', 'bus'],
        default: 'sedan'
    },
    start_time: {
        type: Date,
        required: 'When would you like to have your vehicle serviced?'
    },
    end_time: {
        type: Date
    },
    price : {
        type: Number
    },
    status: {
        type: String,
        enum: ['pending', 'ongoing', 'completed'],
        default: 'pending'
    }
}, {timestamps: true});

AppointmentSchema.pre('save', function (next) {
    const self = this;
    if(!self.end_time) self.end_time = self.start_time + 30*60*1000;
    if(self.start_time >= self.end_time) return next(new Error("End Date should be after the start date."));
    AppointmentModel.find({
        $or :[
            {start_time: self.start_time},
            {$and :
                    [
                        {start_time : {$lte: self.start_time} },
                        {end_time : {$gte: self.end_time} }
                    ]
            },
            {$and :
                    [
                        {start_time : {$gte: self.start_time} },
                        {end_time : {$gte: self.end_time} }
                    ]
            }
            ]
    }, function (err, docs) {
        if (!docs.length){
            return next();
        } else{
            return next(new Error("Sorry there is already an appointment during the time you requested."));
        }
    });
});

AppointmentSchema.pre('delete', function (next) {
    const self = this;
    if(Date.now > self.start_time) {
        next(new Error("Sorry you can not delete an appointment that has already started."));
    } else {
        next();
    }
});


const AppointmentModel = mongoose.model('Appointments', AppointmentSchema);
module.exports = AppointmentModel;