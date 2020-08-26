const path = require('path')
const fs = require('fs')
import buble from '@rollup/plugin-buble'
import commonjs from '@rollup/plugin-commonjs'
import node from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'
import json from '@rollup/plugin-json'
// import alias from '@rollup/plugin-alias'
import replace from '@rollup/plugin-replace'
import vue from 'rollup-plugin-vue'
import {terser} from 'rollup-plugin-terser'

const moduleName = 'xlui'
const version = process.env.VERSION || require('../package.json').version
const banner =
  '/**\n' +
  ` * ${moduleName}.js v${version}\n` +
  ` * (c) 2020-${new Date().getFullYear()} 君惜\n` +
  ' * Released under the ISC License.\n' +
  ' */'

const resolve = dir => path.resolve(__dirname, '../', dir)
const entry = 'src/index.js' // entry relative path
const cPath = 'src/components' // components relative path
const external = Object.keys(require('../package.json').dependencies)

// gen config template
function gen(options) {
  return {
    ...options,
    entry: resolve(options.entry),
    dest: resolve(options.dest),
    format: options.format,
    env: options.env,
    plugins: [node(), commonjs(), json(), vue()].concat(options.plugins || []),
    external,
    banner
  }
}

function gencjs(entry, dest) {
  // return gen({entry, dest, format: 'cjs', env: 'production', exports: 'default'})
  return gen({entry, dest, format: 'cjs', env: 'production'})
}

function genes(entry, dest) {
  return gen({entry, dest, format: 'es', env: 'production'})
}

function genumd(entry, dest) {
  return gen({
    entry, dest, format: 'umd', env: 'production', plugins: [
      babel({babelHelpers: 'bundled', exclude: 'node_modules/**'}),
    ]
  })
}

function genmin(entry, dest) {
  return gen({
    entry, dest, format: 'umd', env: 'production', plugins: [
      babel({babelHelpers: 'bundled', exclude: 'node_modules/**'}),
      terser()
      // babel({ babelHelpers: 'runtime', exclude: 'node_modules/**' })
    ],
    sourcemap: true
  })
}

// gen complete config
function genConfig(opts) {
  const config = {
    input: opts.entry,
    external: opts.external,
    plugins: [].concat(opts.plugins || []),
    output: {
      file: opts.dest,
      format: opts.format,
      exports: opts.exports ? opts.exports : 'auto',
      banner: opts.banner,
      name: opts.moduleName || moduleName,
      sourcemap: opts.sourcemap || false,
    },
    onwarn: (msg, warn) => {
      if (!/Circular/.test(msg)) {
        warn(msg)
      }
    }
  }

  const vars = {}

  if (opts.env) {
    vars['process.env.NODE_ENV'] = JSON.stringify(opts.env)
  }
  config.plugins.push(replace(vars))

  if (opts.transpile !== false) {
    config.plugins.push(buble({
      objectAssign: 'Object.assign',
      transforms: {
        arrow: true,
        dangerousForOf: true,
        asyncAwait: false,
        generator: false
      }
    }))
  }

  Object.defineProperty(config, '_format', {
    enumerable: false,
    value: opts.format
  })

  return config
}

// entry builds
const builds = {
  cjs: genConfig(gencjs(entry, `lib/index.js`)), // build entry cjs
  es: genConfig(genes(entry, `es/index.js`)), // build entry es
  umd: genConfig(genumd(entry, `dist/${moduleName}.js`)), // build entry umd
  min: genConfig(genmin(entry, `dist/${moduleName}.min.js`)), // build entry umd terser
}

// components builds
const componentsBuilds = {
  cjs: dirs => {
    return dirs.map(dir => { // components cjs
      const opts = gencjs(`${cPath}/${dir}/index.js`, `lib/${dir}/index.js`)
      return genConfig(opts)
    })
  },
  es: dirs => {
    return dirs.map(dir => { // components es
      const opts = genes(`${cPath}/${dir}/index.js`, `es/${dir}/index.js`)
      return genConfig(opts)
    })
  }
}

// gen complete rollup configs
function genConfigs(format) {
  let configs
  switch (format){
    case 'umd':
      configs = [builds[format], builds['min']]
      break
    default:
      const dirs = fs.readdirSync(resolve(cPath)).filter(dir => fs.statSync(`${cPath}/${dir}`).isDirectory())
      const cb = componentsBuilds[format]
      configs = [
        builds[format],
        ...cb(dirs)
      ]
  }
  return configs
}

const format = process.env.FORMAT || 'cjs'

export default genConfigs(format)
