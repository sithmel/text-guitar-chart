# How to represent a fingering using text

2 formats are supported. A concise ascii one that is designed to be edited easily and a nicer one that uses unicode, looks better but is more difficult to edit.

## General rules and semantic
The diagram represent a fragment of a guitar fretboard with low pitch string on the left and high pitch on the right. They are formed by 3 sections:
- title (optional)
- open strings (optional)
- fretboard (mandatory)

### String numbering
Strings are numbered 1-6 from right to left in the diagram. In standard guitar tuning:
- String 6 (leftmost) is the lowest pitch (E2)
- String 1 (rightmost) is the highest pitch (E4)

### Color values
The format supports four colors for fingering markers:
- `#000000` (black) for regular fingering positions
- `#e74c3c` (red/root marker color) for special positions (typically root notes)
- `#9B9B9B` (grey) for grey marker positions
- `#4A90E2` (blue) for blue marker positions

Any color value not matching one of the four known colors is treated as a root marker (red) and rendered with the root marker symbol.

## ascii format

### title section
The title (optional) is max 15 characters all on the same line. If this section is included it is separated from the section underneath by a line of "#". The line is as long as the title above, with a minimum of 6 characters.

### open string section
The open string section is optional and separated from the section underneath by "------" or "======". This separator is always included as it is the first line of the fretboard section.
- "------" is used when no fret position is set, or when the fret position is written on the first line of the fretboard section (including position 1)
- "======" is used as an alternate representation when the fret position is 1 (in this case, the position number is not written on the fretboard line)

Note: Position 1 can be represented in two ways:
1. Using "------" with " 1" written on the first fretboard line
2. Using "======" with no position number on the fretboard line

This section contains up to 6 elements (one for each string). Trailing spaces are trimmed from the line. Each position can be:
- " " (space) means that the string at this position is neither muted nor played
- "x" means that the string at this position is muted
- "o" means that the string at this position is played (open string)
- Any other character means the string is played as an open string (fret 0) with that character displayed as a text label. If multiple characters are provided, only the first character is used. The color field is ignored for open strings - they always render with the default appearance regardless of color value. 

### fretboard section
This section is mandatory and at least 3 rows long (3 frets).
The first line can optionally have an indication of the starting fret on the left, right-justified in a 2-character field (e.g., " 5" for fret 5, "15" for fret 15).

These different characters are used:
- "|" indicates that there is no fingering in this position
- "o" indicates that this position is fingered with a regular dot (color #000000)
- "*" indicates that this position is fingered with a root marker (color #e74c3c or any unrecognized color)
- "O" (uppercase) indicates that this position is fingered with a grey marker (color #9B9B9B)
- "+" indicates that this position is fingered with a blue marker (color #4A90E2)
- any other character is displayed as text on the fretboard at that position (commonly used for finger numbers or note names)

Examples:

```
  A min
  ######
  oo   o
  ------
  ||||o|
  ||o*||
  ||||||

  D
  ######
  xoo
  ------
  ||||||
  |||o|o
  ||||*|

  G 7
  ######
  xx
  ------
 5||*|||
  ||||o|
  |||o|o

  E dom 7
  #######
  x    x
  ------
  |||3||
  |51|||
  ||||7|

  Dominant 7
  ##########
  xx
  ======
  ||*|||
  ||||o|
  |||o|o

  A min
  ######
  Ro   o
  ------
  ||||o|
  ||o*||
  ||||||

```

## unicode format

### title section
The title (optional) is max 15 characters all on the same line. If this section is included it is separated from the section underneath by a line of "‾". The line is as long as the title above and at least 11 characters

### open string section
The open string section is optional and separated from the section underneath by "┌─┬─┬─┬─┬─┐" or "╒═╤═╤═╤═╕". This separator is always included as it is the first line of the fretboard section.
- "┌─┬─┬─┬─┬─┐" is used when no fret position is set, or when the fret position is written on the second line of the fretboard section (including position 1)
- "╒═╤═╤═╤═╕" is used as an alternate representation when the fret position is 1 (in this case, the position number is not written on the fretboard)

Note: Position 1 can be represented in two ways:
1. Using "┌─┬─┬─┬─┬─┐" with " 1" written on the second line of the fretboard section
2. Using "╒═╤═╤═╤═╕" with no position number on the fretboard

This section contains up to 6 elements (one for each string) separated by spaces. Trailing spaces are trimmed from the line. Each position can be:
- " " (space) means that the string at this position is neither muted nor played
- "×" means that the string at this position is muted
- "○" means that the string at this position is played (open string)
- Any other character means the string is played as an open string (fret 0) with that character displayed as a text label. If multiple characters are provided, only the first character is used. The color field is ignored for open strings - they always render with the default appearance regardless of color value.

### fretboard section
This section is mandatory and at least 3 frets long. It is built as a grid:
```
  ┌─┬─┬─┬─┬─┐
  │ │ │ │ │ │
  ├─┼─┼─┼─┼─┤
  │ │ │ │ │ │
  ├─┼─┼─┼─┼─┤
  │ │ │ │ │ │
  └─┴─┴─┴─┴─┘
```
The second line can optionally have an indication of the starting fret on the left, right-justified in a 2-character field (e.g., " 5" for fret 5, "15" for fret 15).

The even rows contain characters representing the fingering:
- "│" indicates that there is no fingering in this position
- "○" indicates that this position is fingered with a regular dot (color #000000)
- "●" indicates that this position is fingered with a root marker (color #e74c3c or any unrecognized color)
- "□" indicates that this position is fingered with a grey marker (color #9B9B9B)
- "■" indicates that this position is fingered with a blue marker (color #4A90E2)
- any other character is displayed as text on the fretboard at that position (commonly used for finger numbers or note names)

Example:
```
  A minor
  ‾‾‾‾‾‾‾‾‾‾‾
  ○ ○       ○
  ╒═╤═╤═╤═╤═╕
  │ │ │ │ ○ │
  ├─┼─┼─┼─┼─┤
  │ │ ○ ● │ │
  ├─┼─┼─┼─┼─┤
  │ │ │ │ │ │
  └─┴─┴─┴─┴─┘

  D
  ‾‾‾‾‾‾‾‾‾‾‾
  × ○ ○
  ╒═╤═╤═╤═╤═╕
  │ │ │ │ │ │
  ├─┼─┼─┼─┼─┤
  │ │ │ ○ │ ○
  ├─┼─┼─┼─┼─┤
  │ │ │ │ ● │
  └─┴─┴─┴─┴─┘

  G 7
  ‾‾‾‾‾‾‾‾‾‾‾
  × ×
  ┌─┬─┬─┬─┬─┐
 5│ │ ● │ │ │
  ├─┼─┼─┼─┼─┤
  │ │ │ │ ○ │
  ├─┼─┼─┼─┼─┤
  │ │ │ ○ │ ○
  └─┴─┴─┴─┴─┘

  E dom 7
  ‾‾‾‾‾‾‾‾‾‾‾
  ×         ×
  ┌─┬─┬─┬─┬─┐
  │ │ │ 3 │ │
  ├─┼─┼─┼─┼─┤
  │ 5 1 │ │ │
  ├─┼─┼─┼─┼─┤
  │ │ │ │ 7 │
  └─┴─┴─┴─┴─┘

  Dominant 7
  ‾‾‾‾‾‾‾‾‾‾‾
  × ×
  ╒═╤═╤═╤═╤═╕
  │ │ ● │ │ │
  ├─┼─┼─┼─┼─┤
  │ │ │ │ ○ │
  ├─┼─┼─┼─┼─┤
  │ │ │ ○ │ ○
  └─┴─┴─┴─┴─┘

  A min
  ‾‾‾‾‾‾‾‾‾‾‾
  R ○       ○
  ┌─┬─┬─┬─┬─┐
  │ │ │ │ ○ │
  ├─┼─┼─┼─┼─┤
  │ │ ○ ● │ │
  ├─┼─┼─┼─┼─┤
  │ │ │ │ │ │
  └─┴─┴─┴─┴─┘

```

## Edge cases and special behaviors

### Missing sections
- If no title is provided, the title and separator lines are omitted
- If no open strings are defined (no string with fret 0 or "x"), the open string section is omitted
- The fretboard section is always present (minimum 3 frets)

### Empty chords
An empty chord (no fingerings) renders as just the fretboard grid with no markers.

ASCII format:
```
  ------
  ||||||
  ||||||
  ||||||
```

Unicode format:
```
  ┌─┬─┬─┬─┬─┐
  │ │ │ │ │ │
  ├─┼─┼─┼─┼─┤
  │ │ │ │ │ │
  ├─┼─┼─┼─┼─┤
  │ │ │ │ │ │
  └─┴─┴─┴─┴─┘
```

### All open strings
All six strings can be marked as open.

ASCII format:
```
  E major
  #######
  oooooo
  ------
  ||||||
  ||||||
  ||||||
```

Unicode format:
```
  E major
  ‾‾‾‾‾‾‾‾‾‾‾
  ○ ○ ○ ○ ○ ○
  ╒═╤═╤═╤═╤═╕
  │ │ │ │ │ │
  ├─┼─┼─┼─┼─┤
  │ │ │ │ │ │
  ├─┼─┼─┼─┼─┤
  │ │ │ │ │ │
  └─┴─┴─┴─┴─┘
```

### All muted strings
All six strings can be marked as muted.

ASCII format:
```
  Muted
  #####
  xxxxxx
  ------
  ||||||
  ||||||
  ||||||
```

Unicode format:
```
  Muted
  ‾‾‾‾‾‾‾‾‾‾‾
  × × × × × ×
  ┌─┬─┬─┬─┬─┐
  │ │ │ │ │ │
  ├─┼─┼─┼─┼─┤
  │ │ │ │ │ │
  ├─┼─┼─┼─┼─┤
  │ │ │ │ │ │
  └─┴─┴─┴─┴─┘
```

## Open strings with text labels

Open strings can display custom text labels by using any character other than space, 'o'/'○', or 'x'/'×' in the open string section. These labels are useful for showing note names, scale degrees, intervals, or other musical information.

### ASCII format examples

Single character labels:
```
  12xoxx
  ------
  ||||||
  ||||||
  ||||||
```
This shows string 6 with label "1", string 5 with label "2", string 4 muted, string 3 open (no label), strings 2 and 1 muted.

Mixed labels and symbols:
```
  AxBoCx
  ------
  ||||||
  ||||||
```
This shows strings with labels "A", "B", and "C" mixed with muted and open strings.

Special characters as labels:
```
  #♭♯oxx
  ------
  ||||||
  ||||||
```
Musical symbols like sharp (#), flat (♭), and natural (♯) can be used as labels.

### Unicode format examples

Labels with spacing:
```
  × ○ A     5
  ┌─┬─┬─┬─┬─┐
  │ │ │ │ │ │
  ├─┼─┼─┼─┼─┤
  │ │ │ │ │ │
  └─┴─┴─┴─┴─┘
```
This shows string 6 muted, string 5 open (no label), string 4 with label "A", and string 1 with label "5".

Complete chord with labeled open strings:
```
  G 7
  ‾‾‾‾‾‾‾‾‾‾‾
  × ○ A     5
  ╒═╤═╤═╤═╤═╕
  │ │ ● │ │ │
  ├─┼─┼─┼─┼─┤
  │ │ │ │ ○ │
  ├─┼─┼─┼─┼─┤
  │ │ │ ○ │ ○
  └─┴─┴─┴─┴─┘
```

### Important notes about text labels on open strings

1. **Multi-character text**: If multiple characters are provided for a single string position (e.g., "Root"), only the first character will be displayed.
2. **Color ignored**: The color field is ignored for open strings. Even if a non-black color (like `#e74c3c`) is specified in the data structure, open strings always render with the default appearance and do not show root markers.
3. **Muted strings override text**: Strings marked as muted ('x' or fret value "x") always display as muted regardless of any text field in the data structure.
```
