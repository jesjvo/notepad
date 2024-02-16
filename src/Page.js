import React, {useState} from 'react'
import { FloatingMenu, useEditor, EditorContent, BubbleMenu } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import CharacterCount from '@tiptap/extension-character-count';

//pages
import './Page.css'
import './App.css';

//icons
import { FaCaretLeft } from "react-icons/fa";
import { FaCaretRight } from "react-icons/fa6";
import { IoIosRedo } from "react-icons/io";
import { IoIosUndo } from "react-icons/io";
import {
        LuHeading1, LuHeading2, LuHeading3, LuListOrdered, LuList,
        LuFoldVertical, LuType, LuAlignCenter, LuAlignRight, LuAlignLeft 
      }
from "react-icons/lu";

//styles
const IconStyle={borderRadius:'4px', padding:'4px', width:'18px', height:'18px'}

const ipcRenderer = window.require("electron").ipcRenderer;

export default function Page() {
  const [WidthText, setWidthText] = useState('65px')
  const handleWidthText=()=>{if(WidthText==='65px'){setWidthText('170px')}else{setWidthText('65px')}}
  
  const [WidthAlign, setWidthAlign] = useState('65px')
  const handleWidthAlign=()=>{if(WidthAlign==='65px'){setWidthAlign('170px') }else{setWidthAlign('65px')}}

  const [WidthList, setWidthList] = useState('65px')
  const handleWidthList=()=>{if(WidthList==='65px'){setWidthList('170px') }else{setWidthList('65px')}}

  const [hoveringNode, setHoveringNode] = useState({active:false, left:null, top:null})

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
      ],
    }
  )

  const updateSelection=()=>{
    try {
      const { $from} = editor.state.selection
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
          ipcRenderer.send('message', rect.top)
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
    editor.commands.setBold()
  }

  return (
    <div className='Page'>
        <div className='PageInterface'>
          <div className='PageHeader'>
            
            <button className='selectContentBtn' style={{margin:'2.5px', width:'25px', height:'25px'}}
            onClick={() => editor.chain().focus().undo().run()}
          ><IoIosUndo/></button>
          <button className='selectContentBtn' style={{margin:'2.5px', width:'25px', height:'25px'}}
            onClick={() => editor.chain().focus().redo().run()}
          ><IoIosRedo/></button>
          </div>

        {
        editor && <BubbleMenu className="floating-menu" tippyOptions={{ duration: 500 }} editor={editor}>
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
            onMouseLeave={()=>{setWidthText('65px')}}>
              <button     
                style={{minWidth:'65px'}}
                onClick={()=>{handleWidthText()}}>
              Text {WidthText==='170px' ? <FaCaretLeft size={12}/> : <FaCaretRight size={12}/>}
              </button>
            {WidthText==='170px' ?
            <>
            <button 
                style={{minWidth:'35px'}}
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
              <LuHeading1 style={IconStyle}/>
            </button>
            <button 
                style={{minWidth:'35px'}}
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
              <LuHeading2 style={IconStyle}/>
            </button>
            <button 
                style={{minWidth:'35px'}}
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
              <LuHeading3 style={IconStyle}/>
            </button>
            </>
            :  null}
            </div>
            
            <div style={{width:WidthList, borderRight:'solid 1px rgba(0,0,0,.06)', display:'flex', alignItems:'center', transition:'.2s'}}
            onMouseLeave={()=>{setWidthList('65px')}}>
              <button     
                style={{minWidth:'65px'}}
                onClick={()=>{handleWidthList()}}>
              List {WidthList==='170px' ? <FaCaretLeft size={12}/> : <FaCaretRight size={12}/>}
              </button>
            {WidthList==='170px' ?
              <>
              <button 
                  style={{minWidth:'35px'}}
                  onClick={() => editor.chain().focus().toggleBulletList().run()}>
                <LuList style={IconStyle}/>
              </button>
              <button 
                  style={{minWidth:'35px'}}
                  onClick={() => editor.chain().focus().toggleOrderedList().run()}>
                <LuListOrdered style={IconStyle}/>
              </button>
              <button 
                  style={{minWidth:'35px'}}
                  onClick={() => editor.chain().focus().setHorizontalRule().run()}>
                <LuFoldVertical style={IconStyle}/>
              </button>
              </>
              :  null}
            </div>
            
            <div style={{width:WidthAlign, display:'flex', alignItems:'center', transition:'.2s', borderTopRightRadius:'4px', borderBottomRightRadius:'4px'}}
            onMouseLeave={()=>{setWidthAlign('65px')}}>
              <button     
                style={{minWidth:'65px', borderTopRightRadius:'4px', borderBottomRightRadius:'4px'}}
                onClick={()=>{handleWidthAlign()}}>
              Align {WidthAlign==='170px' ? <FaCaretLeft size={12}/> : <FaCaretRight size={12}/>}
              </button>
            {WidthAlign==='170px' ?
              <>
              <button 
                  style={{minWidth:'35px'}}
                  onClick={() => editor.chain().focus().setTextAlign('left').run()}>
                <LuAlignLeft style={IconStyle}/>
              </button>
              <button 
                  style={{minWidth:'35px'}}
                  onClick={() => editor.chain().focus().setTextAlign('center').run()}>
                <LuAlignCenter style={IconStyle}/>
              </button>
              <button 
                  style={{minWidth:'35px', borderTopRightRadius:'4px', borderBottomRightRadius:'4px'}}
                  onClick={() => editor.chain().focus().setTextAlign('right').run()}>
                <LuAlignRight style={IconStyle}/>
              </button>
              </>
              :  null}
            </div>
          </div>
        </BubbleMenu>
        }

        {editor && hoveringNode.active ? 
        <>
          <button
          style={{position:'absolute', top:hoveringNode.top, left:hoveringNode.left-40, zIndex:100}}
          className='selectContentBtn' onClick={()=>{selectContent()}}>+</button>
        </>
        : null }

        <EditorContent editor={editor} />
        </div>
    </div>
    )
}