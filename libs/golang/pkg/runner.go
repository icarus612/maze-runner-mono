package pkg

import (
	"fmt"
	"slices"
)

type Runner struct {
	Completed    bool
	PathChar     rune
	ShortestPath Path
	Visited      []Point
	ToVisit      []RunnerNode
	Start        RunnerNode
	End          RunnerNode
	Maze         Maze
	MappedLayout Layout
}

func (r *Runner) FindEndpoints() {
	var (
		m  = r.Maze
		sc = m.StartChar
		ec = m.EndChar
	)
	m.Layout.Traverse(
		func(n Node) {
			rn := NewRunnerNode(n)
			switch n.Value {
			case sc:
				r.Start = rn
			case ec:
				r.End = rn
			}
		},
	)
}

func (r *Runner) LookAround(n *RunnerNode) {
	var (
		m  = r.Maze
		fc = m.FloorChar
		oc = m.OpenChar
		sc = m.StartChar
	)

	switch n.Value {
	case oc, sc, fc:
		r.CheckSpace(n)
		fallthrough
	case fc:
		r.CheckStairs(n)
	}
}

func (r *Runner) CheckStairs(n *RunnerNode) {
	var (
		m   = r.Maze
		l   = m.Layout
		nl  = n.Location
		fc  = m.FloorChar
		nl0 = nl[0]
		nl1 = nl[1]
		nl2 = nl[2]
	)

	if nl0 > 0 {
		pf := l[nl0-1][nl1][nl2]
		if pf.Value == fc {
			n.AddChild(NewRunnerNode(pf))
		}
	}
	if nl0 < len(l)-1 {
		pb := l[nl0+1][nl1][nl2]
		if pb.Value == fc {
			n.AddChild(NewRunnerNode(pb))
		}
	}
}

func (r *Runner) CheckSpace(n *RunnerNode) {
	var (
		m   = r.Maze
		oc  = m.OpenChar
		fc  = m.FloorChar
		sc  = m.StartChar
		ec  = m.EndChar
		nl  = n.Location
		nl0 = nl[0]
		nl1 = nl[1]
		nl2 = nl[2]
		cf  = m.Layout[nl0]
		f1  = cf[nl1-1][nl2]
		f2  = cf[nl1+1][nl2]
		f3  = cf[nl1][nl2-1]
		f4  = cf[nl1][nl2+1]
	)

	for _, x := range []Node{f1, f2, f3, f4} {
		switch x.Value {
		case oc, fc, sc, ec:
			n.AddChild(NewRunnerNode(x))
		}
	}
}

func (r *Runner) MakeNodePaths() {
	var (
		rtv = r.ToVisit
		vtd = r.Visited
	)
	rtv = append(rtv, r.Start)
	for len(rtv) > 0 {
		var (
			current = rtv[0]
			cp      = current.Path
			cl      = current.Location
		)
		rtv = rtv[1:]
		if !slices.Contains(vtd, cl) {

			r.LookAround(&current)
			newPath := make(Path, len(cp))
			for k, v := range cp {
				newPath[k] = v
			}

			newPath.Add(cl)
			vtd = append(vtd, cl)
			for _, n := range current.Children {
				n.Path = newPath
				if n.Value == r.End.Value {
					r.Completed = true
					r.SetShortestPath(newPath)
				} else {
					rtv = append(rtv, n)
				}
			}
		}

	}
}

func (r *Runner) BuildPath() {
	var (
		mpd = r.MappedLayout
		m   = r.Maze
		p   = r.PathChar
		s   = m.StartChar
		e   = m.EndChar
		w   = m.WallChar
		o   = m.OpenChar
		f   = m.FloorChar
	)
	for slices.Contains([]rune{s, e, w, o}, p) {
		fmt.Println("The current path character can not be the same as the maze characters.")
		fmt.Printf("Current maze characters include %v, %v, %v, and %v.", s, e, w, o)
		fmt.Println("What would you like the new path the be?")
		fmt.Scan(&p)
	}

	mpd.Traverse(func(n Node) {
		var (
			l  = n.Location
			v  = n.Value
			l0 = l[0]
			l1 = l[1]
			l2 = l[2]
		)
		if !slices.Contains([]rune{s, e, f}, v) && slices.Contains(r.ShortestPath.ToSlice(), l) {
			mpd[l0][l1][l2].Value = p
		}
	})
}

func (r *Runner) SetShortestPath(p Path) {
	if len(p) < len(r.ShortestPath) || len(r.ShortestPath) == 0 {
		r.ShortestPath = p
	}
}

func (r *Runner) ViewCompletedPath() {
	fmt.Println(r.ShortestPath.ToSlice())
}

func (r Runner) ViewCompleted() {
	r.MappedLayout.Print()
}

func NewRunner(m Maze, pathChar rune) Runner {
	r := Runner{
		Completed:    false,
		Maze:         m,
		MappedLayout: m.Layout.DeepCopy(),
		PathChar:     pathChar,
		ShortestPath: make(Path),
	}
	r.FindEndpoints()
	r.MakeNodePaths()
	r.BuildPath()
	return r
}
