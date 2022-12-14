import React, { useState,useEffect,useRef } from 'react';
import './form.css';
import '../components/showData.css';
import { AiOutlineClose } from "react-icons/ai";
import { AiOutlinePlus } from "react-icons/ai";
import { HiPrinter } from "react-icons/hi";
import { VscFilePdf } from "react-icons/vsc";
import { SiMicrosoftexcel } from "react-icons/si";
import Searchbar from '../components/searchbar';
import axios from 'axios';
import ReactToPrint from 'react-to-print';

const Events = ({alterSidebar}) => {
    const [Event, setEvent] = useState({
        type:"Seminar", cordinator:"",title:"",start_date:"",end_date:"",cost:"",no_of_participants:"",sponsor:"",for_whome:"Faculties",report:"",approval_letter:"",attendance_sheet:"",photos:""
    });

    const componentRef = useRef();
    
    //onclick add new button - show form
    const [Show,setShow] = useState(false) 
    
    // function for changing the states
    const handleChange = (e) => {
        //window.alert(e.target.value);
        setEvent({...Event,[e.target.name]:e.target.value});
    }

    //function for show popup when click on print button
    const [ShowPopup,setShowPopup] = useState(false) ;
    const handlePopup=()=>{
        setShowPopup(!ShowPopup)
    }

    //handle search
    

    //handel delete
    const handleDelete=async (item)=>{
        const newData = {"id":item}
        const result=await axios.post("http://localhost:5000/delete_event", newData,{
          headers:{"x-auth-token":localStorage.getItem("Token")}
        });
        const uiData=Data.filter(i=>i._id !==item);
        setData(uiData);
    }

    //handle update
    const handleUpdate=async (item)=>{
        let newData = {
            "type":item.type, 
            "cordinator":item.cordinator,
            "title":item.title,
            "start_date":item.start_date,
            "end_date":item.end_date,
            "cost":item.cost,
            "no_of_participants":item.no_of_participants,
            "sponsor":item.sponsor,
            "for_whome":item.for_whome,
            "report":item.report,
            "approval_letter":item.approval_letter,
            "attendance_sheet":item.attendance_sheet,
            "photos":item.photos,
    }
    setEvent(newData);
    setShow(true);

    }
    
    const handleSubmit =async (e)=> {
        const newData = {
            "type":Event.type, 
            "cordinator":Event.cordinator,
            "title":Event.title,
            "start_date":Event.start_date,
            "end_date":Event.end_date,
            "cost":Event.cost,
            "no_of_participants":Event.no_of_participants,
            "sponsor":Event.sponsor,
            "for_whome":Event.for_whome,
            "report":Event.report,
            "approval_letter":Event.approval_letter,
            "attendance_sheet":Event.attendance_sheet,
            "photos":Event.photos,
      }

        const result=await axios.post("http://localhost:5000/addevent", newData,{
          
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
        setEvent({
            type:"Seminar", cordinator:"",title:"",start_date:"",end_date:"",cost:"",no_of_participants:"",sponsor:"",for_whome:"Faculties",report:"",approval_letter:"",attendance_sheet:"",photos:""
        });
    }

    //fetching data from the database
    const [Data,setData]=useState([]);
    const [filtered,setFiltered]=useState([]);
    useEffect(()=>{
        // setToken(localStorage.getItem("Token"))
        fetchData()
    },[]);
    
    const fetchData=async()=>{
        
        const response =await axios.post("http://localhost:5000/getevent",{},
        {
            headers:{"x-auth-token":localStorage.getItem("Token")}
        });
        //const resp=response.json();
        console.log(response.data);
        setData(response.data);
        setFiltered(response.data);
    }

    const [filter_items,set_Filter_item] = useState([
        {
            "id":1,
            "name":"Seminar",
            "isChecked":false
        },
        {
            "id":2,
            "name":"Workshop",
            "isChecked":false
        },
        {
            "id":3,
            "name":"Conference",
            "isChecked":false
        },
        {
            "id":4,
            "name":"Webinar",
            "isChecked":false
        },
        {
            "id":5,
            "name":"expert talk",
            "isChecked":false
        }
    ]);

    //let filtered=Data;
    let searchdata=Data;

//search handle
const [searchQuery,setSearchQuery]=useState("");

const handleSearch=(query)=>{
    setSearchQuery(query);
    console.log(query);

    if(query){
        
        searchdata=filtered.filter(m=> m.cordinator.toLowerCase().includes(query.toLowerCase()));
        setFiltered(searchdata);
    }
    else{
        setFiltered(Data);
    }
}

//handle filter
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
        searchdata=searchdata.filter(m=> m.type==filter_items[0].name);
        setFiltered(searchdata);
   }
    if(filter_items[1].isChecked== true){
    searchdata=searchdata.filter(m=> m.type==filter_items[1].name);
    setFiltered(searchdata);
   }
   if(filter_items[2].isChecked== true){
    searchdata=searchdata.filter(m=> m.type==filter_items[2].name);
    setFiltered(searchdata);
   }
   if(filter_items[3].isChecked== true){
    searchdata=searchdata.filter(m=> m.type==filter_items[3].name);
    setFiltered(searchdata);
   }
   if(filter_items[4].isChecked== true){
    searchdata=searchdata.filter(m=> m.type==filter_items[4].name);
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
                                documentTitle="event organized"
                                pageStyle="print"
                            />
                        </div>
                        <div className='print-btn-to-excel printBtn'><SiMicrosoftexcel/><span>to excel</span></div>            
                    </div>  
                </div>        
            :null}

            {/* showing the fetched data */}
            <div className='table-show-outer-box'>
            <h2>event organized</h2>
            <div ref={componentRef} className='showData' >
                
                    <table>
                        <tr>
                            <th>type</th>
                            <th>coordinator</th>
                            <th>title</th>
                            <th>start date</th>
                            <th>end date</th>
                            <th>cost(expenses)</th>
                            <th>number of participants</th>
                            <th>sponsors</th>
                            <th>audience</th>
                            <th>report</th>
                            <th>approval letter</th>
                            <th>attendance sheet</th>
                            <th>photos</th>
                            <th>edit</th>
                        </tr>                      
                        {filtered.map((item, i) => (
                            <tr key={i}>
                                <td>{item.type}</td>
                                <td>{item.cordinator}</td>
                                <td>{item.title}</td>
                                <td>{item.start_date}</td>
                                <td>{item.end_date}</td>
                                <td>{item.cost}</td>
                                <td>{item.no_of_participants}</td>
                                <td>{item.sponsor[0]}</td>
                                <td>{item.for_whome}</td>
                                <td>{item.report}</td>
                                <td>{item.approval_letter}</td>
                                <td>{item.attendance_sheet}</td>
                                <td>{item.photos}</td>
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
                />             */}
            </div>

            {/* add Event details */}
            {Show?<div className='forms event-form'>
                <div className='form-header'>
                    <h3>add organized events details</h3>
                    <div className='close-btn' onClick={() =>setShow(false)}>
                        <AiOutlineClose/>
                    </div>
                </div>
                <div className='input-field'>
                    <p className='input-title'>choose a type:</p>
                    <select name='type' onChange={handleChange} value={Event.type} className='select-options'>
                        <option value="Seminar">Seminar</option>
                        <option value="Workshop">Workshop</option>
                        <option value="Conference">Conference</option>
                        <option value="Webinar">Webinar</option>
                        <option value="expert talk">expert talk</option>
                    </select>
                </div>
                <div className='input-grid'>
                    <div className='input-field'>
                        <input type='text' onChange={handleChange} name='title' value={Event.title} placeholder='title'/>
                    </div>
                    <div className='input-field'>
                        <input type='text' onChange={handleChange} name='cordinator' value={Event.cordinator} placeholder='coordinator'/>
                    </div>
                </div>
                
                <div className='input-grid'>
                    <div className='input-field'>
                        <p className='input-title'>event start date:</p>
                        <input type='date' onChange={handleChange} name='start_date' value={Event.start_date} placeholder='start date'/>
                    </div>
                    <div className='input-field'>
                        <p className='input-title'>event end date:</p>
                        <input type='date' onChange={handleChange} name='end_date' value={Event.end_date} placeholder='end date'/>
                    </div>
                </div>    
                <div className='input-field'>
                    <input type='text' onChange={handleChange} name='no_of_participants' value={Event.no_of_participants} placeholder='number of participants'/>
                </div>

                <div className='input-grid'>
                    <div className='input-field'>
                        <input type='text' onChange={handleChange} name='cost' value={Event.cost} placeholder='cost (expenses)'/>
                    </div>
                    <div className='input-field'>
                        <input type='text' onChange={handleChange} name='sponsor' value={Event.sponsor} placeholder='sponsors'/>
                    </div>
                </div>
                <div className='input-field'>
                    <p className='input-title'>participants:</p>
                    <select name='for_whome' onChange={handleChange} value={Event.for_whome} className='select-options'>
                        <option value="faculties">faculties</option>
                        <option value="students">student</option>
                    </select>
                </div>

                <div className='input-grid'>
                    <div className='file-input'>
                        <p className='input-title'>add a report:</p>
                        <input type='file' onChange={handleChange} name='report' value={Event.report}/>
                    </div>
                    <div className='file-input'>
                        <p className='input-title'>add a approval letter:</p>
                        <input type='file' onChange={handleChange} name='report' value={Event.approval_letter}/>
                    </div>
                </div>

                <div className='input-grid'>
                    <div className='file-input'>
                        <p className='input-title'>add attendance sheet:</p>
                        <input type='file' onChange={handleChange} name='report' value={Event.attendance_sheet}/>
                    </div>
                    <div className='file-input'>
                        <p className='input-title'>add a photos:</p>
                        <input type='file' onChange={handleChange} name='report' value={Event.photos}/>
                    </div>
                </div>

                <div className='submit'>
                    <button onClick={handleSubmit} className="btn" type="submit">Submit</button>
                </div>
                
            </div>:null}
        </>
     );
}
 
export default Events;