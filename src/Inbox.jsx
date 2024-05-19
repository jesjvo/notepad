import React, {useState, useEffect, useRef} from 'react'
import './Css/Inbox.css'

//icons
import { TbBookmark, TbClock, TbFile } from 'react-icons/tb';

//api
async function loadInboxFiles(){ // loads array of recently loaded files, favorited files, current file when inbox is opened
  const result = await window.api.openInbox();
  return result
}

async function openFile(filePath){ // opens file when clicked on a inbox file
  await window.api.openInboxFile(filePath);
}

// inbox (files)
export default function Inbox({close}){

  const [display, setDisplay] = useState({opacity:0}) // for animation
  const [refWidth, setRefWidth] = useState({width:'fit-content'}) // for adjusting width of inbox container
  const [refHeight, setRefHeight] = useState({height:'fit-content'}) // for adjusting height of inbox container
  const ref = useRef(null); // getting ref of inbox container for height/width manipulation

  const [lastOpenedFile, setLastOpenedFile] = useState('') // for keeping track of last opened file
  const [recentFiles, setRecentFiles] = useState([]) // for keeping track of recently opened files
  const [favoritedFiles, setFavoritedFiles] = useState([]) // for keeping track of favorited files

  useEffect(() => { // when inbox is opened
    const result = loadInboxFiles() // array of files
    result.then(function(result) {return result}).then((result) => {
      setRecentFiles(result[0]) // set recently opened files
      setFavoritedFiles(result[1]) // set favorited files
      setLastOpenedFile(result[2]) // set last opened file
    })
    
    setDisplay({opacity:1}); const interval = setInterval(() => {updatePosition()}, 250); // animation and updating position with a setInterval

    return () => clearInterval(interval); // when inbox is closed clear the interval
  } , []);

  function updatePosition(){
    const { height, width } = ref.current.getBoundingClientRect(); const { innerHeight, innerWidth } = window; // getting height and width of inbox container

    if(height + 50 >= innerHeight){setRefHeight({height:innerHeight - 50})} // adjusting height
    else{setRefHeight({height:'fit-content'})}

    if(width + 24 >= innerWidth){setRefWidth({width:innerWidth - 24})} // adjusting width
    else{setRefWidth({width:'fit-content'})}}

  return(
    <div className='inbox'>
        <div onClick={close} className='div-inboxclose' />
        <div style={{opacity:display.opacity, height:refHeight.height, width:refWidth.width, overflowY:'scroll'}} ref={ref} className='div-inbox'>
          <p style={{margin:'6px 0 2px 4px', fontSize:'12px', fontFamily:'Arial', color:'rgba(0,0,0,.6)', display:'flex', alignItems:'center'}}><TbFile size={15} strokeWidth={1.5} style={{marginRight:'6px'}}/>Current file</p>
          <div className='divider-x'/>
          {lastOpenedFile===null ? // dislay current file if it exists
            <div className='inbox-currentfile'>No file found</div>
            :
            <div className='inbox-currentfile'>{lastOpenedFile}</div> 
          }
          <p style={{margin:'6px 0 2px 6px', fontSize:'12px', fontFamily:'Arial', color:'rgba(0,0,0,.6)', display:'flex', alignItems:'center'}}><TbClock size={15} strokeWidth={1.5} style={{marginRight:'6px'}}/>Recent files</p>
          <div className='divider-x'/>
          <div className='div-inboxrecent'>
          {recentFiles.length>0 ? recentFiles.map((file, index) => { // for each recent file in recentFiles 
                    return (
                        <div key={index} onClick={() => openFile(file.filePath)} className='inbox-recentbox'>
                          <div className='recentbox-fileName'>
                            <div style={{marginLeft:'6px', fontSize:'.9em', color:'rgba(0,0,0,.8)'}}>{file.preferences.name}</div>
                            <div style={{marginLeft:'6px', fontSize:'.8em', color:'rgba(0,0,0,.4)'}}><TbFile size={12} strokeWidth={2} style={{marginRight:'2px', color:'rgba(0,0,0,.4)'}}/>{file.filePath}</div>
                          </div>
                          <div className='recentbox-fileDate'>
                            <TbClock size={12} strokeWidth={2} style={{marginRight:'2px', color:'rgba(0,0,0,.4)'}}/>
                            <div style={{fontSize:'.7em', color:'rgba(0,0,0,.4)'}}>{file.date.modifiedDate}</div>
                          </div>
                        </div>
                      )
                    }
                  )   
                :
                <div className='inbox-nofilefound'>No files found</div>}
          </div>
          <p style={{margin:'6px 0 2px 6px', fontSize:'12px', fontFamily:'Arial', color:'rgba(0,0,0,.6)', display:'flex', alignItems:'center'}}><TbBookmark size={15} strokeWidth={1.5} style={{marginRight:'6px'}}/>Favorite files</p>
          <div className='divider-x'/>
          <div className='div-inboxfavorite'>
            {favoritedFiles.length>0 ? favoritedFiles.map((file, index) => { // for each favorited file in favoritedFiles
                    return (
                      <div key={index} onClick={() => openFile(file.filePath)} className='inbox-recentbox'>
                        <div className='recentbox-fileName'>
                          <div style={{marginLeft:'6px', fontSize:'.9em', color:'rgba(0,0,0,.8)'}}>{file.preferences.name}</div>
                          <div style={{marginLeft:'6px', fontSize:'.8em', color:'rgba(0,0,0,.4)'}}><TbFile size={12} strokeWidth={2} style={{marginRight:'2px', color:'rgba(0,0,0,.4)'}}/>{file.filePath}</div>
                        </div>
                        <div className='recentbox-fileDate'>
                          <TbClock size={12} strokeWidth={2} style={{marginRight:'2px', color:'rgba(0,0,0,.4)'}}/>
                          <div style={{fontSize:'.7em', color:'rgba(0,0,0,.4)'}}>{file.date.modifiedDate}</div>
                        </div>
                      </div>
                      )
                    }
                  )   
                :
                <div className='inbox-nofilefound'>No files found</div>} 
          </div>
        </div>
    </div>
  )
}