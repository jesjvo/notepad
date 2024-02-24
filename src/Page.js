import React, {useState, useEffect, useRef} from 'react'
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import CharacterCount from '@tiptap/extension-character-count';
import Placeholder from '@tiptap/extension-placeholder'

//pages
import './Page.css'
import './App.css';

//icons
import { FaCaretLeft } from "react-icons/fa";
import { FaCaretRight } from "react-icons/fa6";

import {
        LuHeading1, LuHeading2, LuHeading3, LuListOrdered, LuList, LuTextCursor,
        LuFoldVertical, LuAlignCenter, LuAlignRight, LuAlignLeft 
      }
from "react-icons/lu";

import { GrAdd, GrDrag, GrPrevious, GrNext, GrBookmark, GrCatalogOption, GrMore } from "react-icons/gr";

//styles
const IconStyle={borderRadius:'4px', padding:'4px', width:'18px', height:'18px'}

const ipcRenderer = window.require("electron").ipcRenderer;

export function SelectContentPopUp({close, leftDom, topDom}){
  const popupRef = useRef(null);
  const [position, setPosition] = useState({ x: leftDom, y: topDom });

  useEffect(() => {
    const updatePosition = () => {
      const { top, height, left, width } = popupRef.current.getBoundingClientRect();
      const { innerWidth, innerHeight } = window;
      let newX = position.x;
      let newY = position.y;

      if(left + width > innerWidth) {}
      if(left < 0) {newX = 10}

      if (top + height > innerHeight) {newY = innerHeight - (innerHeight - position.y) - height - 50}
      if (top < 0) {newY = 10}

      setPosition({ x: newX, y: newY });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('resize', updatePosition);
    };
    }, [position]);

  return(
    <div className='backgroundPopUp'>
      <div className='backgroundPopUpClose' onClick={close}></div>
       <div className='popUp' ref={popupRef}
       style={{left: position.x, top: position.y}}>
          <button>Bold</button>
       </div>
    </div>
  )
}

export function NewContentPopUp({close, leftDom, topDom}){
  const popupRef = useRef(null);
  const [position, setPosition] = useState({ x: leftDom, y: topDom });

  useEffect(() => {
    const updatePosition = () => {
      const { top, height } = popupRef.current.getBoundingClientRect();
      const { innerHeight } = window;
      let newX = position.x;
      let newY = position.y;

      if (top + height > innerHeight) {newY = innerHeight - (innerHeight - position.y) - height - 50}
      if (top < 0) {newY = 10}

      setPosition({ x: newX, y: newY });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('resize', updatePosition);
    };
    }, [position]);

  return(
    <div className='backgroundPopUp'>
      <div className='backgroundPopUpClose' onClick={close}></div>
       <div className='popUp' ref={popupRef}
       style={{left: position.x, top: position.y}}>
          <button className='popUpBtn'>
            <LuTextCursor className='popUpIcon' strokeWidth={1}/>
            <p className='popUpP'><strong>Text</strong><br></br>Basic text</p>
          </button>
          <button className='popUpBtn'>
            <LuHeading1 className='popUpIcon' strokeWidth={1}/>
            <p className='popUpP'><strong>Header 1</strong><br></br>Titles</p>
          </button>
          <button className='popUpBtn'>
            <LuHeading2 className='popUpIcon' strokeWidth={1}/>
            <p className='popUpP'><strong>Header 2</strong><br></br>Subtitles</p>
          </button>
          <button className='popUpBtn'>
            <LuHeading3 className='popUpIcon' strokeWidth={1}/>
            <p className='popUpP'><strong>Header 3</strong><br></br>Large text</p>
          </button>
          <button className='popUpBtn'>
            <LuListOrdered className='popUpIcon' strokeWidth={1}/>
            <p className='popUpP'><strong>Number List</strong><br></br>Integers</p>
          </button>
          <button className='popUpBtn'>
            <LuList className='popUpIcon' strokeWidth={1}/>
            <p className='popUpP'><strong>Ordered List</strong><br></br>Dots</p>
          </button>
          <button className='popUpBtn'>
            <LuFoldVertical className='popUpIcon' strokeWidth={1}/>
            <p className='popUpP'><strong>Divider</strong><br></br>Border line</p>
          </button>
      </div>
    </div>   
  )
}



export default function Page({openPage}) {

  const [WidthText, setWidthText] = useState('65px')
  const handleWidthText=()=>{if(WidthText==='65px'){setWidthText('170px')}else{setWidthText('65px')}}
  
  const [WidthAlign, setWidthAlign] = useState('65px')
  const handleWidthAlign=()=>{if(WidthAlign==='65px'){setWidthAlign('170px') }else{setWidthAlign('65px')}}

  const [WidthList, setWidthList] = useState('65px')
  const handleWidthList=()=>{if(WidthList==='65px'){setWidthList('170px') }else{setWidthList('65px')}}

  const [hoveringNode, setHoveringNode] = useState({active:false, left:null, top:null}) //hovering button on editor
  const [characterHover, setCharacterHover] = useState(true) //character/words div

  const [newContentDisplay, setNewContentDisplay] = useState(false)
  const [selectContentDisplay, setSelectContentDisplay] = useState(false)


  const editor = useEditor({
    onUpdate({ editor }){
      updateSelection()
    }, 
    onSelectionUpdate({ editor }) {
      updateSelection()
    },
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      CharacterCount,
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === 'heading' || 'paragraph') {
            return 'Type something here...'
          }
        },
      }),
      ],
    }
  )

  const updateSelection=()=>{
    try {
      const {$from} = editor.state.selection
      if($from.parent.type.name === 'paragraph' || 'heading'){
      if ($from.parent.isBlock ) {
        const node = editor.view.nodeDOM($from.before($from.depth))
        if(node){
          const rect = node.getBoundingClientRect();
          setHoveringNode({
            active: true,
            left:rect.left,
            top:rect.top
          });
        }
      }
    }
    } catch (error) {
      setHoveringNode({
        active: false,
        left:null,
        top:null
      });
    }
  }

  const selectContent=()=>{
    const { selection } = editor.state;
    const { $from, $to } = selection;
    editor.commands.setTextSelection({ from: $from.start(), to: $to.end()})
    setSelectContentDisplay(true)
  }

  const addNewContent=()=>{
    const { selection } = editor.state;
    const { $to } = selection;
    editor.commands.focus($to.end())
    editor.chain().insertContentAt($to.end(), {type: "paragraph"}).focus($to.end()).run()
    updateSelection()
    setNewContentDisplay(true)
  }

  if (!editor) {
    return null
  }

  return (
    <div className='Page'>
      {newContentDisplay ? <NewContentPopUp close={()=>{setNewContentDisplay(false)}} leftDom={hoveringNode.left} topDom={hoveringNode.top}/>: null}
      {selectContentDisplay ? <SelectContentPopUp close={()=>{setSelectContentDisplay(false)}} leftDom={hoveringNode.left} topDom={hoveringNode.top}/>: null}
        <div className='PageInterface'>
          <div className='PageHeader'>
            <div className='PageHeader-left'>
              <div></div>
              <button className='headerBtn'
              onClick={openPage}>
                <GrCatalogOption size={16}/>
              </button>
              <button className='headerBtn'>
                Save
              </button>
            </div>
            <div className='PageHeader-right'>
              <button className='headerBtn'
                >
                <GrBookmark size={16} color='gold'/>
              </button>
              <button className='headerBtn'
                onClick={() => editor.chain().focus().undo().run()}>
                <GrPrevious size={16}/>
              </button>
              <button className='headerBtn'
                onClick={() => editor.chain().focus().redo().run()}>
                <GrNext size={16}/>
              </button>
                <button className='headerBtn'
                >
                <GrMore size={16}/>
                </button>
              <div></div>
            </div>
          </div>

        {
        editor && <BubbleMenu className="floating-menu" tippyOptions={{ duration: 500, delay: 1000 }} editor={editor}>
          {hoveringNode.active ?
            <div className='editorMenu'>
            <button
                style={{minWidth:'25px', fontWeight:'bold', borderTopLeftRadius:'4px', borderBottomLeftRadius:'4px'}}
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={editor.isActive('bold') ? 'is-active' : 'hello'}>
              B
            </button>
          
            <button
                style={{minWidth:'25px', fontStyle:'italic'}}
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={editor.isActive('italic') ? 'is-active' : ''}>
              i
            </button>

            <button
                style={{minWidth:'25px', textDecoration:'underline'}}
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={editor.isActive('underline') ? 'is-active' : ''}>
              U
            </button>

            <button
                style={{minWidth:'25px', textDecoration:'line-through', borderRight:'solid 1px rgba(0,0,0,.06)'}}
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={editor.isActive('strike') ? 'is-active' : ''}>
              S
            </button>

            <div style={{width:WidthText, display:'flex', alignItems:'center', transition:'.2s', borderRight:'solid 1px rgba(0,0,0,.06)'}}
            >
              <button     
                style={{minWidth:'65px', letterSpacing:'.25px'}}
                onClick={()=>{handleWidthText()}}>
              Text {WidthText==='170px' ? <FaCaretLeft size={12}/> : <FaCaretRight size={12}/>}
              </button>
            {WidthText==='170px' ?
            <>
            <button 
                style={{minWidth:'35px'}}
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
              <LuHeading1 style={IconStyle} strokeWidth={1.5}/>
            </button>
            <button 
                style={{minWidth:'35px'}}
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
              <LuHeading2 style={IconStyle} strokeWidth={1.5}/>
            </button>
            <button 
                style={{minWidth:'35px'}}
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
              <LuHeading3 style={IconStyle} strokeWidth={1.5}/>
            </button>
            </>
            :  null}
            </div>
            
            <div style={{width:WidthList, borderRight:'solid 1px rgba(0,0,0,.06)', display:'flex', alignItems:'center', transition:'.2s'}}
            >
              <button     
                style={{minWidth:'65px', letterSpacing:'.25px'}}
                onClick={()=>{handleWidthList()}}>
              List {WidthList==='170px' ? <FaCaretLeft size={12}/> : <FaCaretRight size={12}/>}
              </button>
            {WidthList==='170px' ?
              <>
              <button 
                  style={{minWidth:'35px'}}
                  onClick={() => editor.chain().focus().toggleBulletList().run()}>
                <LuList style={IconStyle} strokeWidth={1.5}/>
              </button>
              <button 
                  style={{minWidth:'35px'}}
                  onClick={() => editor.chain().focus().toggleOrderedList().run()}>
                <LuListOrdered style={IconStyle} strokeWidth={1.5}/>
              </button>
              <button 
                  style={{minWidth:'35px'}}
                  onClick={() => editor.chain().focus().setHorizontalRule().run()}>
                <LuFoldVertical style={IconStyle} strokeWidth={1.5}/>
              </button>
              </>
              :  null}
            </div>
            
            <div style={{width:WidthAlign, display:'flex', alignItems:'center', transition:'.2s', borderTopRightRadius:'4px', borderBottomRightRadius:'4px'}}
            >
              <button     
                style={{minWidth:'65px', borderTopRightRadius:'4px', borderBottomRightRadius:'4px', letterSpacing:'.25px'}}
                onClick={()=>{handleWidthAlign()}}>
              Align {WidthAlign==='170px' ? <FaCaretLeft size={12}/> : <FaCaretRight size={12}/>}
              </button>
            {WidthAlign==='170px' ?
              <>
              <button 
                  style={{minWidth:'35px'}}
                  onClick={() => editor.chain().focus().setTextAlign('left').run()}>
                <LuAlignLeft style={IconStyle} strokeWidth={1.5}/>
              </button>
              <button 
                  style={{minWidth:'35px'}}
                  onClick={() => editor.chain().focus().setTextAlign('center').run()}>
                <LuAlignCenter style={IconStyle} strokeWidth={1.5}/>
              </button>
              <button 
                  style={{minWidth:'35px', borderTopRightRadius:'4px', borderBottomRightRadius:'4px'}}
                  onClick={() => editor.chain().focus().setTextAlign('right').run()}>
                <LuAlignRight style={IconStyle} strokeWidth={1.5}/>
              </button>
              </>
              :  null}
            </div>
          </div> : null}
        </BubbleMenu>
        }

        {editor && hoveringNode.active ?  
        <>
          <button
          style={{position:'absolute', top:hoveringNode.top, left:hoveringNode.left-40, zIndex:100}}
          className='selectContentBtn' onClick={()=>{selectContent()}}><GrDrag size={14}/></button>
          <button
          style={{position:'absolute', top:hoveringNode.top, left:hoveringNode.left-70, zIndex:100}}
          className='selectContentBtn' onClick={()=>{addNewContent()}}><GrAdd size={14}/></button>
        </>
        : null }
      
        <EditorContent editor={editor}/>
          
        <div className='PageBottom'>
          <div></div>
          <div className="character-count" onMouseEnter={()=>setCharacterHover(false)} onMouseLeave={()=>setCharacterHover(true)}>
              {characterHover ?
              <div>
              {editor.storage.characterCount.words()} Words
              </div> :
              <div>
              {editor.storage.characterCount.characters()} Characters
              </div>
            }
          </div>
        </div>
        </div>
    </div>
    )
}