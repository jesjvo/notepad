import React, {useState, useEffect, useRef} from 'react'

import './Css/Menu.css'

//icons
import { RiFontSans, RiFontSansSerif } from "react-icons/ri";
import {  TbDoorExit, TbFile, TbFileExport, TbFilePlus, TbFileUpload, TbRefresh, TbTrash, TbWorldUpload } from "react-icons/tb";


const ipcRenderer = window.require("electron").ipcRenderer;

export default function Menu({close, setSerif, setDefault}){

  const [display, setDisplay] = useState({opacity:0, height:'fit-content'})
  const ref = useRef(null);

  useEffect(() => {
      setDisplay({opacity:1})
      const interval = setInterval(() => {
        updatePosition()
      }, 500);

      return () => clearInterval(interval);
  } , []);

  const updatePosition = () => {
    const { height } = ref.current.getBoundingClientRect()
    const { innerHeight } = window;

  if(height + 50 >= innerHeight){
    setDisplay({height:innerHeight - 60})
  }else{
    setDisplay({height:'fit-content'})
  }
  }

  return(
  <>
    <div  className='menu'>
        <div onClick={close} className='div-menuclose' />
        <div style={{opacity:display.opacity, height:display.height, overflowY:'scroll'}} ref={ref} className='div-menu'>
          <div className='menu-fontdiv'>
            <button className='menu-fontbtn' onClick={setDefault}><RiFontSans size={20} color='black' style={{marginBottom:'5px'}}/>Default</button>
            <button className='menu-fontbtn' onClick={setSerif}><RiFontSansSerif size={20} color='black' style={{marginBottom:'5px'}}/>Serif</button>
          </div>
          <div className='divider-x' style={{marginTop:'5px'}}/>
          <div className='menu-settingdiv'>
            <p style={{margin:'4px 0 6px 12px', fontSize:'12px', fontFamily:'Arial', color:'rgba(0,0,0,.6)'}}>File Configuration</p>
            <button className='menu-settingbtn'><TbFileExport size={17} strokeWidth={1.5} style={{marginRight:'10px', marginLeft:'10px'}}/>Rename</button>
            <button className='menu-settingbtn'><TbFileUpload size={17} strokeWidth={1.5} style={{marginRight:'10px', marginLeft:'10px'}}/>Save File</button>
            <button className='menu-settingbtn'><TbFilePlus size={17} strokeWidth={1.5} style={{marginRight:'10px', marginLeft:'10px'}}/>New File</button>
            <button className='menu-settingbtn'><TbFile size={17} strokeWidth={1.5} style={{marginRight:'10px', marginLeft:'10px'}}/>Open File</button>
            <div className='divider-x' style={{marginTop:'4px', marginBottom:'4px'}}/>
            <button className='menu-settingbtn'><TbTrash size={17} strokeWidth={1.5} style={{marginRight:'10px', marginLeft:'10px'}}/>Delete</button>

            <div className='divider-x' style={{marginTop:'4px', marginBottom:'4px'}}/>
            <p style={{margin:'4px 0 6px 12px', fontSize:'12px', fontFamily:'Arial', color:'rgba(0,0,0,.6)'}}>System</p>
            <button className='menu-settingbtn'><TbWorldUpload size={17} strokeWidth={1.5} style={{marginRight:'10px', marginLeft:'10px'}}/>Backups</button>
            <button className='menu-settingbtn'><TbRefresh size={17} strokeWidth={1.5} style={{marginRight:'10px', marginLeft:'10px'}}/>Refresh</button>
            <button className='menu-settingbtn'><TbDoorExit size={17} strokeWidth={1.5} style={{marginRight:'10px', marginLeft:'10px'}}/>Exit</button>
          </div>
        </div>
    </div>
  </>
  )
}