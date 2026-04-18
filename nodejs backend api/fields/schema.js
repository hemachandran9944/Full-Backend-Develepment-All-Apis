

const mongoose = require ('mongoose');
const bcrypt = require('bcrypt');

// 1.UserSchema Resgister Fields 
const Name_field      = String;
const Name_required_msg   = "Name is required";
const Users_password  = String;
const Users_password_msg  = "Password is required";
const gmail_field     = String;
const gmail_required_msg  = "Email address is required";
const conntact_number = String;
const One_time_paasword = String; 
const otp_expiry_type = Date;

// 2.BusSchema  Details Fields

const bus_name = String;
const bus_type = String;
const total_seats = String;
const bus_number = String;
const amenities = String;

// 3.RouteSchema  & Schedule

const source_city = String;
const destination_city = String;
const departure_time = Date; 
const arrival_time = Date;
const duration = String;
const ticket_price = String;

// 4.BookingSchema & Seats

const seat_numbers = String;
const pnr_number = String;
const booking_status = String;
const passenger_details = String;
const payment_id = String;





 








 const user_detail_fieldsnew = mongoose.Schema({
    //App Resgister Fields 
    name:({
        type: Name_field,
        required: [true, Name_required_msg], 
        trim: true
    }),
    password_field:({
        type: Users_password,
        required: [true, Users_password_msg],
        minlength: 6
    }),
    email_addres:({
        type: gmail_field,
        required: [true, gmail_required_msg],
        unique: true,
        trim: true

    }),
    mobile_number:({
        type: conntact_number,
        required: false,
        minlength: 10  

    }),
    otp:({
        type: One_time_paasword,
        default: null,

    }),
    Otp_verifaid:({
        type: Boolean,
        default: false,
        
    }),
    otp_expiry_ten_menites:({
        type: otp_expiry_type,
         default: null 
    }),




    //Bus Details Fields
    type_of_name:({
        type: bus_name,
        required: false,
        trim: true
    }),
    bus_types:({
        type: bus_type,
        required: [false, "AC / Non-AC, Seater / Sleeper"],
        trim: true

    }),
    bus_total_set:({
        type: total_seats,
        required: [false, "Bus total set"],
        trim: true
    }),
    vehicle_registration_number:({
        type: bus_number,
        unique: true,
        required: false,
        trim: true
    }),
    bus_facilities:({
        type: amenities,
        required: [false, "WiFi, Charging Point, Water Bottle"],
        trim: true
    }),

    //Route & Schedule

    starting_point:({
        type: source_city,
        required: [false, "Chennai"],
    }),
    end_point:({
        type: destination_city,
        required: [false, "Bangalore"],
        
    }),
    bus_start_time:({
        type: departure_time,
        required: [false, "Data","Time"],
        trim: true

    }),
    bus_arrival_time:({
        type: arrival_time,
        required: [false, "10:30-PM"],
        trim: true
    }),
    traval_time:({
        type: duration,
        required: [false, "8 Hours"],
        trim: true
    }),
    One_set_rate:({
        type: ticket_price,
        required: [false, "Rs.3500"],
        trim: true
    }),


    // 4.Booking & Seats
    booking_set_number:({
        type: seat_numbers,
        required: [false, "ME2","L4","VE5"],
        trim: true
    }),
    Unique_booking_ID:({
        type: pnr_number,
        unique: true,
        required: false, 
        trim: true
    }),
    Ticket_status:({
        type: booking_status,
        trim: true,
        enum: {
            values: ["Confirmed", "Cancelled", "Pending"],
            message: '{VALUE} is not supported'
        },
        default: "Pending"
    }),
    passenger_name:({
        type: passenger_details,
        required: [false, "name, age, gender"],
        trim: true
        
        
    }),
    transaction_number:({
        type: payment_id,
        unique: true,
        required: false,
        trim: true
    }),




    

 },{timestamps: true});









user_detail_fieldsnew.pre('save', async function (next){
    try {
        if (!this.isModified('password_field')) {
            return next();
        }

        const saltRound = 12;
        this.password_field = await bcrypt.hash(this.password_field, saltRound);
        next();
        

    } catch (error) {
        next(error);
        
    }
});












 
 const user_data  = mongoose.model('CURD_APIs',user_detail_fieldsnew);
 module.exports = user_data; 
 
 
 