package pkg

import "fmt"

type Floor [][]Node
type Layout []Floor
type LFuncN func(n Node)
type LFunc func()

func (l Layout) Traverse(f1 LFuncN, f2 ...LFunc) {
	for _, x := range l {
		for _, y := range x {
			for _, z := range y {
				f1(z)
			}
			if len(f2) > 0 {
				f2[0]()
			}
		}
		if len(f2) > 1 {
			f2[1]()
		}
	}
}

func (l Layout) Print() {
	nl := func() { fmt.Println() }
	l.Traverse(
		func(y Node) {
			fmt.Print(string(y.Value))
		},
		nl,
		nl,
	)
}

func (l Layout) DeepCopy() Layout {
	nl := make(Layout, len(l))
	for i, f := range l {
		nl[i] = make(Floor, len(f))
		for j, c := range f {
			nl[i][j] = make([]Node, len(c))
			copy(nl[i][j], l[i][j])
		}
	}
	return nl
}
