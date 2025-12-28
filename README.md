# Text Guitar Chart

This library allows to write fretboard charts in a text format that is easy to read. It also includes utilities to convert the charts in svg using [svguitar](https://github.com/omnibrain/svguitar).

See the [format](FORMAT.md)

# How to use
Use [the editor](https://sithmel.github.io/text-guitar-chart/) to edit the fingering you like. Copy paste the fretboard chart wherever you like!

# Utilities
Here is a list of utilities it provides:
- EditableSVGuitarChord an editable chord chart utility
- stringToFingering transforms a text representation of a fingering into data that can be used to render that fingering using SVGuitar
- fingeringToString transforms SVGuitar data format into a text representation of a fingering

## TypeScript Support

This library includes TypeScript declarations generated from JSDoc comments:

```bash
npm run build:types
```

## Development

### Running Tests

```bash
npm test
npm run test:watch  # Watch mode
```

### Generate Type Declarations

```bash
npm run build:types
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.