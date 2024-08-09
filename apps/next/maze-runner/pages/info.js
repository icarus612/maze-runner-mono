import { useState } from "react";
import cx from "classnames"
import global from 'styles/global.module.scss'
import layout from 'styles/layout.module.scss'

import Header from "components/header"

export default (props) => {
	return (
    <div className={cx(global.maze_runner, layout.f_wrap, layout.f_col, layout.justify_around, layout.align_center)}>
      <Header />
      <div className={cx(layout.container)}>
				<h1>
          The Maze Runner Project
        </h1>
        <p>
					This project was origionaly built in python and used a command line interface. 
					Eventually a flask app GUI was built for it. 
					It has sense been ported over to Javascript and is now a Next/React app.
				</p>
				<p>
					There are 2 versions: the random placement quickbuild version or the build your own. 
					For the randomized quick builder just choose your height, width, and end pont placement and your off! 
					For the build your own, choose the initial height and width, 
					as well as the type of tile you're placing, and build your own maze. 
					Aftwards let the maze runner attempt to solve your maze. 
				</p>
      </div>
    </div>
	);
};
