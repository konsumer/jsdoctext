/* global describe it */
import {expect} from 'chai'
import jsdoctext from './lib.js'
import fs from 'fs'
const doc = fs.readFileSync(__dirname + '/test.doc')


describe('jsdoctext', () => {
  it('can be tested', () => {
    expect(1 + 1).to.equal(2)
  })

  it('should convert the test doc', () => {
	console.log(jsdoctext(doc.toString()))
  })
})
