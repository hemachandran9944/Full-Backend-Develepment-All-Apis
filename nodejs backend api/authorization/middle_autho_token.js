





// Token Authorization  //



require('dotenv').config();  
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const secret = process.env.JWT_SECRET;





    // Post Mehtod Aothu Token Genarate //

const createMyToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET, 
        { expiresIn: '1d' }
    );
};



            // OTP Genarate  //


         
const isTransporter_OTP = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.email_users,
        pass: process.env.email_password
    }
}); 


                    // Gmail Resgister Otp//

const sendRegisterOTP = async (email_addres, name, generate_OTP) => {

    const gmail_setting = {

        from: process.env.email_users,
        to: email_addres,
        subject: "Verify Your Account - Welcome to Mugi Bus Servies",
        text: `Hi ${name},\n\n` +
              `Thank you for registering with Mugi Bus Servies.\n\n` +
              `To complete your registration, please use the following One-Time Password (OTP):\n\n` +
              `OTP: ${generate_OTP}\n\n` +
              `This code is valid for 10 minutes. Please do not share this OTP with anyone for security reasons.\n\n` +
              `If you did not request this, please ignore this email.\n\n` +
              `Best regards,\n` +
              `Mugi Bus Servies..`
  };

  return await isTransporter_OTP.sendMail(gmail_setting);
};








        // Forget Password Otp gmial msg//

const sendForgetPasswordOTP = async (email_id, name, otp, ) => {

    const forget_passeord_gmial_msg = {

        from: process.env.email_users,
        to: email_id,
        subject: "Password Reset Request - Mugi Bus Servies",
        text: `Hi ${name},\n\n` +
              `You have requested to reset your password for your Mugi Bus Servies account.\n\n` +
              `Your One-Time Password (OTP) is: ${otp}\n\n` +
              `This OTP is valid for 10 minutes only. Please use it to set a new password.\n\n` +
              `If you did not request this, please ignore this email for security reasons.\n\n` +
              `Best regards,\n` +
              `Mugi Bus Servies..`
  };

  return await isTransporter_OTP.sendMail(forget_passeord_gmial_msg);
};


    
    
        // Autho Token //

const authorization_token = (req, res, next)=>{

    try {
        const authHeader_token = req.headers.authorization
         
        if (!authHeader_token || !authHeader_token.startsWith("Bearer ")) {

            return res.status(401).json({
                status: "failed",
                message: "Token missing or invalid"
            });        
    }


        const token  =  authHeader_token.split(" ")[1];
        const decode =  jwt.verify(token, process.env.JWT_SECRET);
        req.user     =  decode;
        
        
        next();

    } catch (json_web_tokenerror) {

    
        const authoheader_fialed  = "Failed"
        const authoheader_msg = "Invalid or expired token"
        
        return res.status(401).json({
            status: authoheader_fialed,
            message: authoheader_msg,
            error:jwterror.message
                
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




