import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Joi } from 'joi-browser';
import pic from "../images/Side-img.webp";
import bg from "../images/bvm.jpg";
import { BsEnvelopeFill } from "react-icons/bs";
import {BsLockFill} from "react-icons/bs";
import axios from 'axios';
import "../App.css";

export default function Form() {

  //Radio button user type 
  const [selectedPath,setSelectedPath] = useState('faculty');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [conpass, setconpass] = useState(''); 
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);

  const navigate = useNavigate();

  function validation(email, password, confpass) {
    const schema = Joi.object({
      vemail: Joi.String().required().email(),
      vpassword: Joi.String().required(),
      vconfpassword: Joi.String().required()
    });


    return schema.validate({
      vemail: email,
      vpassword: password,
      vconfpassword: confpass

    });
  }

  //handling radio buttons
  const handleRadio = (e) => {
  setSelectedPath(e.target.value);
  // window.alert(e.target.value)
  setSubmitted(false);
};

  const handleEmail = (e) => {
    setEmail(e.target.value);
    setSubmitted(false);
  };


  const handlePassword = (e) => {
    setPassword(e.target.value);
    setSubmitted(false);
  };


  const handleConPass = (e) => {
    setconpass(e.target.value);
    setSubmitted(false);
  };


  const handleSubmit = async (e) => {
    if (selectedPath === 'faculty' && password != "" && password == conpass) {
        console.log(email);
        const res=await axios.post("http://localhost:5000/registration", {
        username: email,
        password: password,
      }); 
      
        console.log(res);
        console.log(res.status);
        if(res.status=== 401 ){
          window.alert("Invalid registration");
          console.log("Invalid registration");

        }
        else if(res.status==201){
          window.alert("User already exist");            
          console.log("User already exist");
        }
        else{
          window.alert("Registration Successfull , wait for day or two for admin's approval");
          console.log("Registration Successfull");
        }
    }
    else if(selectedPath === 'admin' && password != "" && password == conpass){
      console.log(email);
      const res=await axios.post("http://localhost:5000/admin_registration", {
      username: email,
      password: password,
    }); 
    
      console.log(res);
      console.log(res.status);
      if(res.status=== 401 ){
        window.alert("Invalid registration");
        console.log("Invalid registration");

      }
      else if(res.status===201){
        window.alert("User already exist");            
        console.log("User already exist");
      }
      else{
        window.alert("Registration Successfull , wait for day or two for admin's approval");
        console.log("Registration Successfull");
      }
    }
    else {
      alert("Please enter password correctly");
    }
  };


  const successMessage = () => {
    return (
      <div
        className="success"
        style={{
          display: submitted ? '' : 'none',
        }}>
        <h1>successfully registered!!</h1>
      </div>
    );
  };


  const errorMessage = () => {
    return (
      <div
        className="error"
        style={{
          display: error ? '' : 'none',
        }}>
        <h1>Please enter all the fields</h1>
      </div>
    );
  };


  return (
    <React.Fragment>
      <div className="messages">
        {errorMessage()}
        {successMessage()}
      </div>

      <div className="form-box">
        <div className='left-part'>
          <img src={pic} alt='Registration image'></img>
        </div>
        <div className='right-part'>
          <h1 className='form-heading'>User Registration</h1>
          <div className='registration-form'>
            {/* <form onSubmit={handleSubmit} method="POST"> */}

              <div className='radio-detail'>
              <h3 className='user-type'>user type</h3>
              <div className='radio-btn'>
              <div className='btn'>
                <input onChange={handleRadio} className="input" name='user' value="faculty" type="radio" required/><p>faculty</p></div>
              <div className='btn'>  
                <input onChange={handleRadio} className="input" name='user' value="admin" type="radio" required/><p>admin</p></div>
              </div>
              </div>
              <div className='input-detail'>
                <BsEnvelopeFill/>
                <input onChange={handleEmail} className="input" value={email} type="email" placeholder='Email' required/>
              </div>

              <div className='input-detail'>
                <BsLockFill/>
                <input onChange={handlePassword} className="input" value={password} type="password" placeholder='Password' required/>
              </div>

              <div className='input-detail'>
                <BsLockFill/>
                <input onChange={handleConPass} className="input" value={conpass} type="password" placeholder='Confirm Password' required/>
              </div>

              <div className='submit-btn'>
              <button onClick={handleSubmit} className="btn" type="submit">Submit</button>
              </div>
            {/* </form> */}
            <p className='form-para'>Already have an account? <Link to='/login'>Login Here.</Link></p>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}