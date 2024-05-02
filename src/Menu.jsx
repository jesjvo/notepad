import React, {useState, useEffect, useRef} from 'react'
import './Css/Menu.css'

//icons
import { RiFontMono, RiFontSans, RiFontSansSerif } from "react-icons/ri";
import { TbCalendar, TbClipboardCheck, TbClock, TbDoorExit, TbFile, TbFileExport, TbFilePlus, TbFileUpload, TbRefresh, TbReload, TbTextCaption, TbTrash, TbWorldUpload } from "react-icons/tb";
import { IoWarningOutline } from "react-icons/io5";

//api send
async function handleApplicationMessage(request){
  const { api } = window

  if(request==='get-menu-info'){
    const result = await api.openMenu();
    return result
  }

  if(request==='delete-file'){
    await api.deleteFile();
  }

  if(request==='new-file'){
    await api.newFile();
  }
  
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
export default function Menu({close, setSerif, setDefault, setMono, toggleSpellCheck, spellCheck, toggleAutoSave, autoSave, characterCount}){
  const [modifiedDate, setModifiedDate] = useState('Invalid')
  const [createdDate, setCreatedDate] = useState('Invalid')
  const [isCurrentFile, setCurrentFile] = useState(false)
  
  const [display, setDisplay] = useState({opacity:0, height:'fit-content'})
  const ref = useRef(null);

  useEffect(() => {
    const result = handleApplicationMessage('get-menu-info') // result[0] -> is file, result[1] -> modifiedDate, result[2] -> createdDate
    result.then(function(result) {return result}).then((result) => {
      if(result[0]){
        setModifiedDate(result[1]); setCreatedDate(result[2]); setCurrentFile(true);
      }
    })
    
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
          { isCurrentFile ? null : 
            <>
              <div style={{display:'flex', flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                <IoWarningOutline size={13} color='rgb(200, 120, 80)'/>
                <p style={{margin:'4px 0 4px 8px', fontSize:'13px', fontFamily:'Arial', color:'rgba(0,0,0,.6)'}}>No file found</p>
              </div>
              <div className='divider-x'/>
            </>
          }
          <div className='menu-fontdiv'>
            <button className='menu-fontbtn' onClick={setDefault}><RiFontSans size={20} color='black' style={{marginBottom:'4px'}}/>Default</button>
            <button className='menu-fontbtn' onClick={setSerif}><RiFontSansSerif size={20} color='black' style={{marginBottom:'4px'}}/>Serif</button>
            <button className='menu-fontbtn' onClick={setMono}><RiFontMono size={20} color='black' style={{marginBottom:'4px'}}/>Mono</button>
          </div>
          <div className='divider-x'/>
          <div className='menu-settingdiv'>
            <p style={{margin:'4px 0 6px 12px', fontSize:'12px', fontFamily:'Arial', color:'rgba(0,0,0,.6)'}}>File Configuration</p>
            <button className='menu-settingbtn' disabled={isCurrentFile ? false : true}><TbFileExport size={17} strokeWidth={1.5} style={{marginRight:'10px', marginLeft:'10px'}}/>Rename</button>
            <button className='menu-settingbtn'><TbFileUpload size={17} strokeWidth={1.5} style={{marginRight:'10px', marginLeft:'10px'}}/>Save File</button>
            <button className='menu-settingbtn' onClick={()=>{handleApplicationMessage('new-file')}}><TbFilePlus size={17} strokeWidth={1.5} style={{marginRight:'10px', marginLeft:'10px'}}/>New File</button>
            <button className='menu-settingbtn' disabled={isCurrentFile ? false : true}><TbFile size={17} strokeWidth={1.5} style={{marginRight:'10px', marginLeft:'10px'}}/>Open File</button>
            <button className='menu-settingbtn' disabled={isCurrentFile ? false : true} onClick={()=>{handleApplicationMessage('delete-file')}}><TbTrash size={17} strokeWidth={1.5} style={{marginRight:'10px', marginLeft:'10px'}}/>Delete</button>

            <div className='divider-x' style={{marginTop:'4px', marginBottom:'4px'}}/>
            <p style={{margin:'4px 0 6px 12px', fontSize:'12px', fontFamily:'Arial', color:'rgba(0,0,0,.6)'}}>File Information</p>
            <button className='menu-settingbtn'><TbTextCaption size={17} strokeWidth={1.5} style={{marginRight:'10px', marginLeft:'10px'}}/>Words<div style={{position:'absolute', right:'20px', color:'rgba(0,0,0,0.4)'}}>{characterCount}</div></button>
            <button className='menu-settingbtn'><TbCalendar size={17} strokeWidth={1.5} style={{marginRight:'10px', marginLeft:'10px'}}/>Created<div style={{position:'absolute', right:'20px', color:'rgba(0,0,0,0.4)'}}>{modifiedDate}</div></button>
            <button className='menu-settingbtn'><TbClock size={17} strokeWidth={1.5} style={{marginRight:'10px', marginLeft:'10px'}}/>Modified<div style={{position:'absolute', right:'20px', color:'rgba(0,0,0,0.4)'}}>{createdDate}</div></button>
            <button className='menu-settingbtn' onClick={toggleSpellCheck}><TbClipboardCheck size={17} strokeWidth={1.5} style={{marginRight:'10px', marginLeft:'10px'}}/>Spell Check{spellCheck ? <div style={{position:'absolute', right:'20px',  color:'rgb(90, 160, 80)'}}>On</div> : <div style={{position:'absolute', right:'20px', color:'rgb(200, 80, 80)'}}>Off</div>}</button>

            <div className='divider-x' style={{marginTop:'4px', marginBottom:'4px'}}/>
            <p style={{margin:'4px 0 6px 12px', fontSize:'12px', fontFamily:'Arial', color:'rgba(0,0,0,.6)'}}>System</p>
            <button className='menu-settingbtn' disabled={isCurrentFile ? false : true} onClick={toggleAutoSave}><TbReload size={17} strokeWidth={1.5} style={{marginRight:'10px', marginLeft:'10px'}}/>Autosave{autoSave ? <div style={{position:'absolute', right:'20px',  color:'rgb(90, 160, 80)'}}>On</div> : <div style={{position:'absolute', right:'20px', color:'rgb(200, 80, 80)'}}>Off</div>}</button>
            <button className='menu-settingbtn' onClick={()=>{handleApplicationMessage('open-recovery')}}><TbWorldUpload size={17} strokeWidth={1.5} style={{marginRight:'10px', marginLeft:'10px'}}/>Recovery</button>
            <button className='menu-settingbtn' onClick={()=>{handleApplicationMessage('refresh-application')}}><TbRefresh size={17} strokeWidth={1.5} style={{marginRight:'10px', marginLeft:'10px'}}/>Refresh</button>
            <button className='menu-settingbtn' onClick={()=>{handleApplicationMessage('exit-application')}}><TbDoorExit size={17} strokeWidth={1.5} style={{marginRight:'10px', marginLeft:'10px'}}/>Exit</button>
        </div>
      </div>
    </div>
  )
}