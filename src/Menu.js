import React, {useState, useEffect, useRef} from 'react'

import './Css/Menu.css'

//icons
import { RiFontSans, RiFontSansSerif } from "react-icons/ri";
import { TbClipboardText, TbFile, TbFileExport, TbFilePlus, TbTextCaption, TbTrash } from "react-icons/tb";
import { GoRepoPush } from "react-icons/go";


const ipcRenderer = window.require("electron").ipcRenderer;

export default function Menu({close, setSerif, setDefault, wordCount}){

    const [display, setDisplay] = useState({opacity:0})
    const ref = useRef(null);

    useEffect(() => {
        setDisplay({opacity:1})
    } , []);

  return(
  <>
    <div  className='menu'>
        <div onClick={close} className='div-menuclose' />
        <div style={{opacity:display.opacity}} ref={ref} className='div-menu'>
          <div className='menu-fontdiv'>
            <button className='menu-fontbtn' onClick={setDefault}><RiFontSans size={20} color='black' style={{marginBottom:'5px'}}/>Default</button>
            <button className='menu-fontbtn' onClick={setSerif}><RiFontSansSerif size={20} color='black' style={{marginBottom:'5px'}}/>Serif</button>
          </div>
          <div className='divider-x' style={{marginTop:'5px'}}/>
          <div className='menu-settingdiv'>
            <p style={{margin:'4px 0 6px 12px', fontSize:'12px', fontFamily:'Arial', color:'rgba(0,0,0,.6)'}}>File Configuration</p>
            <button className='menu-settingbtn'><TbTrash size={17} strokeWidth={1.5} style={{marginRight:'10px', marginLeft:'10px'}}/>Delete</button>
            <button className='menu-settingbtn'><TbFilePlus size={17} strokeWidth={1.5} style={{marginRight:'10px', marginLeft:'10px'}}/>New File</button>
            <button className='menu-settingbtn'><TbFile size={17} strokeWidth={1.5} style={{marginRight:'10px', marginLeft:'10px'}}/>Open File</button>
            <button className='menu-settingbtn'><TbFileExport size={17} strokeWidth={1.5} style={{marginRight:'10px', marginLeft:'10px'}}/>Rename</button>
          </div>
        </div>
    </div>
  </>
  )
}