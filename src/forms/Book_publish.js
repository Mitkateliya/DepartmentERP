import React, { useState,useEffect,useRef } from 'react';
import './form.css';
import '../components/showData.css';
import { AiOutlineClose } from "react-icons/ai";
import { AiOutlinePlus } from "react-icons/ai";
import { HiPrinter } from "react-icons/hi";
import axios from 'axios';
import ReactToPrint from 'react-to-print';

const Book_publish = () => {
    const [Book, setBook] = useState({
        title:"",author:"",co_author:"",publisher:"",ISBN:""
    });

    const componentRef = useRef();

    //onclick add new button - show form
    const [Show,setShow] = useState(false) 
    
    // function for changing the states
    const handleChange = (e) => {
        //window.alert(e.target.value);
        setBook({...Book,[e.target.name]:e.target.value});
    }

    const handleSubmit =async (e)=> {
        const newData = {
            "title":Book.title, 
            "author":Book.author,
            "co_author":Book.co_author,
            "publisher":Book.publisher,
            "ISBN":Book.ISBN
      }
        const result=await axios.post("http://localhost:5000/addbook",newData,{
          
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
        
        const response =await axios.post("http://localhost:5000/getbook",{},
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
                <h2>book publish</h2>
                    <table>
                        <tr>
                            <th>book title</th>
                            <th>author</th>
                            <th>co author</th>
                            <th>publisher</th>
                            <th>ISBN</th>
                        </tr>                      
                        {Data.map((item, i) => (
                            <tr key={i}>
                                <td>{item.title}</td>
                                <td>{item.author}</td>
                                <td>{item.co_author[0]}</td>
                                <td>{item.publisher}</td>
                                <td>{item.ISBN}</td>
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
                documentTitle="book publish"
                pageStyle="print"
                />            
                </div>
            {/* add book publish details */}
            {Show?<div className='forms'>
                <div className='form-header'>
                    <h3>book publish details</h3>
                    <div className='close-btn' onClick={() =>setShow(false)}>
                        <AiOutlineClose/>
                    </div>
                </div>
                <div className='input-field'>
                    <input type='text' onChange={handleChange} name='title' value={Book.title} placeholder='book Title'/>
                </div>
                <div className='input-field'>
                    <input type='text' onChange={handleChange} name='author' value={Book.author} placeholder='author'/>
                </div>
                <div className='input-field'>
                    <input type='text' onChange={handleChange} name='co_author' value={Book.co_author} placeholder='co author'/>
                </div>
                <div className='input-field'>
                    <input type='text' onChange={handleChange} name='publisher' value={Book.publisher} placeholder='publisher'/>
                </div>
                <div className='input-field'>
                    <input type='text' onChange={handleChange} name='ISBN' value={Book.ISBN} placeholder='ISBN'/>
                </div>
                <div className='submit'>
                    <button onClick={handleSubmit} className="btn" type="submit">Submit</button>
                </div>
                
            </div>:null}
        </>
     );
}
 
export default Book_publish;