import React, {useState, useEffect, useRef} from 'react'
import './Css/Menu.css'

//icons
import { RiFontMono, RiFontSans, RiFontSansSerif } from "react-icons/ri";
import { TbCalendar, TbClipboardCheck, TbClock, TbDoorExit, TbFile, TbFileExport, TbFilePlus, TbFileUpload, TbRefresh, TbReload, TbTextCaption, TbTrash, TbUser, TbWorldUpload } from "react-icons/tb";
import { IoCheckmarkOutline, IoCloseOutline, IoWarningOutline } from "react-icons/io5";

//api send
async function openMenu(){const result =await window.api.openMenu(); return result} // result[0] -> is file, result[1] -> modifiedDate, result[2] -> createdDate
async function exitApplication(){await window.api.exitApplication()} // closes application and saves data (if autosave)
async function refreshApplication(){await window.api.refreshApplication()} // refreshes application and saves data (if autosave)
async function deleteFile(){await window.api.deleteFile()} // deletes current file
async function newFile(){await window.api.newFile()} // creates new file and saves data (if autosave)
async function renameFile(){await window.api.renameFile()} // renames current file and saves data (regardless of autosave)
async function openFile(){await window.api.openFile()} // opens current file and saves data (if autosave)

//memu (editor settings)
export default function Menu({close, setSerif, setDefault, setMono, saveData, toggleSpellCheck, spellCheck, author, name, toggleAutoSave, autoSave, characterCount, tempContent}){
  const [modifiedDate, setModifiedDate] = useState('Invalid') // last modified date
  const [createdDate, setCreatedDate] = useState('Invalid') // creation date
  const [isCurrentFile, setCurrentFile] = useState(false) // is current file

  const [display, setDisplay] = useState({opacity:0, height:'fit-content'})
  const ref = useRef(null);

  useEffect(() => {
    const result = openMenu() // result[0] -> is file, result[1] -> modifiedDate, result[2] -> createdDate
    result.then(function(result) {return result}).then((result) => {
      if(result[0]){ //if is file
        setModifiedDate(result[1]); setCreatedDate(result[2]); setCurrentFile(true); // set modifiedDate and createdDate and setCurrentFile (from last opened file)
      }
    })
    setDisplay({opacity:1}); const interval = setInterval(() => {updatePosition()}, 250); // animation and updating position with a setInterval

    return () => clearInterval(interval); // when menu is closed clear the interval
  } , []);

  function updatePosition(){
    const { height } = ref.current.getBoundingClientRect(); const { innerHeight } = window; // getting height of menu container and window height

    if(height + 35 + 8 + 10 >= innerHeight){setDisplay({height:innerHeight - 35 - 8 - 10})} // adjusting height
    else{setDisplay({height:'fit-content'})}
  }

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
            <button className='menu-fontbtn' onClick={setDefault}><RiFontSans size={24} color='black' style={{marginBottom:'4px'}}/>Default</button>
            <button className='menu-fontbtn' onClick={setSerif}><RiFontSansSerif size={24} color='black' style={{marginBottom:'4px'}}/>Serif</button>
            <button className='menu-fontbtn' onClick={setMono}><RiFontMono size={24} color='black' style={{marginBottom:'4px'}}/>Mono</button>
          </div>
          <div className='divider-x'/>
          <div className='menu-settingdiv'>
            <p style={{margin:'4px 0 6px 12px', fontSize:'12px', fontFamily:'Arial', color:'rgba(0,0,0,.6)', display:'flex', alignItems:'center'}}>File Configuration{isCurrentFile ? null : <IoWarningOutline style={{marginLeft:'5px'}} size={12} color='rgb(200, 120, 80)'/>}</p>
            <button className='menu-settingbtn' disabled={isCurrentFile ? false : true} onClick={()=>{saveData(tempContent); renameFile()}}><TbFileExport size={17} strokeWidth={1.5} style={{marginRight:'10px', marginLeft:'10px'}}/>Rename</button>
            <button className='menu-settingbtn' onClick={()=>{saveData(tempContent); close();}}><TbFileUpload size={17} strokeWidth={1.5} style={{marginRight:'10px', marginLeft:'10px'}}/>Save File</button>
            <button className='menu-settingbtn' onClick={()=>{if(autoSave){saveData(tempContent)}; newFile()}}><TbFilePlus size={17} strokeWidth={1.5} style={{marginRight:'10px', marginLeft:'10px'}}/>New File</button>
            <button className='menu-settingbtn' onClick={()=>{if(autoSave){saveData(tempContent)}; openFile()}}><TbFile size={17} strokeWidth={1.5} style={{marginRight:'10px', marginLeft:'10px'}}/>Open File</button>
            <button className='menu-settingbtn' disabled={isCurrentFile ? false : true} onClick={()=>{deleteFile()}}><TbTrash size={17} strokeWidth={1.5} style={{marginRight:'10px', marginLeft:'10px'}}/>Delete</button>

            <div className='divider-x' style={{marginTop:'4px', marginBottom:'4px'}}/>
            <p style={{margin:'4px 0 6px 12px', fontSize:'12px', fontFamily:'Arial', color:'rgba(0,0,0,.6)', display:'flex', alignItems:'center'}}>File Information{isCurrentFile ? null : <IoWarningOutline style={{marginLeft:'5px'}} size={12} color='rgb(200, 120, 80)'/>}</p>
            <button className='menu-settingbtn'><TbUser size={17} strokeWidth={1.5} style={{marginRight:'10px', marginLeft:'10px'}}/>Author<div style={{position:'absolute', right:'20px', color:'rgba(0,0,0,0.4)'}}>{author}</div></button>
            <button className='menu-settingbtn'><TbTextCaption size={17} strokeWidth={1.5} style={{marginRight:'10px', marginLeft:'10px'}}/>Title<div style={{position:'absolute', right:'20px', color:'rgba(0,0,0,0.4)'}}>{name}</div></button>
            <button className='menu-settingbtn'><TbTextCaption size={17} strokeWidth={1.5} style={{marginRight:'10px', marginLeft:'10px'}}/>Words<div style={{position:'absolute', right:'20px', color:'rgba(0,0,0,0.4)'}}>{characterCount}</div></button>
            <button className='menu-settingbtn'><TbCalendar size={17} strokeWidth={1.5} style={{marginRight:'10px', marginLeft:'10px'}}/>Created<div style={{position:'absolute', right:'20px', color:'rgba(0,0,0,0.4)'}}>{createdDate}</div></button>
            <button className='menu-settingbtn'><TbClock size={17} strokeWidth={1.5} style={{marginRight:'10px', marginLeft:'10px'}}/>Modified<div style={{position:'absolute', right:'20px', color:'rgba(0,0,0,0.4)'}}>{modifiedDate}</div></button>
            <button className='menu-settingbtn' onClick={toggleSpellCheck}><TbClipboardCheck size={17} strokeWidth={1.5} style={{marginRight:'10px', marginLeft:'10px'}}/>Spell Check{spellCheck ? <IoCheckmarkOutline style={{position:'absolute', right:'20px', color:'rgb(90, 160, 80)'}} size={17}/> : <IoCloseOutline style={{position:'absolute', right:'20px', color:'rgb(200, 80, 80)'}} size={17}/>}</button>
            <button className='menu-settingbtn' disabled={isCurrentFile ? false : true} onClick={toggleAutoSave}><TbReload size={17} strokeWidth={1.5} style={{marginRight:'10px', marginLeft:'10px'}}/>Autosave{autoSave ? <IoCheckmarkOutline style={{position:'absolute', right:'20px', color:'rgb(90, 160, 80)'}} size={17}/> : <IoCloseOutline style={{position:'absolute', right:'20px', color:'rgb(200, 80, 80)'}} size={17}/>}</button>

            <div className='divider-x' style={{marginTop:'4px', marginBottom:'4px'}}/>
            <p style={{margin:'4px 0 6px 12px', fontSize:'12px', fontFamily:'Arial', color:'rgba(0,0,0,.6)'}}>System</p>
            <button className='menu-settingbtn' onClick={()=>{if(autoSave){saveData(tempContent)}; exitApplication()}}><TbRefresh size={17} strokeWidth={1.5} style={{marginRight:'10px', marginLeft:'10px'}}/>Refresh</button>
            <button className='menu-settingbtn' onClick={()=>{if(autoSave){saveData(tempContent)}; refreshApplication()}}><TbDoorExit size={17} strokeWidth={1.5} style={{marginRight:'10px', marginLeft:'10px'}}/>Exit</button>
        </div>
      </div>
    </div>
  )
}