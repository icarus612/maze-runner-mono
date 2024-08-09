import {useState, useEffect, useRef} from 'react'
import cx from 'classnames'

import Maze from "components/maze"
import Runner from "components/runner"
import Header from "components/header"

import layout from 'styles/layout.module.scss'
import global from 'styles/global.module.scss'

export default ()=> {
  const [currentCompleted, setCurrentCompleted] = useState(false)
  const [currentTile, setCurrentTile] = useState("wall")
  const [start, setStart] = useState(false)
  const [end, setEnd] = useState(false)
  const [scaled, setScaled] = useState(1)
  const [height, setHeight] = useState(30)
  const [width, setWidth] = useState(30)

  const resetMaze = () => {
    return [...new Array(Number(height))].map((_, j)=> {
      return [...new Array(Number(width))].map((_, i)=> (i == 0 || j == 0 || i == width-1 || j == height-1) ? "wall" : "space")
    })
  }

  const [currentMaze, setCurrentMaze] = useState(resetMaze())

  const mazeContainerInner = useRef(null)

  const solveMaze = () => {
    const refactor = currentMaze.map((row)=> {
      return row.map((tile)=> {
        switch(tile) {
          case "start":
            return "s"
          case "end":
            return "e"
          case "wall":
            return "#"
          default: 
            return " "
        }
      }).join("")
    }).join("\n")

    const maze = Maze({layout: refactor})
    const runner = Runner(maze);
    runner.makeNodePaths();
    runner.buildPath();
    setCurrentCompleted(runner);
  }

  const updateMazeWidth = (n) => {
    let newMaze = [...currentMaze]
    newMaze.map((x, i)=> x.length >= n ? x.splice(n-1, x.length - n) : x.splice(x.length-1, 0, ...[...Array(n - x.length)].map(()=> (i == 0 || i == height-1) ? "wall" : "space")))
    setWidth(Number(n))
    setCurrentMaze(newMaze)
  }

  const updateMazeHeight = (n) => {
    let newMaze = [...currentMaze]
    newMaze.length > n 
      ? newMaze.splice(n-1, newMaze.length - n) 
      : newMaze.splice(newMaze.length-1, 0, ...[...Array(n - newMaze.length)].map(()=> [...Array(Number(width))].map((_, i)=> (i == 0 || i == width-1) ? "wall" : "space")))
    setHeight(Number(n))
    setCurrentMaze(newMaze)
  }

  const checkMaxMin = (n) => {
     if (n > 200) return 200
     if (n < 2) return 2
     return n
  }

  const toggleTileType = (x, y) => {
    if (x == length || y == height) return 

    let newMaze = [...currentMaze]
    if (currentTile == "start") {
      if (start) newMaze[start[0]][start[1]] = "space"
      setStart([x, y])
    }

    if (currentTile == "end") {
      if (end) newMaze[end[0]][end[1]] = "space"
      setEnd([x, y])
    }

    newMaze[x][y] = currentTile
    setCurrentMaze(newMaze)
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
            {[global.start]: el == "s"},
            {[global.end]: el == "e"},
            {[global.wall]: el == "#"},
            {[global.open]: el == " "},
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
    <div className={cx(global.container, global.maze_runner, layout.f_col, layout.justify_end, layout.align_center)}>
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
          {currentMaze && currentMaze.map((row, j)=> {
            return (
              <div className={cx(layout.f_row)}>
                {row.map((el, i)=> {
                  return <div 
                    key={i} 
                    className={cx(
                      global.maze_tile, 
                      {[global.start]: el == "start"},
                      {[global.end]: el == "end"},
                      {[global.wall]: el == "wall"},
                      {[global.open]: el == "space"},
                    )} 
                    onClick={()=> toggleTileType(j, i)}
                  />
                })}
              </div>
            )
          })}

          {currentCompleted && (
            <div 
              className={global.solved}
              style={{top: `${20/scaled}px`}}
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
              setCurrentCompleted(false)
              updateMazeHeight(checkMaxMin(e.target.value))
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
              setCurrentCompleted(false)
              updateMazeWidth(checkMaxMin(e.target.value))
            }} 
          />
        </div>
        <div className={cx(layout.w100_percent, layout.f_row, layout.f_wrap, layout.align_end, layout.justify_center)}>
          <span>Current Maze Tile Type</span>
          <select 
            name="type" 
            onChange={(e)=> {
              setCurrentTile(e.target.value)
            }}
          >
            <option selected value="wall">Wall</option>
            <option value="space">Space</option>
            <option value="start">Start Point</option>
            <option value="end">End Point</option>
          </select>  
        </div>
        <div className={cx(layout.f_row, layout.justify_around, layout.align_center)}>
          <button 
            onClick={()=> (start && end) ? solveMaze() : alert("Maze must have start and end values")}
            className={global.maze_btn}
          >Solve</button>
          <button 
            onClick={()=> {
              setCurrentCompleted(false)
              setCurrentMaze(resetMaze())
            }}
            className={global.maze_btn}
          >Reset</button>       
          {currentCompleted && <button 
            onClick={()=> setCurrentCompleted(false)}
            className={global.maze_btn}
          >Keep Editing</button>}
        </div>
      </div>
      
    </div>
  )
}


