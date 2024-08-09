import { useState } from "react";
import cx from "classnames"
import layout from 'styles/layout.module.scss'
import global from 'styles/global.module.scss'

import Header from "components/header"
import Link from "next/link"

export default () => {
	return (
    <div className={cx(global.maze_runner, layout.f_wrap, layout.f_col, layout.justify_around, layout.align_center)}>
      <Header />
      <div className={cx(layout.f_wrap, layout.f_row, layout.justify_around, layout.align_center)}>
        <h1 className={cx(layout.w100_percent, layout.text_center)}>
          The Maze Runner
        </h1>
        <Link href="/randomizer">
          <div className={cx(layout.text_center, global.card, layout.f_col)}>
            <h5>
              Quick Builder
            </h5>
            <p>
              Click here for a randomized maze build and solve.
            </p>
            <button className={global.maze_btn}>Randomized</button>
          </div>
        </Link>
        <Link href="/build">
          <div className={cx(layout.text_center, global.card, layout.f_col)}>
            <h5>
              Build Your Own
            </h5>
            <p>
              Click here to build your own maze and have it solved.
            </p>
            <button className={global.maze_btn}>Customized</button>
          </div>
        </Link>
      </div>
    </div>
	);
};
