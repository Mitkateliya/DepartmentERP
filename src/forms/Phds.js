import React, { useState,useEffect,useRef } from 'react';
import './form.css';
import '../components/showData.css';
import { AiOutlineClose } from "react-icons/ai";
import { AiOutlinePlus } from "react-icons/ai";
import { HiPrinter } from "react-icons/hi";
import axios from 'axios';
import ReactToPrint from 'react-to-print';
const Phds = () => {
    const [Phd, setPhd] = useState({
        title:"",date_of_completion:"",institute:""
    });
    
    const componentRef = useRef();
    
    //onclick add new button - show form
    const [Show,setShow] = useState(false) 
    
    // function for changing the states
    const handleChange = (e) => {
        //window.alert(e.target.value);
        setPhd({...Phd,[e.target.name]:e.target.value});
    }

    const handleSubmit =async (e)=> {
        const newData = {
            "title":Phd.title, 
            "date_of_completion":Phd.date_of_completion,
            "institute":Phd.institute,
      }
        const result=await axios.post("http://localhost:5000/addphd",newData,{
          
          headers:{"x-auth-token":localStorage.getItem("Token")}
      });
        console.log(result.status);
        window.alert(result.status);
        if(result.status===401){
            window.alert("some error has been accured");
        }
        else if(result.status===200) {
            setData(prev => [...prev,newData])
        }
    }

    //fetching data from the database
    const [Data,setData]=useState([]);
    useEffect(()=>{
        fetchData()
    },[]);
    
    const fetchData=async()=>{
        
        const response =await axios.post("http://localhost:5000/getphd",{},
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

            {/* showing the fetched data */}
            <div className='table-show-outer-box'>
            <div ref={componentRef} className='showData' >
                <h2>Phds</h2>
                    <table>
                        <tr>
                            <th>title</th>
                            <th>date of completion</th>
                            <th>institute</th>
                        </tr>                      
                        {Data.map((item, i) => (
                            <tr key={i}>
                                <td>{item.title}</td>
                                <td>{item.date_of_completion}</td>
                                <td>{item.institute}</td>
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
                    <h3>phd details</h3>
                    <div className='close-btn' onClick={() =>setShow(false)}>
                        <AiOutlineClose/>
                    </div>
                </div>
                <div className='input-field'>
                    <input type='text' onChange={handleChange} name='title' value={Phd.title} placeholder='Paper Title'/>
                </div>
                <div className='input-field'>
                    <input type='text' onChange={handleChange} name='date_of_completion' value={Phd.date_of_completion} placeholder='date of completion'/>
                </div>
                <div className='input-field'>
                    <input type='text' onChange={handleChange} name='institute' value={Phd.institute} placeholder='institute name '/>
                </div>
                
                <div className='submit'>
                    <button onClick={handleSubmit} className="btn" type="submit">Submit</button>
                </div>
                
            </div>:null}
        </>
     );
}
 
export default Phds;