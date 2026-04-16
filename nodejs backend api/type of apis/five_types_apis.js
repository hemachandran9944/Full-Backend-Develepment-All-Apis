


const express    = require('express');
const router_apiS =  express.Router();
const users_details = require('../fields/schema');
const { ReturnDocument } = require('mongodb');
const { createMyToken, authorization_token, isTransporter_OTP, sendRegisterOTP, sendForgetPasswordOTP } = require('../authorization/middle_autho_token');
const bcrypt = require('bcrypt');





                    // Register APIs//

router_apiS.post('/register', async(req, res )=>{
    try {
        const {
            name,
            email_addres, 
            password_field
        } = req.body

        const userExit = await users_details.findOne({email_addres});
        const gmail_exit = "Resister Failed"
        const resgister_msg = "Email is already registered !" 
        if (userExit) {
            return res.status(400).json({
                status: gmail_exit,
                message: resgister_msg

            });
            
        }


        // Generate OTP Gmail//

        const generate_OTP = Math.floor(100000 + Math.random()* 900000).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes






            // Send tha Email//
        await sendRegisterOTP(email_addres, name, generate_OTP);

        // Save to DataBase//

        const newUser = new users_details({
            name,
            email_addres,
            password_field,
            otp: generate_OTP,
            otp_expiry: otpExpiry,
            Otp_verifaid: false

        });


        await newUser.save();


        const Success_field  = 'Succes';
        const res_OTP_msg = 'OTP sent to your email! Please check and verify.';

        res.status(200).json({
            status: Success_field,
            messag: res_OTP_msg,
            data: newUser
        });



        


    
    } catch (error) {
        const error_Msg = 'Register Error:'
        const error_status = 'Failed'
        const respone_msg = 'Internal Server Error'
        console.log(error_Msg, error);
        res.status(500).json({
            status: error_status,
            message: error_Msg,
            error: error.message
        });



        
    }
});                    



                // resgister-otp-verify //

router_apiS.post('/verify-otp-resgister', async (req, res, )=>{
    try {
        const{email_addres, otp} = req.body
        const users_id  = await users_details.findOne({email_addres});
        if (!users_id) {
            return res.status(404).json({
                status: "Failed",
                message: "User not found!"
            });
            
        }


        if (users_id.otp === otp) {
            users_id.Otp_verifaid = true;
            users_id.otp = null;
            await users_id.save();
            res.status(200).json({
                status: "Success",
                message: "Email Verified Successfully! Now you can Login."
            });
            
        } else {
            res.status(400).json({
                status: "Failed",
                message: "Invalid OTP. Please check your email."
            });
            
        }

    } catch (error) {
        console.log("Verify OTP Error:", error.message);
        res.status(500).json({
            status: "Error",
            message: error.message
        });


        
    }
});







                    // Forger-password otp//

router_apiS.post('/forget-password-otp', async (req, res) => {
  try {
    const { email_id,  } = req.body;

    if (!email_id) {
      return res.status(400).json({
        status: "Failed",
        message: "Email is required"
      });
    }

    const user_Gmial_iD = await users_details.findOne({ email_addres: email_id });

    
    if (!user_Gmial_iD) {
      return res.status(404).json({
        status: "Failed",
        message: "User not found with this email"
      });
    }

    

    const Otp_genarate = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry_ten_minutes = new Date(Date.now() + 10 * 60 * 1000);


    await sendForgetPasswordOTP(email_id, user_Gmial_iD.name, Otp_genarate);

    // update user in DB

    user_Gmial_iD.otp = Otp_genarate;
    user_Gmial_iD.Otp_verifaid = false;
    user_Gmial_iD.otp_expiry_ten_menites = otpExpiry_ten_minutes;



    await user_Gmial_iD.save();



    return res.status(200).json({
      status: "Success",
      message: "OTP sent to your email",
      data: {
        email: email_id
          
      }

    });




  } catch (error) {
  
    return res.status(500).json({

      status: "Failed",
      message: "Internal server error",
      error: error.message



    });

  }

});






                        //  Forget-Password-Otp-Verfied//


router_apiS.post('/reset-password', async (req, res)=>{
    try {

        const{email_addres, newPassword, confirmPassword, otp} = req.body;
        const user_gmialID = await users_details.findOne({ email_addres });


        if (newPassword !== confirmPassword ) {

            return res.status(400).json({
                message: "Passwords do not match!"
            });
            
        }

        if (!user_gmialID) {
            return res.status(400).json({
                message: "User not found!"
            });
            
        }


        

        

        if (user_gmialID.otp === otp) {
            if (new Date() > user_gmialID.otp_expiry_ten_menites) {
                return res.status(400).json({
                    status: "Failed",
                    message: "OTP has expired. Please request a new one."
                });

                
            }
            user_gmialID.password_field =  newPassword;
            user_gmialID.Otp_verifaid = true;
            user_gmialID.otp = null;
            user_gmialID.otp_expiry_ten_menites = null;
            await user_gmialID.save();
            res.status(200).json({
                status: "Success",
                message: "Password has been reset successfully!",
                //data: user_gmialID
            });
            
        } else {
            res.status(400).json({
                status: "Failed",
                message: "Invalid OTP. Please check your email.",
                error: error.message
                
            });
            
        }
    



        
    } catch (error) {

        res.status(500).json({
            status: "Failed",
            message: error.message 
        });
        
    }
});












            // Login API //

router_apiS.post('/login',  async(req, res )=>{
    try {

        const { email_addres, password_field } = req.body;
        const user_gmialid  = await users_details.findOne({email_addres});

    if (!user_gmialid) {

        const status_field = "Failed";
        const respone_msg = "User not found with this email address";

         return  res.status(401).json({
            status: status_field,
            message: respone_msg             

         });
        
    }



    const match_gmila_Password = await bcrypt.compare(password_field, user_gmialid.password_field);

    if (!match_gmila_Password) {
        const password_msg = "Failed";
        const respone_meg = "Invalid password. Please try again"
        return res.status(401).json({
            status: password_msg,
            message: respone_meg 

        });

        
    }

    const Success_msg = "Success";
    const respone_msg = "Login Successfulley";
    const Lgoin_API_token = createMyToken(user_gmialid._id); 
    res.status(200).json({
        status: Success_msg,
        message: respone_msg,
        token: Lgoin_API_token,
        data:{
            id: user_gmialid._id,
            name: user_gmialid.name,
            email: user_gmialid.email_addres
            
        }
        

    });




        
    } catch (error) {
        const  login_flaid = "Login Falied";
        const ligon_msg = "Login Fiald Please Try Again";
        res.status(404).json({
            status: login_flaid,
            message: ligon_msg
        });



        
    }



});



                //  Logout APIs//



router_apiS.post('/logout', (req, res)=>{
    try {
        res.status(200).json({
            status: "Success",
            message: "Logged out successfully!"
        });
    } catch (error) {

        res.status(500).json({
            status: "Failed",
            message: error.message
        });
        
    }
});




























                // Post Method //


router_apiS.post('/',  async(req, res)=>{
    try {

        const users_data = req.body
        const User_post =  new users_details (users_data);
        const saved_data = await User_post.save();  
        const API_token = createMyToken(saved_data._id);
        
        const seccess_let = "Success";
        const post_mes_let = "Create Successfully";

        res.status(201).json({
            status: seccess_let,
            postMessage: post_mes_let, 
            token:API_token,
            data: saved_data

        });
        
    } catch (error) {

        
        let failed_status = "Failed ";
        res.status(404).json({
            status: failed_status,
            message: error.message

        });
            

        
        
    }


});




            // Get All Users//



router_apiS.get('/',  async(req, res)=>{
    try {


        const get_all_users = await users_details.find(); 
        const get_all_ures_Msg = "Get All Uesrs Successfully";
        const get_method_success= "Success";
        res.status(200).json({
            status: get_method_success,
            message: get_all_ures_Msg,
            results: get_all_users.length,
            data:get_all_users

        });
        
    } catch (error) {

        const error_msg = "Could Not Get  Usres Data!"
        const error_fialed = "Failed";
        res.status(500).json({
            status: error_fialed,
            message: error_msg,
            error: error.message 
        });

        
    }
});











      // Get Sigle user id //





router_apiS.get('/:id', authorization_token, async (req, res) => { 

    try {

        const get_sigle_usres_ID = req.params.id;
        const user_data = await users_details.findById(get_sigle_usres_ID);


            if (!user_data) {
                const not_matchin_id = "Not Found user id";
                const error_message = "User with this ID does not exist";

                return res.status(404).json({
                    status: not_matchin_id,
                    message: error_message

            });
        }

        
        const sigle_Ures_success = "Success";
        const sigle_Ures_msg = "Single User Found Successfully";

        
        res.status(200).json({
            status: sigle_Ures_success,
            message: sigle_Ures_msg,
            data: user_data
        });
        
    } catch (error) {

        const erro_single_user_id = "Failed";
        const get_single_Meg = "Internal Server Error or Invalid ID format";

        res.status(500).json({
            status: erro_single_user_id,
            message: get_single_Meg,
            error: error.message
        });
    }
});



        // Update Method //

router_apiS.put('/:id', async (req, res)=>{
    try {


        const Userdata_parem = req.params.id;
        const Update_New_Data = req.body;   
        const update_users_data = await users_details.findById(Userdata_parem);



            

        if (!update_users_data) {
            const Invalied_meg  = "fialed"
            const Not_user_di = "No user found with the provided ID"
            return res.status(404).json({
                status: Invalied_meg,
                message: Not_user_di
            });

             
            
        }

           // 2. Update Fields in Memory 
        Object.assign(update_users_data, Update_New_Data);

            // 3. Save (Triggering Hashing Middleware)
        const Update_data = await update_users_data.save();
       

        const Upadate_req_status = "Success"
        const Upadate_req_msg = "User Data Updated Successfully " 
        res.status(200).json({
            status: Upadate_req_status,
            messag: Upadate_req_msg,
            data: Update_data

        });



    } catch (error) {

        const  Update_res = "Falied"
        const  Update_res_msg = "Internal Server Error"
        res.status(500).json({
            status: Update_res,
            message: Update_res_msg,
            error: error.message
        }) ;


        
    }
});












module.exports = router_apiS



