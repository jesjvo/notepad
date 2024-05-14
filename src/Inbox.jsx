import React, {useState, useEffect, useRef} from 'react'
import './Css/Inbox.css'

//icons
import { TbBookmark, TbClock, TbTrash, TbUser } from 'react-icons/tb';

//api
async function handleApplicationMessage(request){
  const { api } = window

  if(request==='get-inbox-info'){
    const result = await api.openInbox();
    return result
  }
}

//inbox (files)
export default function Inbox({close}){

  const [display, setDisplay] = useState({opacity:0, height:'fit-content', width:'fit-content'})
  const ref = useRef(null);

  const [recentFiles, setRecentFiles] = useState([])
  const [favoritedFiles, setFavoritedFiles] = useState([])

  useEffect(() => {
    const result = handleApplicationMessage('get-inbox-info') //array of files
    result.then(function(result) {return result}).then((result) => {

      console.log(result)

      setRecentFiles(result[0])
      setFavoritedFiles(result[1])

    })
    
    setDisplay({opacity:1}); const interval = setInterval(() => {updatePosition()}, 250);

    return () => clearInterval(interval); 
  } , []);

  function updatePosition(){
    const { height, width } = ref.current.getBoundingClientRect(); const { innerHeight, innerWidth } = window;

    if(height + 50 >= innerHeight){setDisplay({height:innerHeight - 50})}
    else{setDisplay({height:'fit-content'})}

    if(width + 24 >= innerWidth){setDisplay({width:innerWidth - 24})}
    else{setDisplay({width:'fit-content'})}
  }

  return(
    <div className='inbox'>
        <div onClick={close} className='div-inboxclose' />
        <div style={{opacity:display.opacity, height:display.height, width:display.width, overflowY:'scroll'}} ref={ref} className='div-inbox'>
          <p style={{margin:'4px 0 2px 6px', fontSize:'12px', fontFamily:'Arial', color:'rgba(0,0,0,.6)', display:'flex', alignItems:'center'}}><TbClock size={15} strokeWidth={1.5} style={{marginRight:'6px'}}/>Recent files</p>
          <div className='divider-x'/>
          <div className='div-inboxrecent'>
          {recentFiles.map((file, index) => {
                    return ( //name, author, modifiedDate, createdDate
                      <button key={index} className='inbox-recentbox'>
                        <div style={{position:'absolute', left:'10px', textAlign:'left'}}>{file.name}<br/><div style={{fontSize:'.9em', color:'rgba(0,0,0,.6)', marginTop:'2px'}}>{file.path}</div></div>
                        <div style={{position:'absolute', right:'15px', fontSize:'.9em', color:'rgba(0,0,0,.4)', display:'flex', alignItems:'center'}}>
                          <TbClock size={15} strokeWidth={1.5} style={{marginRight:'2px'}}/>{file.date.modifiedDate}
                        </div>
                      </button>
                      )
                    }
                  )   
                }
          </div>
          <p style={{margin:'8px 0 2px 6px', fontSize:'12px', fontFamily:'Arial', color:'rgba(0,0,0,.6)', display:'flex', alignItems:'center'}}><TbBookmark size={15} strokeWidth={1.5} style={{marginRight:'6px'}}/>Favorite files</p>
          <div className='divider-x'/>
          <div className='div-inboxfavorite'>
          {favoritedFiles.map((file, index) => {
                    return (
                        <button key={index} className='inbox-recentbox'>
                        <div style={{position:'absolute', left:'10px', textAlign:'left'}}>{file.name}<br/><div style={{fontSize:'.9em', color:'rgba(0,0,0,.6)', marginTop:'2px'}}>{file.path}</div></div>
                        <div style={{position:'absolute', right:'15px', fontSize:'.9em', color:'rgba(0,0,0,.4)', display:'flex', alignItems:'center'}}>
                          <TbUser size={15} strokeWidth={1.5} style={{marginRight:'2px'}}/>{file.author}
                        </div>
                      </button>
                      )
                    }
                  )   
                }
          </div>
        </div>
    </div>
  )
}