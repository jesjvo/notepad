import React, {useState, useEffect, useRef} from 'react'

import './Css/Menu.css'

//icons
import { RiFontSans, RiFontSansSerif } from "react-icons/ri";
import { TbClipboardCheck, TbClock, TbDoorExit, TbFile, TbFileExport, TbFilePlus, TbFileUpload, TbRefresh, TbTrash, TbWorldUpload } from "react-icons/tb";
import { IoWarningOutline, IoCheckmarkOutline } from "react-icons/io5";

//global functions
async function handleApplicationMessage(request, promise){
  const { myApp } = window
  if(request==='exit-application'){
  const closeApplication = await myApp.exitApplication(promise);
  }
  if(request==='refresh-application'){
    const refreshApplication = await myApp.refreshApplication(promise);
    }
}

//memu (editor settings)
export default function Menu({close, setSerif, setDefault, characterCount}){

  const [display, setDisplay] = useState({opacity:0, height:'fit-content'})
  const [isSaved, setSave] = useState({saved:false})
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
            <button className='menu-settingbtn'><TbFilePlus size={17} strokeWidth={1.5} style={{marginRight:'10px', marginLeft:'10px'}}/>New File {isSaved.saved || characterCount<=0 ? <IoCheckmarkOutline style={{position:'absolute', right:'20px'}} size={17} color='green'/> : <IoWarningOutline style={{position:'absolute', right:'20px'}} size={17} color='orange'/>}</button>
            <button className='menu-settingbtn'><TbFile size={17} strokeWidth={1.5} style={{marginRight:'10px', marginLeft:'10px'}}/>Open File {isSaved.saved || characterCount<=0 ? <IoCheckmarkOutline style={{position:'absolute', right:'20px'}} size={17} color='green'/> : <IoWarningOutline style={{position:'absolute', right:'20px'}} size={17} color='orange'/>}</button>
            <div className='divider-x' style={{marginTop:'4px', marginBottom:'4px'}}/>
            <button className='menu-settingbtn'><TbTrash size={17} strokeWidth={1.5} style={{marginRight:'10px', marginLeft:'10px'}}/>Delete</button>


            <div className='divider-x' style={{marginTop:'4px', marginBottom:'4px'}}/>
            <p style={{margin:'4px 0 6px 12px', fontSize:'12px', fontFamily:'Arial', color:'rgba(0,0,0,.6)'}}>File Information</p>
            <button className='menu-settingbtn'><TbClock size={17} strokeWidth={1.5} style={{marginRight:'10px', marginLeft:'10px'}}/>Words<div style={{position:'absolute', right:'20px', color:'rgba(0,0,0,0.4)'}}>{characterCount}</div></button>
            <button className='menu-settingbtn'><TbClock size={17} strokeWidth={1.5} style={{marginRight:'10px', marginLeft:'10px'}}/>Updated</button>
            <button className='menu-settingbtn'><TbClock size={17} strokeWidth={1.5} style={{marginRight:'10px', marginLeft:'10px'}}/>Created</button>

            <div className='divider-x' style={{marginTop:'4px', marginBottom:'4px'}}/>
            <p style={{margin:'4px 0 6px 12px', fontSize:'12px', fontFamily:'Arial', color:'rgba(0,0,0,.6)'}}>System</p>
            <button className='menu-settingbtn'><TbClipboardCheck size={17} strokeWidth={1.5} style={{marginRight:'10px', marginLeft:'10px'}}/>Spell Check</button>
            <button className='menu-settingbtn'><TbWorldUpload size={17} strokeWidth={1.5} style={{marginRight:'10px', marginLeft:'10px'}}/>Recovery</button>
            <button className='menu-settingbtn' onClick={()=>{handleApplicationMessage('refresh-application', true)}}><TbRefresh size={17} strokeWidth={1.5} style={{marginRight:'10px', marginLeft:'10px'}}/>Refresh {isSaved.saved || characterCount<=0 ? <IoCheckmarkOutline style={{position:'absolute', right:'20px'}} size={17} color='green'/> : <IoWarningOutline style={{position:'absolute', right:'20px'}} size={17} color='orange'/>}</button>
            <button className='menu-settingbtn' onClick={()=>{handleApplicationMessage('exit-application', true)}}><TbDoorExit size={17} strokeWidth={1.5} style={{marginRight:'10px', marginLeft:'10px'}}/>Exit {isSaved.saved || characterCount<=0 ? <IoCheckmarkOutline style={{position:'absolute', right:'20px'}} size={17} color='green'/> : <IoWarningOutline style={{position:'absolute', right:'20px'}} size={17} color='orange'/>}</button>
          </div>
        </div>
    </div>
  </>
  )
}