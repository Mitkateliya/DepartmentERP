import React, { useState,useEffect,useRef } from 'react';
import './form.css';
import '../components/showData.css';
import { AiOutlineClose } from "react-icons/ai";
import { AiOutlinePlus } from "react-icons/ai";
import { HiPrinter } from "react-icons/hi";
import axios from 'axios';
import ReactToPrint from 'react-to-print';

const Patents = () => {
    const [Patent, setPatent] = useState({
        faculty:"", title:"",application_no:"",date:"",status:""
    });
    
    const componentRef = useRef();
    
    //onclick add new button - show form
    const [Show,setShow] = useState(false) 
    
    const handleChange = (e) => {
        //window.alert(e.target.value);
        setPatent({...Patent,[e.target.name]:e.target.value});
    }

    const handleSubmit =async (e)=> {
            
        //console.log(Token);
        const newData={
            "faculty":Patent.faculty[0], 
            "title":Patent.title,
            "application_no":Patent.application_no,
            "date":Patent.date,
            "status":Patent.status
      }
        const result=await axios.post("http://localhost:5000/addpatent",newData ,{
          
          headers:{"x-auth-token":localStorage.getItem("Token")}
      });
        console.log(result.status);
        window.alert(result.status);
        if(result.status===401){
            window.alert("some error has been accured");
        }
        else if(result.status===200)
        {
            setData(prev=>[...prev,newData]);
        }
    }

    //fetching data from the database
    const [Data,setData]=useState([]);
    useEffect(()=>{
        fetchData()
    },[]);
    const fetchData=async()=>{
        
        const response =await axios.post("http://localhost:5000/getpatent",{},
        {
            headers:{"x-auth-token":localStorage.getItem("Token")}
        });
        //const resp=response.json();
        console.log(response.data);
        setData(response.data);
    } 


    return ( 
        <>
            {/* add new button */}
            <div className='add-btn'>
                <button className='btn' onClick={() =>setShow(true)}><span><AiOutlinePlus /></span>add new</button>
            </div>

            <div className='table-show-outer-box'>
            <div ref={componentRef} className='showData' >
                <h2>Patents</h2>
            <table>
                <tr>
                    <th>Faculty</th>
                    <th>title</th>
                    <th>Application no</th>
                    <th>date</th>
                    <th>Status</th>
                </tr>
                  {Data.map((item, i) => (
                    <tr key={i}>
                        <td>{item.faculty[0]}</td>
                        <td>{item.title}</td>
                        <td>{item.application_no}</td>
                        <td>{item.date}</td>
                        <td>{item.status}</td>
                    </tr>
                ))}  
            </table>
            </div>

            {/* print button */}
            <ReactToPrint
                trigger={()=>{
                    return <button className='download-btn' ><HiPrinter/>print </button>
                }}
                content={()=>componentRef.current}
                documentTitle="events"
                pageStyle="print"
                />             </div>

            {/* add paper details */}
            {Show?<div className='forms'>
                <div className='form-header'>
                    <h3>Patent details</h3>
                    <div className='close-btn' onClick={() =>setShow(false)}>
                        <AiOutlineClose/>
                    </div>
                </div>

                <div className='input-field'>
                    <input onChange={handleChange} type='text' name='faculty' value={Patent.faculty} placeholder='faculty'/>
                </div>
                <div className='input-field'>
                    <input onChange={handleChange} type='text' name='title' value={Patent.title} placeholder='title'/>
                </div>
                <div className='input-field'>
                    <input onChange={handleChange} type='text' name='application_no' value={Patent.application_no} placeholder='application number'/>
                </div>
                <div className='input-field'>
                    <input onChange={handleChange} type='text' name='date' value={Patent.date} placeholder='date'/>
                </div>
                <div className='input-field'>
                    <input onChange={handleChange} type='text' name='status' value={Patent.status} placeholder='published/registration/awarded/other'/>
                </div>
                
                <div className='submit'>
                    <button onClick={handleSubmit} className="btn" type="submit">Submit</button>
                </div>
                
            </div>:null}
        </>
     );
}
 
export default Patents;