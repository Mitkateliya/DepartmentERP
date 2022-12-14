import React, { useState,useEffect,useRef } from 'react';
import './form.css';
import '../components/showData.css';
import { AiOutlineClose } from "react-icons/ai";
import { AiOutlinePlus } from "react-icons/ai";
import { HiPrinter } from "react-icons/hi";
import { VscFilePdf } from "react-icons/vsc";
import { SiMicrosoftexcel } from "react-icons/si";
import axios from 'axios';
import Searchbar from '../components/searchbar';
import ReactToPrint from 'react-to-print';


const Patents = ({alterSidebar}) => {
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

    //function for show popup when click on print button
    const [ShowPopup,setShowPopup] = useState(false) ;
    const handlePopup=()=>{
        setShowPopup(!ShowPopup)
    }  

    

    //handel delete
    const handleDelete=async (item)=>{
        const newData = {"id":item}
        const result=await axios.post("http://localhost:5000/delete_patent", newData,{
          headers:{"x-auth-token":localStorage.getItem("Token")}
        });
        const uiData=Data.filter(i=>i._id !==item);
        setData(uiData);
    }

    //handle update
    const handleUpdate=async (item)=>{
        let newData = {
            "faculty":item.faculty[0], 
            "title":item.title,
            "application_no":item.application_no,
            "date":item.date,
            "status":item.status
    }
    setPatent(newData);
    setShow(true);

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
        // window.alert(result.status);
        if(result.status===401){
            window.alert("some error has been accured");
        }
        else if(result.status===200)
        {
            setData(prev=>[...prev,newData]);
            setShow(false);
            window.alert("data added successfully!");
        }
    }

    const clearform = () => {
        setPatent({
            faculty:"", title:"",application_no:"",date:"",status:""
        });
    }

    //fetching data from the database
    const [Data,setData]=useState([]);
    const [filtered,setFiltered]=useState([]);
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
        setFiltered(response.data);
    } 

    let searchdata=Data;

    //search handle
    const [searchQuery,setSearchQuery]=useState("");
    
    const handleSearch=(query)=>{
        setSearchQuery(query);
        console.log(query);
    
        if(query){
            
            searchdata=filtered.filter(m=> m.faculty[0].toLowerCase().includes(query.toLowerCase()));
            setFiltered(searchdata);
        }
        else{
            setFiltered(Data);
        }
    }

    //handle filter
const [filter_items,set_Filter_item] = useState([
    {
        "id":1,
        "name":"2022",
        "isChecked":false
    },
    {
        "id":2,
        "name":"2021",
        "isChecked":false
    },
    {
        "id":3,
        "name":"2020",
        "isChecked":false
    }
]);

//handle filter function
const handleFilter = (x) => {
    //let filtered_f=searchdata;
     console.log(x);
     filter_items.map(m=>{
    if(m.id===x.id)
        {
        m.isChecked= !(m.isChecked);
        } 
    })
    set_Filter_item(filter_items);
    if(filter_items[0].isChecked== true ){
        searchdata=searchdata.filter(m=> m.date.includes(filter_items[0].name));
        setFiltered(searchdata);
   }
    if(filter_items[1].isChecked== true){
    searchdata=searchdata.filter(m=> m.date.includes(filter_items[1].name));
    setFiltered(searchdata);
   }
   if(filter_items[2].isChecked== true){
    searchdata=searchdata.filter(m=> m.date.includes(filter_items[2].name));
    setFiltered(searchdata);
   }
   
   else{
    setFiltered(searchdata);
   }
   
}

    return ( 
        <>
            <Searchbar value={searchQuery} alterSidebar={alterSidebar} onChange={handleSearch} filterItem={filter_items} onFilter={handleFilter}/>
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
                                documentTitle="Patents"
                                pageStyle="print"
                            />
                        </div>
                        <div className='print-btn-to-excel printBtn'><SiMicrosoftexcel/><span>to excel</span></div>            
                    </div>  
                </div>        
            :null}

            <div className='table-show-outer-box'>
            <h2>Patents</h2>
            <div ref={componentRef} className='showData' >
            <table>
                <tr>
                    <th>Faculty</th>
                    <th>title</th>
                    <th>Application no</th>
                    <th>date</th>
                    <th>Status</th>
                    <th>edit</th>
                </tr>
                  {filtered.map((item, i) => (
                    <tr key={i}>
                        <td>{item.faculty}</td>
                        <td>{item.title}</td>
                        <td>{item.application_no}</td>
                        <td>{item.date}</td>
                        <td>{item.status}</td>
                        <td>
                                <button onClick={()=>handleDelete(item._id)} className=''>Delete</button>
                                <button onClick={()=>{handleDelete(item._id);handleUpdate(item) }} >Update</button>
                                </td>
                    </tr>
                ))}  
            </table>
            </div>

            {/* print button */}
            {/* <ReactToPrint
                trigger={()=>{
                    return <button className='download-btn' ><HiPrinter/>print </button>
                }}
                content={()=>componentRef.current}
                documentTitle="events"
                pageStyle="print"
                />              */}
            </div>

            {/* add paper details */}
            {Show?<div className='forms'>
                <div className='form-header'>
                    <h3>Patent details</h3>
                    <div className='close-btn' onClick={() =>setShow(false)}>
                        <AiOutlineClose/>
                    </div>
                </div>
                <div className='input-grid'>
                    <div className='input-field'>
                        <input onChange={handleChange} type='text' name='title' value={Patent.title} placeholder='title'/>
                    </div>
                    <div className='input-field'>
                        <input onChange={handleChange} type='text' name='faculty' value={Patent.faculty} placeholder='faculty'/>
                    </div>
                </div>

                <div className='input-field'>
                    <input onChange={handleChange} type='text' name='application_no' value={Patent.application_no} placeholder='application number'/>
                </div>
                <div className='input-field'>
                    <p className='input-title'>date:</p>
                    <input onChange={handleChange} type='date' name='date' value={Patent.date} placeholder='date'/>
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