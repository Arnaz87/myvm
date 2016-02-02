require './base'
require './lexer'

text = File.read "test.lua"
st = ParseState.new text

tokens = tokenize text
puts tokens