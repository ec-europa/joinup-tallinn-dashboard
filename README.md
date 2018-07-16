## Development

Edit the files in `src/`. Use the [Babel](https://babeljs.io/) transpiler to
compile the files into `lib/`:

### Using Yarn

#### Install Yarn

See https://yarnpkg.com/lang/en/docs/install/#mac-stable

#### Configure

```
$ yarn add --dev babel-cli babel-core babel-preset-env
```

#### Transpile

```
$ ./node_modules/.bin/babel src -d lib
```
