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
//custom
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

//css
import './Css/Page.css'

//icons
import { GoBookmark, GoBookmarkFill, GoChevronLeft, GoChevronRight, GoKebabHorizontal, GoRepoPush } from "react-icons/go";
import { TbCopy, TbTrash, TbChevronDown } from "react-icons/tb";
import { GripVertical, Plus, Heading1, Heading2, List, ListOrdered, Pilcrow } from 'lucide-react';

const ipcRenderer = window.require("electron").ipcRenderer;

export function NodeList({
  close, nodeLeft, nodeTop, nodeHeight,
  colorDefault, colorFillDefault, clearFormatting, deleteSelection,

  setItalic, setBold, setUnderline, setStrike,

  setTitle, setSubtitle, setLargeText, setText, setOrderedList, setBulletList,

  colorGrey, colorFillGrey,
  colorRed, colorFillRed,
  colorOrange, colorFillOrange,
  colorGreen, colorFillGreen,
  colorBlue, colorFillBlue,
  colorPurple, colorFillPurple,
  colorViolet, colorFillViolet
  }){

  const ref = useRef(null); const colorRef = useRef(null); const blockChangeRef = useRef(null);

  const [listTop, setListTop] = useState({top:nodeTop+nodeHeight});
  const [colorTop, setColorTop] = useState({top:nodeTop+nodeHeight+30});
  const [blockChangeTop, setBlockChangeTop] = useState({top:nodeTop+nodeHeight+30});

  const [opacity, setOpacity] = useState({opacity:0});
  const [showColor, setColor] = useState({active:false});
  const [showBlockChange, setBlockChange] = useState({active:false});

  const handleColor=()=>{
    if(!showColor.active){
      setColor({active:true}); setBlockChange({active:false})}
    else{setColor({active:false})}
  }

  const handleBlockChange=()=>{
    if(!showBlockChange.active){
      setBlockChange({active:true}); setColor({active:false})}
    else{setBlockChange({active:false})}
  }

  useEffect(() => {
    setOpacity({opacity:1})
    updatePosition()
    const interval = setInterval(() => {
      updatePosition()
    }, 250);

    return () => clearInterval(interval);
  } , []);

  const updatePosition = () => {
    const { height } = ref.current.getBoundingClientRect()
    const { innerHeight } = window;

    let newTopHeight = listTop.top

    if(newTopHeight + height + 10 > innerHeight){
      newTopHeight = innerHeight - (innerHeight - listTop.top) - height - nodeHeight - 10
    }
    setListTop({top:newTopHeight});

    try{
      const { height } = colorRef.current.getBoundingClientRect();
      let newTopHeight = colorTop.top

      if(newTopHeight + height + 10 > innerHeight){
        newTopHeight = innerHeight - height - 10
      }
      setColorTop({top:newTopHeight});
    }catch{}

    try{
      const { height } = blockChangeRef.current.getBoundingClientRect();
      let newTopHeight = blockChangeTop.top

      if(newTopHeight + height + 10 > innerHeight){
        newTopHeight = innerHeight - height - 10
      }
      setBlockChangeTop({top:newTopHeight});
    }catch{}
  }

  return(
  <>
  <div className='div-list'>
    <div className='div-listclose' onClick={close}></div>
    {showBlockChange.active ?
      <div className='div-listbox' ref={blockChangeRef}
      style={{position:'absolute', zIndex:2, left: nodeLeft-20, top: blockChangeTop.top, height:'fit-content', width:'120px', padding:'2px', flexDirection:'column'}}>

        <button className='btn-listcolor' style={{height: '25px', minWidth:'120px'}} onClick={setText}><p className='p-listblockchange' style={{color:'rgb(0, 0, 0)'}}><Pilcrow size={17} strokeWidth={1.5}/></p><p style={{fontSize:'.9em'}}>Text</p></button>
        <button className='btn-listcolor' style={{height: '27px', minWidth:'120px'}} onClick={setTitle}><p className='p-listblockchange' style={{color:'rgb(0, 0, 0)'}}><Heading1 size={17} strokeWidth={1.5}/></p><p style={{fontSize:'.9em'}}>Heading 1</p></button>
        <button className='btn-listcolor' style={{height: '27px', minWidth:'120px'}} onClick={setSubtitle}><p className='p-listblockchange' style={{color:'rgb(0, 0, 0)'}}><Heading2 size={17} strokeWidth={1.5}/></p><p style={{fontSize:'.9em'}}>Heading 2</p></button>
        <button className='btn-listcolor' style={{height: '27px', minWidth:'120px'}} onClick={setLargeText}><p className='p-listblockchange' style={{color:'rgb(0, 0, 0)'}}><Heading2 size={17} strokeWidth={1.5}/></p><p style={{fontSize:'.9em'}}>Heading 3</p></button>

        <div className='divider-x' style={{marginTop:'4px', marginBottom:'4px'}}></div>

        <button className='btn-listcolor' style={{height: '27px', minWidth:'120px'}} onClick={setBulletList}><p className='p-listblockchange' style={{color:'rgb(0, 0, 0)'}}><List size={17} strokeWidth={1.5}/></p><p style={{fontSize:'.9em'}}>Bullet list</p></button>
        <button className='btn-listcolor' style={{height: '27px', minWidth:'120px'}} onClick={setOrderedList}><p className='p-listblockchange' style={{color:'rgb(0, 0, 0)'}}><ListOrdered size={17} strokeWidth={1.5}/></p><p style={{fontSize:'.9em'}}>Ordered list</p></button>
      </div>

      : null
    }
    {showColor.active ?
      <div className='div-listbox' ref={colorRef}
      style={{position:'absolute', zIndex:2, left: nodeLeft+120, top: colorTop.top, height:'fit-content', width:'120px', padding:'2px', flexDirection:'column'}}>

        <button className='btn-listcolor' style={{height: '25px', minWidth:'120px'}} onClick={clearFormatting}><p className='p-listcolor' style={{color:'#000000'}}>X</p><p style={{fontSize:'.9em'}}>Clear</p></button>
        
        <div className='divider-x' style={{marginTop:'4px', marginBottom:'4px'}}></div>

        <button className='btn-listcolor' style={{height: '25px', minWidth:'120px'}} onClick={colorDefault}><p className='p-listcolor' style={{color:'rgb(0, 0, 0)'}}>A</p><p style={{fontSize:'.9em'}}>Default</p></button>
        <button className='btn-listcolor' style={{height: '25px', minWidth:'120px'}} onClick={colorGrey}><p className='p-listcolor' style={{color:'rgb(150, 150, 150)'}}>A</p><p style={{fontSize:'.9em'}}>Grey</p></button>
        <button className='btn-listcolor' style={{height: '25px', minWidth:'120px'}} onClick={colorRed}><p className='p-listcolor' style={{color:'rgb(200, 80, 80)'}}>A</p><p style={{fontSize:'.9em'}}>Red</p></button>
        <button className='btn-listcolor' style={{height: '25px', minWidth:'120px'}} onClick={colorOrange}><p className='p-listcolor' style={{color:'rgb(200, 120, 80)'}}>A</p><p style={{fontSize:'.9em'}}>Orange</p></button>
        <button className='btn-listcolor' style={{height: '25px', minWidth:'120px'}} onClick={colorGreen}><p className='p-listcolor' style={{color:'rgb(90, 160, 80)'}}>A</p><p style={{fontSize:'.9em'}}>Green</p></button>
        <button className='btn-listcolor' style={{height: '25px', minWidth:'120px'}} onClick={colorBlue}><p className='p-listcolor' style={{color:'rgb(60, 140, 200)'}}>A</p><p style={{fontSize:'.9em'}}>Blue</p></button>
        <button className='btn-listcolor' style={{height: '25px', minWidth:'120px'}} onClick={colorPurple}><p className='p-listcolor' style={{color:'rgb(90, 80, 200)'}}>A</p><p style={{fontSize:'.9em'}}>Purple</p></button>
        <button className='btn-listcolor' style={{height: '25px', minWidth:'120px'}} onClick={colorViolet}><p className='p-listcolor' style={{color:'rgb(200, 80, 190)'}}>A</p><p style={{fontSize:'.9em'}}>Violet</p></button>

        <div className='divider-x' style={{marginTop:'4px', marginBottom:'4px'}}></div>

        <button className='btn-listcolor' style={{height: '25px', minWidth:'120px'}} onClick={colorFillDefault}><p className='p-listcolor' style={{backgroundColor:'rgb(0, 0, 0, 0)'}}>A</p><p style={{fontSize:'.9em'}}>Default</p></button>
        <button className='btn-listcolor' style={{height: '25px', minWidth:'120px'}} onClick={colorFillGrey}><p className='p-listcolor' style={{backgroundColor:'rgb(240, 240, 240)'}}>A</p><p style={{fontSize:'.9em'}}>Grey</p></button>
        <button className='btn-listcolor' style={{height: '25px', minWidth:'120px'}} onClick={colorFillRed}><p className='p-listcolor' style={{backgroundColor:'rgb(210, 0, 0, .1)'}}>A</p><p style={{fontSize:'.9em'}}>Red</p></button>
        <button className='btn-listcolor' style={{height: '25px', minWidth:'120px'}} onClick={colorFillOrange}><p className='p-listcolor' style={{backgroundColor:'rgb(255, 100, 0, .1)'}}>A</p><p style={{fontSize:'.9em'}}>Orange</p></button>
        <button className='btn-listcolor' style={{height: '25px', minWidth:'120px'}} onClick={colorFillGreen}><p className='p-listcolor' style={{backgroundColor:'rgb(0, 210, 0, .1)'}}>A</p><p style={{fontSize:'.9em'}}>Green</p></button>
        <button className='btn-listcolor' style={{height: '25px', minWidth:'120px'}} onClick={colorFillBlue}><p className='p-listcolor' style={{backgroundColor:'rgb(0, 100, 210, 0.1)'}}>A</p><p style={{fontSize:'.9em'}}>Blue</p></button>
        <button className='btn-listcolor' style={{height: '25px', minWidth:'120px'}} onClick={colorFillPurple}><p className='p-listcolor' style={{backgroundColor:'rgb(120, 80, 210, 0.1)'}}>A</p><p style={{fontSize:'.9em'}}>Purple</p></button>
        <button className='btn-listcolor' style={{height: '25px', minWidth:'120px'}} onClick={colorFillViolet}><p className='p-listcolor' style={{backgroundColor:'rgb(210, 80 , 210, 0.1)'}}>A</p><p style={{fontSize:'.9em'}}>Violet</p></button>
      </div>
      : null
    }
    <div className='div-listbox' ref={ref}
    style={{position:'relative', opacity:opacity.opacity, zIndex:1, left: nodeLeft, top: listTop.top, width:'fit-content', height:'27px', flexDirection:'row'}}>

      <button className='btn-list' style={{borderTopLeftRadius:'4px', borderBottomLeftRadius:'4px', height: '27px', minWidth:'55px', fontSize:'.8em'}} onClick={()=>{handleBlockChange()}}>Text <TbChevronDown color='rgba(0,0,0,.6)' size={8}/></button>

      <div className='divider-y'></div>

      <button className='btn-list' style={{height: '27px', minWidth:'22px', fontWeight:800, fontSize:'.7em'}} onClick={setBold}>B</button>
      <button className='btn-list' style={{height: '27px', minWidth:'18px', fontWeight:400, fontStyle:'italic', fontSize:'.7em'}} onClick={setItalic}>i</button>
      <button className='btn-list' style={{height: '27px', minWidth:'21px', fontWeight:400, textDecoration:'underline', fontSize:'.7em'}} onClick={setUnderline}>U</button>
      <button className='btn-list' style={{height: '27px', minWidth:'21px', fontWeight:400, textDecoration:'line-through', fontSize:'.7em'}} onClick={setStrike}>S</button>
      <div className='divider-y'></div>

      <button className='btn-list' style={{height: '27px', minWidth:'40px', fontSize:'.8em'}} onClick={()=>{handleColor()}}>A <TbChevronDown color='rgba(0,0,0,.6)' size={8}/></button>

      <div className='divider-y'></div>

      <button className='btn-list' style={{height: '27px', minWidth:'fit-content'}}><TbCopy size={14}/></button>
      <button className='btn-list' style={{borderTopRightRadius:'4px', borderBottomRightRadius:'4px', height: '27px', minWidth:'fit-content'}} onClick={deleteSelection}><TbTrash size={14}/></button>
    </div>
  </div>
  </>
  )
}

export default function Page({menuClick, fontStyle}) {
  const [hoveringNode, setHoveringNode] = useState({active:false, left:null, top:null, width:null, height:null})
  const [selectedNode, setSelectedNode] = useState({active:false})

  const [fileName, setFileName] = useState({fileOpen:false, fileName:'Untitled'})
  const [isFavorite, setFavorite] = useState({isFavorite:false})

  const [editorDimensions, setEditorDimensions] = useState({})

  const ref = useRef(null);

  /*
  useEffect(() => {
    const interval = setInterval(() => {
    EditorDimensions()
    }, 500);
    return () => clearInterval(interval);
  } , []);

  const EditorDimensions = () => {
      try{
          const { width } = ref.current.getBoundingClientRect()
          const { innerHeight } = window;
          ipcRenderer.send('message', width)
          
          width, if width is below <800,
            set padding 100px, 100px,
            set editor to width.

          if(width<800){

          }

          if(width>800){

          }
          
      }
      catch{}
  }
  */

  const editor = useEditor({
    onSelectionUpdate(){
      updateSelection()
    },
    onUpdate(){
      updateSelection()
      ipcRenderer.send("message", editor.getHTML())
    },

    extensions: [
      Document, Text, ListItem, TextStyle, Color, History, HardBreak, CharacterCount,
      Paragraph, Title, Subtitle, LargeText,
      Highlight.configure({ multicolor: true }),
      BulletList.configure({
        HTMLAttributes: {
          class: 'is-bulletlist',
        },
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: 'is-orderedlist',
        },
      }),
      Underline.configure({
        HTMLAttributes: {
          class: 'is-underline',
        },
      }),
      Bold.configure({
        HTMLAttributes: {
          class: 'is-bold',
        },
      }),
      Italic.configure({
        HTMLAttributes: {
          class: 'is-italic',
        },
      }),
      Strike.configure({
        HTMLAttributes: {
          class: 'is-strike',
        },
      }),
      ],
    }
  )

  const updateSelection=()=>{
    try {
      const {$from, $to, from, to} = editor.state.selection
      if($from.parent.isBlock ){
        const node = editor.view.nodeDOM($from.before($from.depth))
        if(node){
          const rect = node.getBoundingClientRect(); 
          
          ipcRenderer.send('message', `Top : ${rect.top}, Left : ${rect.left}, Height : ${rect.height}, Width : ${rect.width}`)

          const text = editor.state.doc.textBetween(from, to, ' ').length
          if(text>=1){setSelectedNode({active:true})}
          else{setSelectedNode({active:false})}

          let Left = rect.left; let Top = rect.top
          let Height = rect.height; let Width = rect.width

          if(editor.isActive('bulletList') || editor.isActive('orderedList')){Left-=15}
          
          setHoveringNode({active:true,
            left:Left,
            top:Top,
            height:Height,
            width:Width
          })
        }
    }
    }
     catch (error) {
      setHoveringNode({
        active: false,
        left:null,
        top:null,
        height:null,
        width:null
      });
    }
  }

  const addNewBlock=()=>{
    const { $to } = editor.state.selection;
    editor.commands.focus($to.end())
    editor.chain().insertContentAt($to.end(), {type: "paragraph"}).focus($to.end()).run()
  }

  const selectNode=()=>{
    const { $to } = editor.state.selection;
    editor.commands.setTextSelection({ from: $to.start(), to: $to.end()})
    setSelectedNode({active:true})
  }

  const handleFavorite=()=>{
    if(!isFavorite.isFavorite){
      setFavorite({isFavorite:true})}
    else{setFavorite({isFavorite:false})}
  }

  if (!editor) {
    return null
  }

  return (
    <div className='Page'>

      {selectedNode.active ? <NodeList close={()=>{setSelectedNode({active:false}); const{$to}=editor.state.selection; editor.commands.focus($to.end())}}
      nodeLeft={hoveringNode.left} nodeTop={hoveringNode.top} nodeHeight={hoveringNode.height}
      deleteSelection={()=>{editor.commands.deleteSelection()}}

      setBold={()=>{editor.chain().toggleBold().run()}} setItalic={()=>{editor.chain().toggleItalic().run()}}
      setUnderline={()=>{editor.chain().toggleUnderline().run()}} setStrike={()=>{editor.chain().toggleStrike().run()}}

      setText={()=>{editor.chain().focus().setParagraph().run()}}
      setTitle={()=>{editor.chain().focus().setTitle().run()}}
      setSubtitle={()=>{editor.chain().focus().setSubtitle().run()}}
      setLargeText={()=>{editor.chain().focus().setLargeText().run()}}
      setOrderedList={()=>{editor.chain().focus().toggleOrderedList().run()}}
      setBulletList={()=>{editor.chain().focus().toggleBulletList().run()}}

      clearFormatting={()=>{editor.chain().focus().unsetColor().run(); editor.chain().focus().unsetHighlight().run();}}
      colorDefault={()=>{editor.chain().focus().unsetColor().run()}} colorFillDefault={()=>{editor.chain().focus().unsetHighlight().run()}} /* default */
      colorGrey={()=>{editor.chain().focus().setColor('#969696').run()}} colorFillGrey={()=>{editor.chain().focus().toggleHighlight({ color: '#f0f0f0' }).run()}} /* grey */
      colorRed={()=>{editor.chain().focus().setColor('#c85050').run()}} colorFillRed={()=>{editor.chain().focus().toggleHighlight({ color: '#d200001a' }).run()}} /* red */
      colorOrange={()=>{editor.chain().focus().setColor('#c87850').run()}} colorFillOrange={()=>{editor.chain().focus().toggleHighlight({ color: '#ff64001a' }).run()}} /* orange */
      colorGreen={()=>{editor.chain().focus().setColor('#5aa050').run()}} colorFillGreen={()=>{editor.chain().focus().toggleHighlight({ color: '#00d2001a' }).run()}} /* green */
      colorBlue={()=>{editor.chain().focus().setColor('#3c8cc8').run()}} colorFillBlue={()=>{editor.chain().focus().toggleHighlight({ color: '#0064d21a' }).run()}} /* blue */
      colorPurple={()=>{editor.chain().focus().setColor('#5a50c8').run()}} colorFillPurple={()=>{editor.chain().focus().toggleHighlight({ color: '#7850d21a' }).run()}} /* purple */
      colorViolet={()=>{editor.chain().focus().setColor('#c850be').run()}} colorFillViolet={()=>{editor.chain().focus().toggleHighlight({ color: '#d250d21a' }).run()}} /* red */
      />
      : null}

        <div className='PageInterface'>
          <div className='PageHeader'>
            <div className='PageHeader-left'>
              <div style={{marginLeft:'10px'}}></div>
              <button className='PageHeader-btn' style={{color:'rgba(0,0,0,.6)', letterSpacing:'.25px'}}>{fileName.fileName}</button>

              <div className='divider-y' style={{height:'50%'}}></div>

              <button className='PageHeader-btn'><GoRepoPush size={14}/></button>
            </div>
            <div className='PageHeader-right'>
              <button className='PageHeader-btn' onClick={()=>{editor.chain().focus().undo().run()}}><GoChevronLeft size={14}/></button>
              <button className='PageHeader-btn' onClick={()=>{editor.chain().focus().redo().run()}}><GoChevronRight size={14}/></button>

              <div className='divider-y' style={{height:'50%'}}></div>

              <button className='PageHeader-btn' onClick={()=>{handleFavorite()}}>{isFavorite.isFavorite ? <GoBookmarkFill color='#ffd012' size={14}/> : <GoBookmark color='#ffd012' size={14}/>}</button>
              <button className='PageHeader-btn' style={{zIndex:25}} onClick={menuClick}><GoKebabHorizontal size={14}/></button>
              <div style={{marginRight:'10px'}}></div>
            </div>
          </div>

        {editor && hoveringNode.active ? 
          <>
          <div style={{top:hoveringNode.top, left:hoveringNode.left-50, height:hoveringNode.height}} className='extension-div'>
            <Plus className="extension-btn"
            onClick={()=>{addNewBlock()}} size={15} strokeWidth={1.5}></Plus>

          <GripVertical className="extension-btn"
            onClick={()=>{selectNode()}} size={15} strokeWidth={1.5}></GripVertical>
          </div>
          </>
        : null}
      
        <EditorContent editor={editor} style={{fontFamily:fontStyle}} spellCheck={false} ref={ref} className='Editor'/>
        </div>
    </div>
    )
}

/* NEED TO BE DONE?

- the 'more' button in editor opens tab in App.js, showing all features.
  - will include folders button, serif/sans-serif button, favorite, word count, date of last updated, date of creation, author (if optional).
  
- the 'Untitled' button, used for fileNames, if clicked will show a tab in App.js of all the files in current folder.
   - will include two sections, one is of all files, another is of just favorites.
   - a search feature will need to be considered.
   
- get the 'favorite' button working, once fileNames is set up.
- get the 'save' button working, again, once fileNames is set up.

*/