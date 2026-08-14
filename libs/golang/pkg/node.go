package pkg

type Node struct {
	Value    rune
	Location Point
}

type RunnerNode struct {
	Node
	Path     Path
	Children []RunnerNode
}

func (n *RunnerNode) AddChild(c RunnerNode) {
	n.Children = append(n.Children, c)
}

func (r *RunnerNode) SetPath(p Path) {
	r.Path = p
}

func NewRunnerNode(n Node) RunnerNode {
	rn := RunnerNode{
		Node: n,
		Path: make(Path),
	}
	return rn
}
