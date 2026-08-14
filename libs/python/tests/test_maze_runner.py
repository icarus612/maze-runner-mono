"""Contract tests for `maze_runner` (Packet W1-P5 — the canonical library, D4).

Written from the contract's specification alone (l2.md, Packet W1-P5), blind to the
actual implementation. Covers:

- `from maze_runner import Maze, Runner` re-export.
- `Maze(build=(5, 10), build_type="h")` swapped-arg signature: build[0] -> height,
  build[1] -> width.
- `Maze.view_layout()` builds and returns a joined, newline-containing string (not
  print-only) — the mandatory carry-over from W1-P1's contract.
- `Runner.path` is `None` before `build_path()` and a single path-marker character
  after — the mandatory carry-over from W1-P1's contract.
- `Runner.view_completed()` builds and returns a joined string.
- Basic construction: `Runner(Maze())` does not raise for a default-constructed maze.
"""


def test_reexports_maze_and_runner():
    """`from maze_runner import Maze, Runner` succeeds (both re-exported from the
    package root's __init__.py, per the contract's `__all__ = ["Maze", "Runner"]`)."""
    from maze_runner import Maze, Runner  # noqa: F401


def test_maze_build_arg_swaps_height_and_width():
    """`Maze(build=(5, 10), build_type="h")` — build[0] unpacks into build_new's
    `height` parameter, build[1] into `width` (the swapped-arg signature)."""
    from maze_runner import Maze

    maze = Maze(build=(5, 10), build_type="h")

    assert maze.height == 5
    assert maze.width == 10


def test_maze_view_layout_returns_joined_string():
    """`Maze.view_layout()` must build and return the joined string (in addition to
    printing), not just print and return None — the mandatory W1-P1 carry-over."""
    from maze_runner import Maze

    maze = Maze(build=(5, 10), build_type="h")

    layout = maze.view_layout()

    assert layout is not None
    assert isinstance(layout, str)
    assert "\n" in layout


def test_runner_path_none_before_and_marker_char_after_build_path():
    """A Runner constructed over a solvable maze has `.path` equal to None before
    `build_path()`, and equal to a single path-marker character afterward — the
    mandatory W1-P1 carry-over (`self.path = None` in __init__, `self.path = path`
    in build_path())."""
    from maze_runner import Maze, Runner

    maze = Maze(build=(5, 5), build_type="h")
    runner = Runner(maze)

    assert runner.path is None

    runner.make_node_paths()
    runner.build_path()

    assert runner.path is not None
    assert isinstance(runner.path, str)
    assert len(runner.path) == 1


def test_runner_view_completed_returns_joined_string():
    """`Runner.view_completed()` must build and return the joined string (in addition
    to printing), called after `build_path()` — the mandatory W1-P1 carry-over."""
    from maze_runner import Maze, Runner

    maze = Maze(build=(5, 5), build_type="h")
    runner = Runner(maze)
    runner.make_node_paths()
    runner.build_path()

    completed = runner.view_completed()

    assert completed is not None
    assert isinstance(completed, str)


def test_runner_construction_over_default_maze_does_not_raise():
    """Basic construction: `Runner(Maze())` does not raise for a default-constructed
    maze."""
    from maze_runner import Maze, Runner

    Runner(Maze())
