import React, {useState, useEffect, useRef} from 'react'
import { useEditor, EditorContent } from '@tiptap/react'

//block attributes
import Document from '@tiptap/extension-document'
import Text from '@tiptap/extension-text'
import HardBreak from '@tiptap/extension-hard-break'
import ListItem from '@tiptap/extension-list-item'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import History from '@tiptap/extension-history'

//block text sizes
import Paragraph from './Extension/Paragraph'
import Title from './Extension/Title'
import Subtitle from './Extension/Subtitle'
import LargeText from './Extension/LargeText'

//node attributes
import Bold from '@tiptap/extension-bold'
import Underline from '@tiptap/extension-underline'
import Italic from '@tiptap/extension-italic'
import Strike from '@tiptap/extension-strike'
import Color from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'
import Highlight from '@tiptap/extension-highlight'
import CharacterCount from '@tiptap/extension-character-count'

//Pt Mono
import '@fontsource/pt-mono/400.css';

//Pt Sans
import '@fontsource/pt-sans/400-italic.css'; //regular italic
import '@fontsource/pt-sans/400.css'; //regular
import '@fontsource/pt-sans/700.css'; //bold regular
import '@fontsource/pt-sans/700-italic.css'; //bold italic

//Pt Serif
import "@fontsource/pt-serif/400-italic.css"; //regular italic
import "@fontsource/pt-serif/400.css"; //regular
import "@fontsource/pt-serif/700.css"; //bold regular
import "@fontsource/pt-serif/700-italic.css"; //bold italic

//css
import './Css/Page.css'

//icons
import { GoBookmark, GoBookmarkFill, GoChevronLeft, GoChevronRight, GoInbox, GoKebabHorizontal, GoPerson, GoRepoPush } from "react-icons/go";
import { TbTrash, TbChevronDown } from "react-icons/tb";
import { List, ListOrdered } from 'lucide-react';
import { VscTextSize } from "react-icons/vsc";
import { MdOutlineDragIndicator } from 'react-icons/md'

//api send
async function getData(){
  const result = await window.api.getData();
  return result
}

//node list (editor node/block manipulation)
export function NodeList({
  //main reseting marks for the text editor
  close, nodeLeft, nodeTop, nodeHeight,
  colorDefault, colorFillDefault, clearFormatting, deleteSelection,

  //manipulates text style in text editor
  setItalic, setBold, setUnderline, setStrike,

  //manipulates text size in text editor
  setTitle, setSubtitle, setLargeText, setText, setOrderedList, setBulletList,

  //manipulates color in text editor
  colorGrey, colorFillGrey, colorRed, colorFillRed,
  colorBrown, colorFillBrown, colorOrange, colorFillOrange,
  colorGreen, colorFillGreen, colorBlue, colorFillBlue,
  colorPurple, colorFillPurple, colorViolet, colorFillViolet
  }){

  const ref = useRef(null); const colorRef = useRef(null); const listRef = useRef(null); //hovering div refs
  const [hoveringDiv, setHoveringDiv] = useState({top:nodeTop+nodeHeight}) //hovering div
  const [hoveringListDiv, setHoveringListDiv] = useState({height:'fit-content', top:nodeTop+nodeHeight}) //hovering div (list)
  const [hoveringColorDiv, setHoveringColorDiv] = useState({height:'fit-content', top:nodeTop+nodeHeight}) //hovering div (color)
  
  const [opacity, setOpacity] = useState({opacity:0});
  const [showColor, setColor] = useState({active:false}); const [showList, setBlockChange] = useState({active:false}); //determines visibility of hovering div childs

  const handleColor=()=>{if(!showColor.active){setColor({active:true}); setBlockChange({active:false})}else{setColor({active:false})}} //determines visibility of hovering div (color)
  const handleList=()=>{if(!showList.active){setBlockChange({active:true}); setColor({active:false})}else{setBlockChange({active:false})}} //determines visibility of hovering div (list)
  const handleClose=()=>{if(showList.active || showColor.active){setBlockChange({active:false}); setColor({active:false})}else{close()}} //determines visibility of hovering div (close)

  useEffect(() => {
    setOpacity({opacity:1}); const interval = setInterval(() => {repositionHoveringDiv()}, 250); //repositions the hovering div using interval timer.

    return () => {setOpacity({opacity:0}); clearInterval(interval);} //clears the interval timer on return.
  }, []);

  function repositionHoveringDiv(){
    const { innerHeight } = window;
    const hovering_div_height = ref.current.getBoundingClientRect().height;
    //nodeTop is the marginTop of the current node (editor selection node), nodeHeight is the height of the current node (title, subtitle, etc..)
    //these 2 added together gets you the marginTop just below the current node (used for hovering div)
    //height variable is the height of 'hovering-div'.
    //these 3 added together gets you the marginTop just below the 'hovering div' (used for hovering-list-div or hovering-color-div)

    let hovering_div_top = nodeTop + nodeHeight; //placed below the current node
    if(hovering_div_top + hovering_div_height > innerHeight){ //if the hovering-div height is out of the screen

      hovering_div_top = nodeTop - hovering_div_height; //it's repositioned just above the current node.
      if(hovering_div_top<40){hovering_div_top=40} //this will prevent the hovering-div from going out of the screen.
    }
    setHoveringDiv({top:hovering_div_top})

    //firstly, color/list top & height can have 3 stages,
    //1 div height and margin < innerHeight
    //2: div height > windowHeight, so height will equal windowHeight - 40, marginTop will be 40, y-scroll is automatically done.
    //3: div height < windowHeight, however, the margintop isn't able to be placed below hovering-div.
    try{
      let hovering_color_div_height = colorRef.current.getBoundingClientRect().height;
      let replacement_height = hoveringColorDiv.hoveringColorDivHeight
      let hovering_color_div_top = hovering_div_top + hovering_div_height + 3 //placed below the hovering-div

      if(hovering_color_div_top + hovering_color_div_height + 10 > innerHeight){ //if the hovering-color-div height is out of the screen
        if(hovering_color_div_height + 50 > innerHeight){ //if the hovering-color-div height is out of the screen
          replacement_height = innerHeight - 50 //consider padding and margin
          hovering_color_div_top = 40
        }else{
          hovering_color_div_top = innerHeight - hovering_color_div_height - 10 //consider padding and margin
          replacement_height = 'fit-content' //repositioned along the bottom
        }
      }
      setHoveringColorDiv({height:replacement_height, top:hovering_color_div_top})
    }catch{
      //color div doesn't exist
    }
    try{
      let hovering_list_div_height = listRef.current.getBoundingClientRect().height;
      let replacement_height = hoveringListDiv.hoveringListDivHeight
      let hovering_list_div_top = hovering_div_top + hovering_div_height + 3 //placed below the hovering-div

      if(hovering_list_div_top + hovering_list_div_height + 10 > innerHeight){ //if the hovering-color-div height is out of the screen=
        if(hovering_list_div_height + 50 > innerHeight){ //if the hovering-color-div height is out of the screen
          replacement_height = innerHeight - 50 //consider padding and margin
          hovering_list_div_top = 40
        }else{
          hovering_list_div_top = innerHeight - hovering_list_div_height - 10 //consider padding and margin
          replacement_height = 'fit-content' //repositioned along the bottom
        }
      }
      setHoveringListDiv({height:replacement_height, top:hovering_list_div_top})
    }catch{
      //list div doesn't exist
    }
  }

  return(
  <>
    <div className='hoverdiv'>
      <div className='hoverdiv-close' onClick={()=>{handleClose()}}></div>
      {showList.active ?
        <div className='hoverdiv-box' ref={listRef} style={{position:'absolute', zIndex:2, left: nodeLeft-10, top: hoveringListDiv.top, height:hoveringListDiv.height, width:'120px', padding:'2px', flexDirection:'column'}}>
          <p style={{margin:'4px 0 6px 10px', fontSize:'12px', fontFamily:'Arial', color:'rgba(0,0,0,.4)'}}>Text size</p>
          <button className='hoverdiv-btn2' onClick={setText}><p className='hoverdiv-colorp'><VscTextSize size={17} color='rgba(0,0,0,.6)'/></p><p style={{fontSize:'.9em', color:'rgba(0,0,0,.6)'}}>Text</p></button>
          <button className='hoverdiv-btn2' onClick={setTitle}><p className='hoverdiv-colorp'><VscTextSize size={17} strokeWidth={.2} color='rgba(0,0,0,1)'/></p><p style={{fontSize:'.9em', color:'rgba(0,0,0,.6)'}}>Title</p></button>
          <button className='hoverdiv-btn2' onClick={setSubtitle}><p className='hoverdiv-colorp'><VscTextSize size={17} color='rgba(0,0,0,.8)'/></p><p style={{fontSize:'.9em', color:'rgba(0,0,0,.6)'}}>Subtitle</p></button>
          <button className='hoverdiv-btn2' onClick={setLargeText}><p className='hoverdiv-colorp'><VscTextSize size={17} color='rgba(0,0,0,.6)'/></p><p style={{fontSize:'.9em', color:'rgba(0,0,0,.6)'}}>Large text</p></button>
          <div className='divider-x' style={{marginTop:'4px', marginBottom:'4px'}}></div>
          <p style={{margin:'4px 0 6px 10px', fontSize:'12px', fontFamily:'Arial', color:'rgba(0,0,0,.4)'}}>List items</p>
          <button className='hoverdiv-btn2' onClick={setBulletList}><p className='hoverdiv-colorp'><List size={17} strokeWidth={1.5}/></p><p style={{fontSize:'.9em', color:'rgba(0,0,0,.6)'}}>Bullet list</p></button>
          <button className='hoverdiv-btn2' onClick={setOrderedList}><p className='hoverdiv-colorp'><ListOrdered size={17} strokeWidth={1.5}/></p><p style={{fontSize:'.9em', color:'rgba(0,0,0,.6)'}}>Ordered list</p></button>
        </div>
        : null
      }
      {showColor.active ?
        <div className='hoverdiv-box' ref={colorRef} style={{position:'absolute', zIndex:2, left: nodeLeft+120, top: hoveringColorDiv.top, height: hoveringColorDiv.height, width:'120px', padding:'2px', flexDirection:'column'}}>
          <button className='hoverdiv-btn2' onClick={clearFormatting}><p className='hoverdiv-listp' style={{color:'#000000'}}>X</p><p style={{fontSize:'.9em', color:'rgba(0,0,0,.6)'}}>Clear</p></button>
          <div className='divider-x' style={{marginTop:'4px', marginBottom:'4px'}}></div>
          <p style={{margin:'4px 0 6px 10px', fontSize:'12px', fontFamily:'Arial', color:'rgba(0,0,0,.4)'}}>Color</p>
          <button className='hoverdiv-btn2' onClick={colorDefault}><p className='hoverdiv-listp' style={{color:'rgb(0, 0, 0)'}}>A</p><p style={{fontSize:'.9em', color:'rgba(0,0,0,.6)'}}>Default</p></button>
          <button className='hoverdiv-btn2' onClick={colorGrey}><p className='hoverdiv-listp' style={{color:'rgb(150, 150, 150)'}}>A</p><p style={{fontSize:'.9em', color:'rgba(0,0,0,.6)'}}>Grey</p></button>
          <button className='hoverdiv-btn2' onClick={colorRed}><p className='hoverdiv-listp' style={{color:'rgb(200, 80, 80)'}}>A</p><p style={{fontSize:'.9em', color:'rgba(0,0,0,.6)'}}>Red</p></button>
          <button className='hoverdiv-btn2' onClick={colorBrown}><p className='hoverdiv-listp' style={{color:'rgb(125, 90, 70)'}}>A</p><p style={{fontSize:'.9em', color:'rgba(0,0,0,.6)'}}>Brown</p></button>
          <button className='hoverdiv-btn2' onClick={colorOrange}><p className='hoverdiv-listp' style={{color:'rgb(200, 120, 80)'}}>A</p><p style={{fontSize:'.9em', color:'rgba(0,0,0,.6)'}}>Orange</p></button>
          <button className='hoverdiv-btn2' onClick={colorGreen}><p className='hoverdiv-listp' style={{color:'rgb(90, 160, 80)'}}>A</p><p style={{fontSize:'.9em', color:'rgba(0,0,0,.6)'}}>Green</p></button>
          <button className='hoverdiv-btn2' onClick={colorBlue}><p className='hoverdiv-listp' style={{color:'rgb(60, 140, 200)'}}>A</p><p style={{fontSize:'.9em', color:'rgba(0,0,0,.6)'}}>Blue</p></button>
          <button className='hoverdiv-btn2' onClick={colorPurple}><p className='hoverdiv-listp' style={{color:'rgb(90, 80, 200)'}}>A</p><p style={{fontSize:'.9em', color:'rgba(0,0,0,.6)'}}>Purple</p></button>
          <button className='hoverdiv-btn2' onClick={colorViolet}><p className='hoverdiv-listp' style={{color:'rgb(200, 80, 190)'}}>A</p><p style={{fontSize:'.9em', color:'rgba(0,0,0,.6)'}}>Violet</p></button>
          <div className='divider-x' style={{marginTop:'4px', marginBottom:'4px'}}></div>
          <p style={{margin:'4px 0 6px 10px', fontSize:'12px', fontFamily:'Arial', color:'rgba(0,0,0,.4)'}}>Background Color</p>
          <button className='hoverdiv-btn2' onClick={colorFillDefault}><p className='hoverdiv-listp' style={{backgroundColor:'rgb(0, 0, 0, 0)'}}>A</p><p style={{fontSize:'.9em', color:'rgba(0,0,0,.6)'}}>Default</p></button>
          <button className='hoverdiv-btn2' onClick={colorFillGrey}><p className='hoverdiv-listp' style={{backgroundColor:'rgb(240, 240, 240)'}}>A</p><p style={{fontSize:'.9em', color:'rgba(0,0,0,.6)'}}>Grey</p></button>
          <button className='hoverdiv-btn2' onClick={colorFillRed}><p className='hoverdiv-listp' style={{backgroundColor:'rgb(210, 0, 0, .1)'}}>A</p><p style={{fontSize:'.9em', color:'rgba(0,0,0,.6)'}}>Red</p></button>
          <button className='hoverdiv-btn2' onClick={colorFillBrown}><p className='hoverdiv-listp' style={{backgroundColor:'rgba(130, 90, 75, 0.1)'}}>A</p><p style={{fontSize:'.9em', color:'rgba(0,0,0,.6)'}}>Brown</p></button>
          <button className='hoverdiv-btn2' onClick={colorFillOrange}><p className='hoverdiv-listp' style={{backgroundColor:'rgb(255, 100, 0, .1)'}}>A</p><p style={{fontSize:'.9em', color:'rgba(0,0,0,.6)'}}>Orange</p></button>
          <button className='hoverdiv-btn2' onClick={colorFillGreen}><p className='hoverdiv-listp' style={{backgroundColor:'rgb(0, 210, 0, .1)'}}>A</p><p style={{fontSize:'.9em', color:'rgba(0,0,0,.6)'}}>Green</p></button>
          <button className='hoverdiv-btn2' onClick={colorFillBlue}><p className='hoverdiv-listp' style={{backgroundColor:'rgb(0, 100, 210, 0.1)'}}>A</p><p style={{fontSize:'.9em', color:'rgba(0,0,0,.6)'}}>Blue</p></button>
          <button className='hoverdiv-btn2' onClick={colorFillPurple}><p className='hoverdiv-listp' style={{backgroundColor:'rgb(120, 80, 210, 0.1)'}}>A</p><p style={{fontSize:'.9em', color:'rgba(0,0,0,.6)'}}>Purple</p></button>
          <button className='hoverdiv-btn2' onClick={colorFillViolet}><p className='hoverdiv-listp' style={{backgroundColor:'rgb(210, 80 , 210, 0.1)'}}>A</p><p style={{fontSize:'.9em', color:'rgba(0,0,0,.6)'}}>Violet</p></button>
        </div>
        : null
      }
      <div className='hoverdiv-box' ref={ref} style={{position:'absolute', opacity:opacity.opacity, left: nodeLeft, top: hoveringDiv.top, width:'fit-content', height:'23px', flexDirection:'row', overflow:'hidden', alignItems:'center', padding:'2px'}}>
        <button className='hoverdiv-btn' style={{minWidth:'55px', fontSize:'.8em'}} onClick={()=>{handleList()}}>Text <TbChevronDown size={8}/></button>
        <button className='hoverdiv-btn' style={{minWidth:'22px', fontWeight:800, fontSize:'.7em'}} onClick={setBold}>B</button>
        <button className='hoverdiv-btn' style={{minWidth:'18px', fontWeight:400, fontStyle:'italic', fontSize:'.7em'}} onClick={setItalic}>i</button>
        <button className='hoverdiv-btn' style={{minWidth:'21px', fontWeight:400, textDecoration:'underline', fontSize:'.7em'}} onClick={setUnderline}>U</button>
        <button className='hoverdiv-btn' style={{minWidth:'21px', fontWeight:400, textDecoration:'line-through', fontSize:'.7em'}} onClick={setStrike}>S</button>
        <button className='hoverdiv-btn' style={{minWidth:'40px', fontSize:'.8em'}} onClick={()=>{handleColor()}}>A <TbChevronDown size={8}/></button>
        <button className='hoverdiv-btn' style={{minWidth:'fit-content'}} onClick={deleteSelection}><TbTrash size={14}/></button>
      </div>
    </div>
  </>
  )
}

//div element to change author
export function ChangeAuthor({close, submitAuthor, author}){
  const [opacity, setOpacity] = useState({opacity:0});
  const [input, setInput] = useState('');

  useEffect(() => {
    setOpacity({opacity:1})
    if(author!==null){setInput(author)}
  }, [])

  function checkAuthor(author){
    if(author.length<1){submitAuthor(null)}else{submitAuthor(input)}
    close()
  }

  return(
    <div className='changediv'>
      <div className='changediv-close' onClick={close}/>
      <div className='changediv-box' style={{opacity:opacity.opacity}}>
        <GoPerson style={{padding:'4px'}} size={14}/>
        <input className='changediv-input' value={input} onChange={e => setInput(e.target.value)} placeholder='Author'></input>
        <button className='changediv-submit' onClick={()=>{checkAuthor(input)}}>Set</button>
      </div>
    </div>
  )
}

//div element to change name of file
export function RenameFile({close, submitRename, name}){
  const [opacity, setOpacity] = useState({opacity:0});
  const [input, setInput] = useState('');

  function checkRename(rename){
    let has_error = false
    for (let i = 0; i < rename.length; i++) { //checks for invalid characters
      var f=rename.split('')[i]
      if(("[^\\/:\x22*?<>|]+").includes(f)){has_error  = true}
    }
    if(!has_error ){setInput(rename)} //if doesn't have invalid characters, allow input
  }

  //function to send 'setRename' to App.jsx, to change name preferences
  function confirmRename(rename){if(rename.length<1){return}submitRename(rename); close()}

  useEffect(() => {
    setOpacity({opacity:1})
    setInput(name)
  }, [])

  return(
    <div className='changediv'>
      <div className='changediv-close' onClick={close}/>
      <div className='changediv-box' style={{opacity:opacity.opacity}}>
        <GoRepoPush style={{padding:'4px'}} size={14}/>
        <input className='changediv-input' value={input} onChange={e => checkRename(e.target.value)} placeholder='Rename'></input>
        <button className='changediv-submit' onClick={()=>{confirmRename(input)}}>Set</button>
      </div>
    </div>
  )
}

//page (main editor)
export default function Page({menuClick, inboxClick, fontStyle, autoSave, author, name, isFavorite, setFavorite, spellCheck, saveData, setPreferences, setAuthor, setRename}) {
  
  const [hoveringNode, setHoveringNode] = useState({active:false, left:null, top:null, width:null, height:null})
  const [nodeList, setNodeList] = useState(false)
  const [authorActive, setAuthorActive] = useState(false)
  const [renameFileActive, setRenameFile] = useState(false)

  const ref = useRef(null);

  const editor = useEditor({
    // when the editor is ready, therefore everything is ready/loaded (including App.jsx, therefore preferences exist...)
    // It is important that the editor gets the last opened file (if exists), then loading content using editor commands; and then sending a message to App.jsx to update preferences
    onBeforeCreate({editor}){
      const result = getData() // result[0] -> preferences, result[1] -> content
      result.then(function(result) {return result}).then((result) => {
      setPreferences(result[0]) //set preferences
      editor.commands.setContent(result[1]) //set content
      })
    },
    onSelectionUpdate(){updateNodePosition()}, //updates edit position
    onUpdate(){updateNodePosition()},
    extensions: [
      Document, Text, ListItem, TextStyle, Color, History, HardBreak, CharacterCount, //extensions
      Paragraph, Title, Subtitle, LargeText, //blocks text
      Highlight.configure({ multicolor: true }),
      BulletList.configure({HTMLAttributes: {class: 'is-bulletlist'}}),
      OrderedList.configure({HTMLAttributes: {class: 'is-orderedlist'}}),
      Underline.configure({HTMLAttributes: {class: 'is-underline'}}),
      Bold.configure({HTMLAttributes: {class: 'is-bold'}}),
      Italic.configure({HTMLAttributes: {class: 'is-italic'}}),
      Strike.configure({HTMLAttributes: {class: 'is-strike',}}),
      ],
    }
  )

  //updates position of currently selected node.
  //firstly this is done by getting the editor selection, then viewing if the node has a block parent.
  //if so, the editor view's the nodeDom (relative position to window), if exists... then grab the bounding client rect (absolute position to window)
  //finally, set the state of hoveringNode and therefore whenever hoveringdiv is displaying, it will be placed in the correct position
  function updateNodePosition(){
    try {
      const {$from, from, to} = editor.state.selection
      if($from.parent.isBlock){
        const nodeDom = editor.view.nodeDOM($from.before($from.depth))
        if(nodeDom){
          const rect = nodeDom.getBoundingClientRect(); 
          let top = rect.top; let left = rect.left; let height = rect.height;

          editor.state.doc.textBetween(from, to, ' ').length>=1 ? setNodeList(true) : setNodeList(false); //if text selection is above 1 -> show nodeList

          editor.isActive('bulletList') || editor.isActive('orderedList') ? left-=15 : left+=0 //if bullet list/ordered list is active -> push to right
          
          setHoveringNode({active:true, left:left, top:top, height:height})
        }
      }
    }
     catch (error) {
      setHoveringNode({active: false, left:null, top:null, height:null}); //if failed to get selection -> set hoveringNode to false, therefore no position is displayed
    }
  }

  function selectNode(){editor.commands.setTextSelection({ from: editor.state.selection.$to.start(), to: editor.state.selection.$to.end()}); setNodeList(true)} //if press edit button -> select whole current node & show nodeList

  function handleAuthorChange(author){setAuthor(author)} //send 'setAuthor' to App.jsx, to change author preferences
  function handleRenameChange(rename){setRename(rename)} //send 'setRename' to App.jsx, to change author preferences


  if(!editor){return null} //if editor not ready -> return

  return (
    <div className='page'>
      {nodeList ? <NodeList
      close={()=>{setNodeList(false); editor.commands.focus(editor.state.selection.$to.end())}} deleteSelection={()=>{editor.commands.deleteSelection()}}
      nodeLeft={hoveringNode.left} nodeTop={hoveringNode.top} nodeHeight={hoveringNode.height}

      setBold={()=>{editor.chain().toggleBold().run()}} setItalic={()=>{editor.chain().toggleItalic().run()}}
      setUnderline={()=>{editor.chain().toggleUnderline().run()}} setStrike={()=>{editor.chain().toggleStrike().run()}}

      setText={()=>{editor.chain().focus().setParagraph().run()}} setTitle={()=>{editor.chain().focus().setTitle().run()}}
      setSubtitle={()=>{editor.chain().focus().setSubtitle().run()}} setLargeText={()=>{editor.chain().focus().setLargeText().run()}}
      setOrderedList={()=>{editor.chain().focus().toggleOrderedList().run()}} setBulletList={()=>{editor.chain().focus().toggleBulletList().run()}}

      clearFormatting={()=>{editor.chain().focus().unsetColor().run(); editor.chain().focus().unsetHighlight().run();}}
      colorDefault={()=>{editor.chain().focus().unsetColor().run()}} colorFillDefault={()=>{editor.chain().focus().unsetHighlight().run()}} /* default */
      colorGrey={()=>{editor.chain().focus().setColor('#969696').run()}} colorFillGrey={()=>{editor.chain().focus().toggleHighlight({ color: '#f0f0f0' }).run()}} /* grey */
      colorRed={()=>{editor.chain().focus().setColor('#c85050').run()}} colorFillRed={()=>{editor.chain().focus().toggleHighlight({ color: '#d200001a' }).run()}} /* red */
      colorBrown={()=>{editor.chain().focus().setColor('#7d5a46').run()}} colorFillBrown={()=>{editor.chain().focus().toggleHighlight({ color: '#825a4b1a' }).run()}} /* brown */
      colorOrange={()=>{editor.chain().focus().setColor('#c87850').run()}} colorFillOrange={()=>{editor.chain().focus().toggleHighlight({ color: '#ff64001a' }).run()}} /* orange */
      colorGreen={()=>{editor.chain().focus().setColor('#5aa050').run()}} colorFillGreen={()=>{editor.chain().focus().toggleHighlight({ color: '#00d2001a' }).run()}} /* green */
      colorBlue={()=>{editor.chain().focus().setColor('#3c8cc8').run()}} colorFillBlue={()=>{editor.chain().focus().toggleHighlight({ color: '#0064d21a' }).run()}} /* blue */
      colorPurple={()=>{editor.chain().focus().setColor('#5a50c8').run()}} colorFillPurple={()=>{editor.chain().focus().toggleHighlight({ color: '#7850d21a' }).run()}} /* purple */
      colorViolet={()=>{editor.chain().focus().setColor('#c850be').run()}} colorFillViolet={()=>{editor.chain().focus().toggleHighlight({ color: '#d250d21a' }).run()}} /* red */
      />
      :null}
      
      {renameFileActive ? <RenameFile close={()=>{setRenameFile(false)}} submitRename={handleRenameChange} name={name}/> : null}

      {authorActive ? <ChangeAuthor close={()=>{setAuthorActive(false)}} submitAuthor={handleAuthorChange} author={author}/> : null}

      <div className='page-div'>
        <div className='page-header'>
          <div className='page-headerleft'>
            <div style={{marginLeft:'4px'}}></div>
            <button className='page-headerbtn' style={{display:'flex', flexDirection:'row', alignItems:'center'}} onClick={()=>{setAuthorActive(true)}}><GoPerson size={14}/>{author===null ? null : <div style={{marginLeft:'8px', letterSpacing:'.25px'}}>{author}</div>}</button>
            <button className='page-headerbtn' style={{letterSpacing:'.25px', color:'rgba(0,0,0,.4)'}} onClick={()=>{setRenameFile(true)}}>{name}</button>
            <button className='page-headerbtn' onClick={()=>{saveData(editor.getJSON())}}><GoRepoPush size={14}/></button>
          </div>
          <div className='page-headerright'>
            <button className='page-headerbtn' onClick={()=>{editor.chain().focus().undo().run()}}><GoChevronLeft size={14} /></button>
            <button className='page-headerbtn' onClick={()=>{editor.chain().focus().redo().run()}}><GoChevronRight size={14}/></button>
            <div className='divider-y' style={{height:'50%'}}></div>
            <button className='page-headerbtn' style={{zIndex:25}} onClick={()=>{if(autoSave){saveData(editor.getJSON())}; inboxClick()}}><GoInbox size={14}/></button>
            <button className='page-headerbtn' onClick={setFavorite}>{isFavorite ? <GoBookmarkFill color='#ffd012' size={14}/> : <GoBookmark color='#ffd012' size={14}/>}</button>
            <button className='page-headerbtn' style={{zIndex:25}} onClick={()=>{if(autoSave){saveData(editor.getJSON())}; menuClick(editor.storage.characterCount.words(), editor.getJSON())}}><GoKebabHorizontal size={14}/></button>
            <div style={{marginRight:'4px'}}></div>
          </div>
        </div>

        {editor && hoveringNode.active ? 
          <div style={{top:hoveringNode.top, left:hoveringNode.left-35, height:hoveringNode.height}} className='extension-div'>
            <MdOutlineDragIndicator className="extension-btn" onClick={()=>{selectNode()}} size={'15px'}/>
          </div>
        :null}
      
        <div className='editor-center'>
          <EditorContent editor={editor} onScrollCapture={()=>setHoveringNode({active:false})} style={{fontFamily:fontStyle}} spellCheck={spellCheck} ref={ref} className='Editor'/>
        </div>
      </div>
    </div>
  )
}