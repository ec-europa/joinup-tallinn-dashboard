## Development

### Javascript

Edit the files in `src/`. Use the [Babel](https://babeljs.io/) transpiler to
compile the files:

#### Using Yarn

##### Install Yarn

See https://yarnpkg.com/lang/en/docs/install

##### Configure

```
$ yarn add --dev babel-cli babel-core babel-preset-env
```

##### Transpile

```
$ ./node_modules/.bin/babel src/es6 -d .
```

### CSS

##### Install SCSS

TBD.

##### Compile

```
$ scss --update src/scss/tallinn-dashboard.scss:./tallinn-dashboard.css
```
