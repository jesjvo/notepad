import React, {useState, useEffect, useRef} from 'react'
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import CharacterCount from '@tiptap/extension-character-count';
import Placeholder from '@tiptap/extension-placeholder'
import TaskItem from '@tiptap/extension-task-item';
import Highlight from '@tiptap/extension-highlight';
import TaskList from '@tiptap/extension-task-list';
import Italic from '@tiptap/extension-italic';
import Bold from '@tiptap/extension-bold';
import { Color } from '@tiptap/extension-color'

//css
import './Page.css'
import './App.css';

//icons
import {LuHeading1, LuHeading2, LuHeading3, LuListOrdered, LuList, LuTextCursor,
        LuFoldVertical, LuAlignCenter, LuAlignRight, LuAlignLeft, LuCopy, LuDelete, LuListChecks, LuBold, LuItalic, LuUnderline, LuStrikethrough} from "react-icons/lu";
import { GrAdd, GrDrag, GrPrevious, GrNext, GrBookmark, GrSearch, GrMore } from "react-icons/gr";

const ipcRenderer = window.require("electron").ipcRenderer;

export function SelectContentPopUp({close, leftDom, topDom, setBold, setItalic, setUnderline, setStrike, setAlignLeft, setAlignCenter, setAlignRight,
                                    setOrderedList, setBulletList, setCheckList, setHeader1, setHeader2, setHeader3, setParagraph}){
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
       style={{left: position.x, top: position.y, width: '120px', padding:'2px', maxHeight:'238px'}}>

          <button className='popUpBtn' style={{height:'28px'}} onClick={setBold}>
            <LuBold className='popUpIcon' style={{width: '15px', height: '15px', padding: '2px'}} strokeWidth={2}/>
            <p className='popUpP'> Bold</p>
          </button>
          <button className='popUpBtn' style={{height:'28px'}} onClick={setItalic}>
            <LuItalic className='popUpIcon' style={{width: '15px', height: '15px', padding: '2px'}} strokeWidth={2}/>
            <p className='popUpP'> Italic</p>
          </button>
          <button className='popUpBtn' style={{height:'28px'}} onClick={setUnderline}>
            <LuUnderline className='popUpIcon' style={{width: '15px', height: '15px', padding: '2px'}} strokeWidth={2}/>
            <p className='popUpP'> Underline</p>
          </button>
          <button className='popUpBtn' style={{height:'28px'}} onClick={setStrike}>
            <LuStrikethrough className='popUpIcon' style={{width: '15px', height: '15px', padding: '2px'}} strokeWidth={2}/>
            <p className='popUpP'> Strike</p>
          </button>

          <div className='divider-x' style={{marginTop:'3px', marginBottom:'3px', alignSelf:'center'}}></div>

          <button className='popUpBtn' style={{height:'28px'}} onClick={setAlignLeft}>
            <LuAlignLeft className='popUpIcon' style={{width: '15px', height: '15px', padding: '2px'}} strokeWidth={2}/>
            <p className='popUpP'>Left</p>
          </button>
          <button className='popUpBtn' style={{height:'28px'}} onClick={setAlignCenter}>
            <LuAlignCenter className='popUpIcon' style={{width: '15px', height: '15px', padding: '2px'}} strokeWidth={2}/>
            <p className='popUpP'>Center</p>
          </button>
          <button className='popUpBtn' style={{height:'28px'}} onClick={setAlignRight}>
            <LuAlignRight className='popUpIcon' style={{width: '15px', height: '15px', padding: '2px'}} strokeWidth={2}/>
            <p className='popUpP'>Right</p>
          </button>

          <div className='divider-x' style={{marginTop:'3px', marginBottom:'3px', alignSelf:'center'}}></div>

          <button className='popUpBtn' style={{height:'28px'}}>
            <LuCopy className='popUpIcon' style={{width: '15px', height: '15px', padding: '2px'}} color='green' strokeWidth={2}/>
            <p className='popUpP'> Copy</p>
          </button>
          <button className='popUpBtn' style={{height:'28px'}}>
            <LuDelete className='popUpIcon' style={{width: '15px', height: '15px', padding: '2px'}} color='red' strokeWidth={2}/>
            <p className='popUpP'> Delete</p>
          </button>

          <div className='divider-x' style={{marginTop:'3px', marginBottom:'3px', alignSelf:'center'}}></div>

          <button className='popUpBtn' style={{height:'28px'}} onClick={setBulletList}>
            <LuList className='popUpIcon' style={{width: '15px', height: '15px', padding: '2px'}} strokeWidth={2}/>
            <p className='popUpP'>Bullet list</p>
          </button>
          <button className='popUpBtn' style={{height:'28px'}} onClick={setOrderedList}>
            <LuListOrdered className='popUpIcon' style={{width: '15px', height: '15px', padding: '2px'}} strokeWidth={2}/>
            <p className='popUpP'>Ordered list</p>
          </button>
          <button className='popUpBtn' style={{height:'28px'}} onClick={setCheckList}>
            <LuListChecks className='popUpIcon' style={{width: '15px', height: '15px', padding: '2px'}} strokeWidth={2}/>
            <p className='popUpP'>Check list</p>
          </button>

          <div className='divider-x' style={{marginTop:'3px', marginBottom:'3px', alignSelf:'center'}}></div>

          <button className='popUpBtn' style={{height:'28px'}} onClick={setParagraph}>
            <LuTextCursor className='popUpIcon' style={{width: '15px', height: '15px', padding: '2px'}} strokeWidth={2}/>
            <p className='popUpP'>Text</p>
          </button>
          <button className='popUpBtn' style={{height:'28px'}} onClick={setHeader1}>
            <LuHeading1 className='popUpIcon' style={{width: '15px', height: '15px', padding: '2px'}} strokeWidth={2}/>
            <p className='popUpP'>Heading 1</p>
          </button>
          <button className='popUpBtn' style={{height:'28px'}} onClick={setHeader2}>
            <LuHeading2 className='popUpIcon' style={{width: '15px', height: '15px', padding: '2px'}} strokeWidth={2}/>
            <p className='popUpP'>Heading 2</p>
          </button>
          <button className='popUpBtn' style={{height:'28px'}} onClick={setHeader3}>
            <LuHeading3 className='popUpIcon' style={{width: '15px', height: '15px', padding: '2px'}} strokeWidth={2}/>
            <p className='popUpP'>Heading 3</p>
          </button>
       </div>
    </div>
  )
}


export function NewContentPopUp({close, leftDom, topDom, setOrderedList, setBulletList, setCheckList, setParagraph, setHeader1, setHeader2, setHeader3, setDivider}){
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
       style={{left: position.x, top: position.y, width: '170px', padding:'4px', maxHeight:'250px'}}>
          <button className='popUpBtn' style={{height: '50px'}} onClick={setParagraph}>
            <LuTextCursor className='popUpIcon' style={{width: '35px', height: '35px', padding: '2px'}} strokeWidth={1}/>
            <p className='popUpP'><strong>Text</strong><br></br>Basic text</p>
          </button>
          <button className='popUpBtn' style={{height: '50px'}} onClick={setHeader1}>
            <LuHeading1 className='popUpIcon' style={{width: '35px', height: '35px', padding: '2px'}} strokeWidth={1}/>
            <p className='popUpP'><strong>Header 1</strong><br></br>Title</p>
          </button>
          <button className='popUpBtn' style={{height: '50px'}} onClick={setHeader2}>
            <LuHeading2 className='popUpIcon' style={{width: '35px', height: '35px', padding: '2px'}} strokeWidth={1}/>
            <p className='popUpP'><strong>Header 2</strong><br></br>Subtitle</p>
          </button>
          <button className='popUpBtn' style={{height: '50px'}} onClick={setHeader3}>
            <LuHeading3 className='popUpIcon' style={{width: '35px', height: '35px', padding: '2px'}} strokeWidth={1}/>
            <p className='popUpP'><strong>Header 3</strong><br></br>Large text</p>
          </button>
          <button className='popUpBtn' style={{height: '50px'}} onClick={setBulletList}>
            <LuList className='popUpIcon' style={{width: '35px', height: '35px', padding: '2px'}} strokeWidth={1}/>
            <p className='popUpP'><strong>Bullet List</strong><br></br>Dot-point list</p>
          </button>
          <button className='popUpBtn' style={{height: '50px'}} onClick={setOrderedList}>
            <LuListOrdered className='popUpIcon' style={{width: '35px', height: '35px', padding: '2px'}} strokeWidth={1}/>
            <p className='popUpP'><strong>Ordered List</strong><br></br>Integer list</p>
          </button>
          <button className='popUpBtn' style={{height: '50px'}} onClick={setCheckList}>
            <LuListChecks className='popUpIcon' style={{width: '35px', height: '35px', padding: '2px'}} strokeWidth={1}/>
            <p className='popUpP'><strong>Check List</strong><br></br>Checkbox list</p>
          </button>
          <button className='popUpBtn' style={{height: '50px'}} onClick={setDivider}>
            <LuFoldVertical className='popUpIcon' style={{width: '35px', height: '35px', padding: '2px'}} strokeWidth={1}/>
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
      Italic.configure({
        HTMLAttributes: {
          class: 'is-italic',
        },
      }),
      Bold.configure({
        HTMLAttributes: {
          class: 'is-bold',
        },
      }),
      Color,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Highlight.configure({ multicolor: true }),
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
    setNewContentDisplay(true)
    updateSelection()
  }

  //node commands
  const setBold=()=>{
    editor.chain().focus().toggleBold().run()
  }
  const setItalic=()=>{
    editor.chain().focus().toggleItalic().run()
  }
  const setUnderline=()=>{
    editor.chain().focus().toggleUnderline().run()
  }
  const setStrike=()=>{
    editor.chain().focus().toggleStrike().run()
  }
  const setAlignLeft=()=>{
    editor.chain().focus().setTextAlign('left').run()
  }
  const setAlignCenter=()=>{
    editor.chain().focus().setTextAlign('center').run()
  }
  const setAlignRight=()=>{
    editor.chain().focus().setTextAlign('right').run()
  }
  const setHighlightColor=(colorChoice)=>{
    editor.chain().focus().toggleHighlight({ color: colorChoice }).run()
  }
  const setColor=(colorChoice)=>{
    editor.chain().focus().setColor(colorChoice).run()
  }

  //block commands
  const setParagraph=()=>{
    editor.chain().focus().setParagraph().run()
  }
  const setHeader1=()=>{
    editor.chain().focus().toggleHeading({ level: 1 }).run()
  }
  const setHeader2=()=>{
    editor.chain().focus().toggleHeading({ level: 2 }).run()
  }
  const setHeader3=()=>{
    editor.chain().focus().toggleHeading({ level: 3 }).run()
  }
  const setOrderedList=()=>{
    editor.chain().focus().toggleOrderedList().run()
  }
  const setBulletList=()=>{
    editor.chain().focus().toggleBulletList().run()
  }
  const setCheckList=()=>{
    editor.commands.toggleTaskList()
  }
  const setDivider=()=>{
    editor.chain().focus().setHorizontalRule().run()
    const { selection }= editor.state
    const { $to } = selection;
    editor.commands.focus($to.end())
    editor.chain().insertContentAt($to.end(), {type: "paragraph"}).focus($to.end()).run()
  }

  if (!editor) {
    return null
  }

  return (
    <div className='Page'>
      {newContentDisplay ? <NewContentPopUp close={()=>{setNewContentDisplay(false)}} leftDom={hoveringNode.left} topDom={hoveringNode.top}
      setBulletList={()=>{setBulletList()}} setOrderedList={()=>{setOrderedList()}} setCheckList={()=>{setCheckList()}} setHeader1={()=>{setHeader1()}}
      setHeader2={()=>{setHeader2()}} setHeader3={()=>{setHeader3()}} setDivider={()=>{setDivider()}} setParagraph={()=>{setParagraph()}}/>: null}

      {selectContentDisplay ? <SelectContentPopUp close={()=>{setSelectContentDisplay(false)}} leftDom={hoveringNode.left} topDom={hoveringNode.top}
      setBold={()=>{setBold()}} setItalic={()=>{setItalic()}} setUnderline={()=>{setUnderline()}} setStrike={()=>{setStrike()}} setAlignLeft={()=>{setAlignLeft()}}
      setAlignCenter={()=>{setAlignCenter()}} setAlignRight={()=>{setAlignRight()}} setBulletList={()=>{setBulletList()}} setOrderedList={()=>{setOrderedList()}}
      setCheckList={()=>{setCheckList()}} setHeader1={()=>{setHeader1()}} setHeader2={()=>{setHeader2()}} setHeader3={()=>{setHeader3()}} setParagraph={()=>{setParagraph()}}
      />: null}
        <div className='PageInterface'>
          <div className='PageHeader'>
            <div className='PageHeader-left'>
              <div></div>
              <button className='headerBtn'
              onClick={openPage}>
                <GrSearch size={18}/>
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
            <div></div>
            : null}
        </BubbleMenu>
        }

        {editor && hoveringNode.active ?  
        <>
          <button
          style={{position:'absolute', top:hoveringNode.top, left:hoveringNode.left-50, zIndex:100}}
          className='selectContentBtn' onClick={()=>{selectContent()}}><GrDrag size={14}/></button>
          <button
          style={{position:'absolute', top:hoveringNode.top, left:hoveringNode.left-80, zIndex:100}}
          className='selectContentBtn' onClick={()=>{addNewContent()}}><GrAdd size={14}/></button>
        </>
        : null }
      
        <EditorContent editor={editor}/>
        </div>
    </div>
    )
}