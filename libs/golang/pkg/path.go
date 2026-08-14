package pkg

type Point [3]int

type Path map[Point]bool

func (p Path) Add(s Point) {
	p[s] = true
}

func (p Path) ToSlice() []Point {
	var s []Point
	for k, v := range p {
		if v {
			s = append(s, k)
		}
	}
	return s
}
