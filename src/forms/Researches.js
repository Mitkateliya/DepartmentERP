import React, { useState,useEffect,useRef } from 'react';
import './form.css';
import '../components/showData.css';
import { AiOutlineClose } from "react-icons/ai";
import { AiOutlinePlus } from "react-icons/ai";
import { HiPrinter } from "react-icons/hi";
import { VscFilePdf } from "react-icons/vsc";
import { SiMicrosoftexcel } from "react-icons/si";
import axios from 'axios';
import ReactToPrint from 'react-to-print';
import Searchbar from '../components/searchbar';

const Researches = ({alterSidebar}) => {
    const [Research, setResearch] = useState({
       cordinator:"",title:"",funding_agency:"",amount:"",date:""
    });
    
    const componentRef = useRef();
    
    //onclick add new button - show form
    const [Show,setShow] = useState(false) 
    
    // function for changing the states
    const handleChange = (e) => {
        //window.alert(e.target.value);
        setResearch({...Research,[e.target.name]:e.target.value});
    }

    //function for show popup when click on print button
    const [ShowPopup,setShowPopup] = useState(false) ;
    const handlePopup=()=>{
        setShowPopup(!ShowPopup)
    }  

    //handle search
    const [serchQuery,setSearchQuery]=useState("");
    const handleSearch=(query)=>{
        setSearchQuery(query);
        console.log(query);
    }

    //handel delete
    const handleDelete=async (item)=>{
        const newData = {"id":item}
        const result=await axios.post("http://localhost:5000/delete_research_de", newData,{
          headers:{"x-auth-token":localStorage.getItem("Token")}
        });
        const uiData=Data.filter(i=>i._id !==item);
        setData(uiData);
    }


    //handle update
    const handleUpdate=async (item)=>{
        let newData = {
            "cordinator":item.cordinator, 
            "title":item.title,            
            "funding_agency":item.funding_agency,            
            "amount":item.amount,
            "date":item.date, 
    }
    setResearch(newData);
    setShow(true);

    }

    const handleSubmit =async (e)=> {
        const newData = {
            "cordinator":Research.cordinator, 
            "title":Research.title,            
            "funding_agency":Research.funding_agency,            
            "amount":Research.amount,
            "date":Research.date,            
      }
        const result=await axios.post("http://localhost:5000/addrnd",newData ,{
          
          headers:{"x-auth-token":localStorage.getItem("Token")}
      });
        console.log(result.status);
        // window.alert(result.status);
        if(result.status===401){
            window.alert("some error has been accured");
        }
        else if(result.status===200) {
            setData(prev => [...prev,newData]);
            setShow(false);
            window.alert("data added successfully!");
        }
    }

    const clearform = () => {
        setResearch({
            cordinator:"",title:"",funding_agency:"",amount:"",date:""
         });
    }

    //fetching data from the database
    const [Data,setData]=useState([]);
    useEffect(()=>{
        fetchData()
    },[]);

    const fetchData=async()=>{
        
        const response =await axios.post("http://localhost:5000/getrnd",{},
        {
            headers:{"x-auth-token":localStorage.getItem("Token")}
        });
        //const resp=response.json();
        console.log(response.data);
        setData(response.data);
    }

    let filtered=Data;
    if(serchQuery){
        filtered=Data.filter(m=> m.cordinator.toLowerCase().includes(serchQuery.toLowerCase()));
    }
    return ( 
        <>
            <Searchbar value={serchQuery} alterSidebar={alterSidebar} onChange={handleSearch}/>
            {/* add new button */}
            <div className='add-btn'>
                <button className='btn' onClick={() =>{setShow(true);clearform()}}><span><AiOutlinePlus /></span>add new</button>
                <button className='btn upload-excel'><span><AiOutlinePlus /></span>upload excel file</button>
                <button className='download-btn' onClick={handlePopup}><HiPrinter/><span>print</span></button>
            </div>

            {/* popup-box for pdf & excel */}
            {ShowPopup?
                <div className='popup-box'>
                    <div className='close-btn' onClick={() =>setShowPopup(false)}><AiOutlineClose/></div>
                    <div className='print-btns'>
                        <div className='print-btn-to-pdf printBtn'>
                            <ReactToPrint
                                trigger={()=>{
                                return <button onClick={() =>{setShowPopup(false)}} ><VscFilePdf/><span>to pdf</span></button>
                                }}
                                content={()=>componentRef.current}
                                documentTitle="Research"
                                pageStyle="print"
                            />
                        </div>
                        <div className='print-btn-to-excel printBtn'><SiMicrosoftexcel/><span>to excel</span></div>            
                    </div>  
                </div>        
            :null}

            {/* showing the fetched data */}
            <div className='table-show-outer-box'>
            <h2>research projects</h2>
            <div ref={componentRef} className='showData' >
                    <table>
                        <tr>
                            <th>coordinator</th>
                            <th>title</th>
                            <th>funding agency</th>
                            <th>amount</th>
                            <th>date</th>
                            <th>edit</th>
                        </tr>                      
                        {filtered.map((item, i) => (
                            <tr key={i}>
                                <td>{item.cordinator}</td>
                                <td>{item.title}</td>
                                <td>{item.funding_agency[0]}</td>
                                <td>{item.amount}</td>
                                <td>{item.date}</td>
                                <td>
                                <button onClick={()=>handleDelete(item._id)} className=''>Delete</button>
                                <button onClick={()=>{handleDelete(item._id);handleUpdate(item) }} >Update</button>
                                </td>
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
                    <h3>add research projects details</h3>
                    <div className='close-btn' onClick={() =>setShow(false)}>
                        <AiOutlineClose/>
                    </div>
                </div>
                <div className='input-field'>
                    <input type='text' onChange={handleChange} name='cordinator' value={Research.cordinator} placeholder='coordinator'/>
                </div>
                <div className='input-field'>
                    <input type='text' onChange={handleChange} name='title' value={Research.title} placeholder='Paper Title'/>
                </div>
                <div className='input-field'>
                    <input type='text' onChange={handleChange} name='funding_agency' value={Research.funding_agency} placeholder='funding agency'/>
                </div>
                <div className='input-field'>
                    <input type='text' onChange={handleChange} name='amount' value={Research.amount} placeholder='amount'/>
                </div>
                <div className='input-field'>
                    <input type='date' onChange={handleChange} name='date' value={Research.date} placeholder='date'/>
                </div>
                
                <div className='submit'>
                    <button onClick={handleSubmit} className="btn" type="submit">Submit</button>
                </div>
                
            </div>:null}
        </>
     );
}
 
export default Researches;