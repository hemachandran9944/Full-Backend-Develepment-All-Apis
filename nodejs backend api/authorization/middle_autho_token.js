





// Token Authorization  //



require('dotenv').config(); 
const json_web_token = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const API_token_password = "hema@8754";
const nodemailer = require('nodemailer');






    // Post Mehtod Aothu Token Genarate //

const createMyToken = (userId) => {
    return json_web_token.sign(
        { id: userId }, 
        API_token_password, 
        { expiresIn: '1d' }
    );
};



            // OTP Genarate  //


console.log('Checking Email',process.env.email_users); 
console.log('Email Password',process.env.email_password);           
const isTransporter_OTP = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.email_users,
        pass: process.env.email_password
    }
}); 

const sendRegisterOTP = async (email_addres, name, generate_OTP) => {

    const gmail_setting = {

        from: process.env.email_users,
        to: email_addres,
        subject: "Verify Your Account - Welcome to Mugi Electronics",
        text: `Hi ${name},\n\n` +
              `Thank you for registering with Mugi Electronics.\n\n` +
              `To complete your registration, please use the following One-Time Password (OTP):\n\n` +
              `OTP: ${generate_OTP}\n\n` +
              `This code is valid for 10 minutes. Please do not share this OTP with anyone for security reasons.\n\n` +
              `If you did not request this, please ignore this email.\n\n` +
              `Best regards,\n` +
              `Mugi Electronics`
  };

  return await isTransporter_OTP.sendMail(gmail_setting);
};

        // Forget Password Otp gmial msg//

const sendForgetPasswordOTP = async (email, name, otp) => {

    const forget_passeord_gmial_msg = {

        from: process.env.email_users,
        to: email,
        subject: "Password Reset Request - Mugi Electronics",
        text: `Hi ${name},\n\n` +
              `You have requested to reset your password for your Mugi Electronics account.\n\n` +
              `Your One-Time Password (OTP) is: ${otp}\n\n` +
              `This OTP is valid for 10 minutes only. Please use it to set a new password.\n\n` +
              `If you did not request this, please ignore this email for security reasons.\n\n` +
              `Best regards,\n` +
              `Mugi Electronics`
  };

  return await isTransporter_OTP.sendMail(forget_passeord_gmial_msg);
};


    
    
        // Autho Token //

const authorization_token = (req, res, next)=>{

    try {
        const authHeader_Update = req.headers.authorization
        const Upadate_Bearer_keyword = "Bearer";
        if (!authHeader_Update || !authHeader_Update.startsWith(Upadate_Bearer_keyword)) {

            const autho_token = "failed"
            const autho_token_msg = "Token missing or invalid"
            return res.status(401).json({
                status: autho_token,
                messag: autho_token_msg
            });        
    }




        const token  = authHeader_Update.split(" ")[1];
        const API_token_paasword =  "hema@8754";
        const json_web_token = require('jsonwebtoken');
        json_web_token.verify(token, API_token_password);
        
        next();

    } catch (json_web_tokenerror) {

    
        const authoheader_fialed  = "Failed"
        const authoheader_msg = "Invalid or expired token"
        
        return res.status(401).json({
            status: authoheader_fialed,
            message: authoheader_msg,
            error:json_web_tokenerror.message
                
        });
        
    }
};




















module.exports = { 
    createMyToken, 
    authorization_token,
    isTransporter_OTP,
    sendRegisterOTP,
    sendForgetPasswordOTP
   
};




