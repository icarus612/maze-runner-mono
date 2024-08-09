import React from 'react';
import cx from "classnames"
import local from 'styles/components/header.module.scss'
import layout from 'styles/layout.module.scss'
import Link from "next/link"

export default ()=> {
    return (
        <nav className={cx(layout.f_row, local.nav_bar, layout.justify_end, layout.align_center)}>
            <Link href="/randomizer">Quick Builder</Link>
						<div className={layout.divider}>|</div>
            <Link href="/build">Build Your Own</Link>
						<div className={layout.divider}>|</div>
						<Link href="/info">How It Works</Link>
        </nav>
       
    )
}
