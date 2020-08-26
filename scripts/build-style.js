const path = require('path')
const fs = require('fs')
const chalk = require('chalk')
const gulp = require('gulp')
const cleanCSS = require('gulp-clean-css')
const scss = require('gulp-sass')
const rename = require('gulp-rename')
const header = require('gulp-header')
const autoprefixer = require('gulp-autoprefixer')

const pkg = require('../package.json')
const moduleName = 'xlui'

const banner =
  '/**\n' +
  ` * ${moduleName}.js v${pkg.version}\n` +
  ` * (c) 2020-${new Date().getFullYear()} 君惜\n` +
  ' * Released under the ISC License.\n' +
  ' */\n'

// gen build scss task
function gen(src, name, dest) {
  return function buildScss() {
    const fullsrc =path.resolve(src)
    const fulldest = path.resolve(dest, name)
    console.log(`${chalk.bgGreen('Success')} ${chalk.cyan(fullsrc)} -> ${chalk.cyan(fulldest)}`)
    return gulp.src(src)
      .pipe(scss())
      .pipe(autoprefixer({
        overrideBrowserslist: ['last 2 versions', 'ie > 8'],
      }))
      .pipe(cleanCSS())
      .pipe(header(banner))
      .pipe(rename(name))
      // .pipe(gulp.dest(dest, {sourcemaps: '.'}))
      .pipe(gulp.dest(dest))
  }
}

// find all style component
function findComponents(src) {
  let components = fs.readdirSync(src)
  const index = components.findIndex(x => x === 'index.scss')
  if (index !== -1) {
    components.splice(index, 1)
  }
  return components
}

// gen all build scss tasks
function genAll() {
  let components = findComponents(cPath)
  return components.map(component => {
    const name = component.split('.')[0]
    return gen(`${cPath}/${component}`, `${name}.css`, `${dist}`)
  })
}

const src = path.resolve('../src/styles')
const dist = path.resolve('../dist/styles')
const cPath = path.resolve('../src/styles/components')

const index = gen(`${src}/index.scss`, `${moduleName}.css`, dist)
const all = gulp.parallel(...genAll())

exports.default = gulp.series(index, all)

