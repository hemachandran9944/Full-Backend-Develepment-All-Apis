

const mongoose = require ('mongoose');
const { type } = require('node:os');
const bcrypt = require('bcrypt');


const Name_field      = String;
const Name_required_msg   = "Name is required";
const Users_password  = String;
const Users_password_msg  = "Password is required";
const gmail_field     = String;
const gmail_required_msg  = "Email address is required";
const conntact_number = String;
const tech_company    = String;
const One_time_paasword = String; 
const otp_expiry_type = Date;




 const user_detail_fieldsnew = mongoose.Schema({
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
    techcompany:({
        type: tech_company,
        required: false, 
        trim: true
        
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
    

 },{timestamps: true});









user_detail_fieldsnew.pre('save', async function (){
    try {
        if (!this.isModified('password_field')) {
            return;
        }

        const saltRound = 10;
        this.password_field = await bcrypt.hash(this.password_field, saltRound);

    } catch (error) {
        throw error;
        
    }
});










 
 const user_data  = mongoose.model('Users_db',user_detail_fieldsnew);
 module.exports = user_data; 
 
 
 