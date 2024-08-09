import {useState, useEffect, useRef} from 'react'
import cx from 'classnames'
import global from 'styles/global.module.scss'
import layout from 'styles/layout.module.scss'
import Maze from "components/maze"
import Runner from "components/runner"
import Header from "components/header"

export default ()=> {
  const [currentMaze, setCurrentMaze] = useState(false)
  const [currentCompleted, setCurrentCompleted] = useState(false)
  const [mazeType, setMazeType] = useState("h")
  const [scaled, setScaled] = useState(1)
  const [height, setHeight] = useState(30)
  const [width, setWidth] = useState(30)
  const mazeContainerInner = useRef(null)

  const newMaze = () => {
    setCurrentMaze(Maze({build: [height, width], buildType: mazeType}))
    setCurrentCompleted(false)
  }
  
  const solveMaze = () => {
    const runner = Runner(currentMaze);
    runner.makeNodePaths();
    runner.buildPath();
    setCurrentCompleted(runner);
  }

  const resetMazes = () => {
    setCurrentMaze(false)
    setCurrentCompleted(false)
  }

  const checkMaxMin = (n) => {
     if (n > 200) return 200
     if (n < 0) return 0
     return n
  }
  
  useEffect(()=> {
    [...document.querySelectorAll(`.${global.path}`)].map((e)=> e.classList.add(global.visible))

    const ele = mazeContainerInner.current;
    ele.style.cursor = 'grab';

    let pos = { top: 0, left: 0, x: 0, y: 0 };
  
    const mouseDownHandler = function(e) {
        ele.style.cursor = 'grabbing';
        ele.style.userSelect = 'none';
  
        pos = {
            left: ele.scrollLeft,
            top: ele.scrollTop,
            // Get the current mouse position
            x: e.clientX,
            y: e.clientY,
        };
  
        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
    };
  
    const mouseMoveHandler = function(e) {
        // How far the mouse has been moved
        const dx = e.clientX - pos.x;
        const dy = e.clientY - pos.y;
  
        // Scroll the element
        ele.scrollTop = pos.top - dy;
        ele.scrollLeft = pos.left - dx;
    };
  
    const mouseUpHandler = function() {
        ele.style.cursor = 'grab';
        ele.style.removeProperty('user-select');
  
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
    };
  
    // Attach the handler
    ele.addEventListener('mousedown', mouseDownHandler);
  })

  const completedMaze = currentCompleted.completed ? currentCompleted.mappedMaze.map((row)=> {
    return (
      <div className={cx(layout.f_row)}>
        {row.map((el, i)=> {
          return <div key={i} className={cx(
            global.maze_tile, 
            {[global.start]: el == currentMaze.startChar},
            {[global.end]: el == currentMaze.endChar},
            {[global.wall]: el == currentMaze.wallChar},
            {[global.open]: el == currentMaze.openChar},
            {[global.path]: el == currentCompleted.pathChar},
          )} />
        })}
      </div>
    )
  }) : (
    <div className={cx(layout.h100_percent, layout.w100_percent, layout.f_row, layout.justify_center, layout.align_center, layout.text_center)}>
      <h4>Maze is not Solvable</h4>
    </div>
  )
  
  return (
    <div className={cx(layout.container, global.maze_runner, layout.f_col, layout.justify_end, layout.align_center)}>
      <Header />
      <div className={cx(global.zoom_container, layout.f_col, layout.justify_center, layout.align_center)}>
        <button 
          onClick={()=> setScaled(scaled < 2 ? scaled + .1 : 2)}
          className={global.zoom_btn}
        >+</button>
        <button 
          onClick={()=> setScaled(scaled >= .2 ? scaled - .1 : .1)}
          className={global.zoom_btn}
        >-</button>
      </div>
      <div 
        className={cx(global.maze_container, layout.f_row, layout.justify_center, layout.align_center)}
        ref={mazeContainerInner}
      >
      <div className={cx(global.maze_container_middle, layout.f_col, layout.justify_center, layout.align_center)}>
        <div 
          className={cx(global.maze_container_inner)} 
          style={{
            transform: `scale(${scaled})`,
            padding: `${20/scaled}px`,
          }}
        >
          {currentMaze ? currentMaze.layout.map((row)=> {
            return (
              <div className={cx(layout.f_row)}>
                {row.map((el, i)=> {
                  return <div key={i} className={cx(
                    global.maze_tile, 
                    {[global.start]: el == currentMaze.startChar},
                    {[global.end]: el == currentMaze.endChar},
                    {[global.wall]: el == currentMaze.wallChar},
                    {[global.open]: el == currentMaze.openChar},
                  )} />
                })}
              </div>
            )
          }) : [...new Array(Number(height))].map((_, j)=> {
              return (
                <div className={cx(layout.f_row)}>
                  { [...new Array(Number(width))].map((_, i)=> {
                    return <div key={`${i}${j}`} className={cx(
                      global.maze_tile, 
                      global[( i == 0 || j == 0 || i == width-1 || j == height-1) ? "wall" : "space"]
                    )} />
                  })}
                </div>
              )
            }
          )}

          {currentCompleted && (
            <div 
              className={global.solved}
              style={{
                top: `${20/scaled}px`
              }}
            >
              {completedMaze}
            </div>
          )}
        </div>
        </div>
        </div>
      <div className={cx(layout.f_row, layout.f_wrap, layout.justify_center, layout.align_center, global.settings_container)}>
        <div className={global.number_container}>
          <label>Height:</label>
          <input 
            type="number" 
            value={height} 
            className={global.number_input}
            onChange={(e)=> {
              resetMazes()
              setHeight(checkMaxMin(e.target.value))
            }} 
          />
        </div>
        <div className={global.number_container}>
          <label>Width:</label>
          <input 
            type="number" 
            value={width}
            className={global.number_input}
            onChange={(e)=> {
              resetMazes()
              setWidth(checkMaxMin(e.target.value))
            }} 
          />
        </div>
        <div className={cx(layout.w100_percent, layout.f_row, layout.f_wrap, layout.align_end, layout.justify_center)}>
          <span>Endpoint Placement:</span>
          <select 
            name="type" 
            onChange={(e)=> {
              resetMazes()
              setMazeType(e.target.value)
            }}
          >
            <option selected value="h">Start: top | End: bottom</option>
            <option value="v">Start: left | End: right</option>
            <option value="r">Start: random | End: random</option>
          </select>  
        </div>
        <div className={cx(layout.f_row, layout.justify_around, layout.align_center)}>
          <button 
            onClick={()=> newMaze()}
            className={global.maze_btn}
          >New Maze</button>
          {currentMaze && <button 
            onClick={()=> solveMaze()}
            className={global.maze_btn}
          >Attempt to Solve</button>}
        </div>
      </div>
      
    </div>
  )
}
