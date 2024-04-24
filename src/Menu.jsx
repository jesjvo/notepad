import React, {useState, useEffect, useRef} from 'react'
import './Css/Menu.css'

//icons
import { RiFontSans, RiFontSansSerif } from "react-icons/ri";
import { TbCalendar, TbClipboardCheck, TbClock, TbDoorExit, TbFile, TbFileExport, TbFilePlus, TbFileUpload, TbRefresh, TbTextCaption, TbTrash, TbWorldUpload } from "react-icons/tb";
import { IoWarningOutline } from "react-icons/io5";

//api send
async function handleApplicationMessage(request){
  const { api } = window
  
  if(request==='exit-application'){
    await api.exitApplication();
  }

  if(request==='refresh-application'){
    await api.refreshApplication();
  }

  if(request==='open-recovery'){
    await api.openRecovery();
  }
}

//memu (editor settings)
export default function Menu({close, setSerif, setDefault, toggleSpellCheck, spellCheck, characterCount}){

  const [display, setDisplay] = useState({opacity:0, height:'fit-content'})
  const ref = useRef(null);

  useEffect(() => {
      setDisplay({opacity:1})
      const interval = setInterval(() => {
        updatePosition()
      }, 250);

      return () => clearInterval(interval);
  } , []);

  const updatePosition = () => {
    const { height } = ref.current.getBoundingClientRect()
    const { innerHeight } = window;

  if(height + 50 >= innerHeight){
    setDisplay({height:innerHeight - 50})}
  else{setDisplay({height:'fit-content'})}}

  return(
    <div className='menu'>
        <div onClick={close} className='div-menuclose' />
        <div style={{opacity:display.opacity, height:display.height, overflowY:'scroll'}} ref={ref} className='div-menu'>
          <div className='menu-fontdiv'>
            <button className='menu-fontbtn' onClick={setDefault}><RiFontSans size={20} color='black' style={{marginBottom:'5px'}}/>Default</button>
            <button className='menu-fontbtn' onClick={setSerif}><RiFontSansSerif size={20} color='black' style={{marginBottom:'5px'}}/>Serif</button>
          </div>
          <div className='divider-x' style={{marginTop:'4px'}}/>
          <div className='menu-settingdiv'>
            <p style={{margin:'4px 0 6px 12px', fontSize:'12px', fontFamily:'Arial', color:'rgba(0,0,0,.6)'}}>File Configuration</p>
            <button className='menu-settingbtn'><TbFileExport size={17} strokeWidth={1.5} style={{marginRight:'10px', marginLeft:'10px'}}/>Rename</button>
            <button className='menu-settingbtn'><TbFileUpload size={17} strokeWidth={1.5} style={{marginRight:'10px', marginLeft:'10px'}}/>Save File{characterCount<=0 ? null : <IoWarningOutline style={{position:'absolute', right:'20px'}} size={17} color='orange'/>}</button>
            <button className='menu-settingbtn'><TbFilePlus size={17} strokeWidth={1.5} style={{marginRight:'10px', marginLeft:'10px'}}/>New File</button>
            <button className='menu-settingbtn'><TbFile size={17} strokeWidth={1.5} style={{marginRight:'10px', marginLeft:'10px'}}/>Open File</button>
            <div className='divider-x' style={{marginTop:'4px', marginBottom:'4px'}}/>
            <button className='menu-settingbtn'><TbTrash size={17} strokeWidth={1.5} style={{marginRight:'10px', marginLeft:'10px'}}/>Delete</button>

            <div className='divider-x' style={{marginTop:'4px', marginBottom:'4px'}}/>
            <p style={{margin:'4px 0 6px 12px', fontSize:'12px', fontFamily:'Arial', color:'rgba(0,0,0,.6)'}}>File Information</p>
            <button className='menu-settingbtn'><TbTextCaption size={17} strokeWidth={1.5} style={{marginRight:'10px', marginLeft:'10px'}}/>Words<div style={{position:'absolute', right:'20px', color:'rgba(0,0,0,0.4)'}}>{characterCount}</div></button>
            <button className='menu-settingbtn'><TbClock size={17} strokeWidth={1.5} style={{marginRight:'10px', marginLeft:'10px'}}/>Updated</button>
            <button className='menu-settingbtn'><TbCalendar size={17} strokeWidth={1.5} style={{marginRight:'10px', marginLeft:'10px'}}/>Created</button>
            <button className='menu-settingbtn' onClick={toggleSpellCheck}><TbClipboardCheck size={17} strokeWidth={1.5} style={{marginRight:'10px', marginLeft:'10px'}}/>Spell Check</button>

            <div className='divider-x' style={{marginTop:'4px', marginBottom:'4px'}}/>
            <p style={{margin:'4px 0 6px 12px', fontSize:'12px', fontFamily:'Arial', color:'rgba(0,0,0,.6)'}}>System</p>
            <button className='menu-settingbtn' onClick={()=>{handleApplicationMessage('open-recovery')}}><TbWorldUpload size={17} strokeWidth={1.5} style={{marginRight:'10px', marginLeft:'10px'}}/>Recovery</button>
            <button className='menu-settingbtn' onClick={()=>{handleApplicationMessage('refresh-application')}}><TbRefresh size={17} strokeWidth={1.5} style={{marginRight:'10px', marginLeft:'10px'}}/>Refresh</button>
            <button className='menu-settingbtn' onClick={()=>{handleApplicationMessage('exit-application')}}><TbDoorExit size={17} strokeWidth={1.5} style={{marginRight:'10px', marginLeft:'10px'}}/>Exit</button>
        </div>
      </div>
    </div>
  )
}