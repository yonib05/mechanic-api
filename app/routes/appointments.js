import {list_all_appointments, create_an_appointment, get_an_appointment, update_an_appointment, delete_an_appointment} from '../controllers/appointments'


export default function AppointmentRoutes(app) {
    // Routes
    app.route('/appointments')
        .get(list_all_appointments)
        .post(create_an_appointment);

    app.route('/appointments/:appointmentId')
        .get(get_an_appointment)
        .put(update_an_appointment)
        .delete(delete_an_appointment);
};