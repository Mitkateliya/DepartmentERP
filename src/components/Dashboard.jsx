import React, { Component, useState,useEffect } from 'react';
import Sidebar from './sidebar';
import Header from './header';
import Content from './content';
import './dashboard.css';
import { useNavigate } from 'react-router-dom';


const Dashboard = ({Token,setToken}) => {
  
    /** xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx */
    const navigate = useNavigate();
    const [width, setWidth] = useState(window.innerWidth);

    function handleWindowSizeChange() {
          setWidth(window.innerWidth);
        }

    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        }
    }, []);

    const isMobile = width <= 768;
    /** xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx */


    const [category,setCategory]=useState ('')
    const [showSidebar,setShowSidebar]= useState (false)

    const onChangeCategory=(_category)=>{
        setCategory(_category);
    }


    const alterSidebar = () => {
      // console.log('AlterSidebar: '+showSidebar)
      setShowSidebar(!showSidebar)
    }
    useEffect(() => {
      if(Token === '') {
        window.alert("your session is expired! please login again");
        navigate('/login');
      }
    });
    
    return (
      <>
                <Header setToken = {setToken}/>
                <div className='dashboard'>
                    <Sidebar isMobile={isMobile} onChangeCategory={onChangeCategory} alterSidebar = {alterSidebar} showSidebar={showSidebar} />
                    <Content category={category} alterSidebar = {alterSidebar} token = {Token}/>
                </div>
      </>
  )}



export default Dashboard;

