import React, {useState, useEffect, useRef} from 'react'
import './Css/Inbox.css'

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
          <div>Recent Files</div>
          <div className='div-inboxRecentFiles'>
          {recentFiles.map((file, index) => {
                    return (
                      <div key={index}>
                        <div>{file.name}</div>
                        <div>{file.author}</div>
                        <div>{file.date.modifiedDate}</div>
                        <div>{file.date.createdDate}</div>
                      </div>
                      )
                    }
                  )   
                }
          </div>
          <div>Favorited Files</div>
          <div className='div-inboxFavoritedFiles'>
          {favoritedFiles.map((file, index) => {
                    return (
                      <div key={index}>
                        <div>{file.name}</div>
                        <div>{file.author}</div>
                        <div>{file.date.modifiedDate}</div>
                        <div>{file.date.createdDate}</div>
                      </div>
                      )
                    }
                  )   
                }
          </div>
        </div>
    </div>
  )
}