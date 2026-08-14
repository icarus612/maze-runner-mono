package pkg

import (
	"math/rand"
)

type Maze struct {
	Layout    Layout
	StartChar rune
	EndChar   rune
	FloorChar rune
	WallChar  rune
	OpenChar  rune
}

func (m *Maze) BuildNew(build [3]int, buildType rune) {
	var (
		s               Point
		e               Point
		length               = build[0]
		width                = build[1]
		height               = build[2]
		l                    = m.Layout
		openPoints      Path = make(Path)
		localOpenPoints Path = make(Path)
		floorPoints     Path = make(Path)
		rls                  = rand.Int()%(length-2) + 1
		rws                  = rand.Int()%(width-2) + 1
		rle                  = rand.Int()%(length-2) + 1
		rwe                  = rand.Int()%(width-2) + 1
		fa                   = (length*width - 1) / 100
	)

	if height == 0 {
		height = 1
	}
	for z := 0; z < height; z++ {
		for y := 0; y < width; y++ {
			for x := 0; x < length; x++ {
				p := Point{z, y, x}
				n := Node{
					Location: p,
				}
				if p[2] == 0 || p[1] == 0 || p[2] == length-1 || p[1] == width-1 {
					n.Value = m.WallChar
				} else {
					rng := rand.Int() % 3
					if rng%2 == 1 {
						n.Value = m.WallChar
					} else {
						localOpenPoints[p] = true
						n.Value = m.OpenChar
					}
				}
				l[z][y][x] = n
			}
		}
		for i := 0; i <= fa && z < height-1; i++ {
			f := localOpenPoints.ToSlice()[rand.Int()%len(localOpenPoints)]
			floorPoints[f] = true
			f[0]++
			floorPoints[f] = true

		}
		for k, v := range localOpenPoints {
			openPoints[k] = v
		}
		localOpenPoints = make(Path)
	}

	for k, v := range floorPoints {
		if v {
			l[k[0]][k[1]][k[2]].Value = m.FloorChar
		}
	}

	s = Point{0, rws, rls}
	e = Point{height - 1, rwe, rle}
	delete(openPoints, s)
	delete(openPoints, e)

	l[s[0]][s[1]][s[2]].Value = m.StartChar
	l[e[0]][e[1]][e[2]].Value = m.EndChar
}

func (m Maze) ViewLayout() {
	m.Layout.Print()
}

func NewMaze(b [3]int, buildType rune) Maze {
	if b[2] == 0 {
		b[2] = 1
	}

	l := make(Layout, b[2])
	for i := range l {
		l[i] = make(Floor, b[1])
		for j := range l[i] {
			l[i][j] = make([]Node, b[0])
		}
	}
	m := Maze{
		StartChar: 's',
		EndChar:   'e',
		FloorChar: 'f',
		WallChar:  '#',
		OpenChar:  ' ',
		Layout:    l,
	}
	m.BuildNew(b, buildType)
	return m
}
