package main

import (
	"flag"
	"fmt"

	mr "github.com/dae-go/maze-runner/pkg"
)

func main() {
	var (
		length   = flag.Int("length", 20, "Path length (if generating)")
		width    = flag.Int("width", 20, "Maze width (if generating)")
		height   = flag.Int("height", 3, "Maze height (if generating)")
		mazeType = flag.String("mazeType", "r", "Path to maze input file")
		pathChar = flag.String("pathChar", "x", "Path character (if generating)")
		// openChar = flag.String("openChar", " ", "Maze character (if generating)")
		// wallChar = flag.String("wallChar", "#", "Wall character (if generating)")
	)

	flag.Parse()

	var (
		size = [3]int{*length, *width, *height}
		m    = mr.NewMaze(size, []rune(*mazeType)[0])
		r    = mr.NewRunner(m, []rune(*pathChar)[0])
	)

	m.ViewLayout()
	if r.Completed {
		r.ViewCompleted()
	} else {
		fmt.Println("Can Not Complete!")
	}
}
