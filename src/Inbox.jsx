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

  const [display, setDisplay] = useState({opacity:0, height:'fit-content'})
  const ref = useRef(null);

  const [fileList, setFileList] = useState([])

  useEffect(() => {
    const result = handleApplicationMessage('get-inbox-info') //array of files
    result.then(function(result) {return result}).then((result) => {
      setFileList(result)
    })
    
    setDisplay({opacity:1}); const interval = setInterval(() => {updatePosition()}, 250);

    return () => clearInterval(interval); 
  } , []);

  function updatePosition(){
    const { height } = ref.current.getBoundingClientRect(); const { innerHeight } = window;

    if(height + 50 >= innerHeight){setDisplay({height:innerHeight - 50})}
    else{setDisplay({height:'fit-content'})}
  }

  return(
    <div className='inbox'>
        <div onClick={close} className='div-inboxclose' />
        <div style={{opacity:display.opacity, height:display.height, overflowY:'scroll'}} ref={ref} className='div-inbox'>
        {fileList.map((file, index) => {
                  return (
                    <div key={index}>
                      <div>{file.fileName}</div>
                      <div>{file.fileAuthor}</div>
                      <div>{file.date.modifiedDate}</div>
                      <div>{file.date.createdDate}</div>
                    </div>
                    )
                  }
                )   
              }
        </div>
    </div>
  )
}