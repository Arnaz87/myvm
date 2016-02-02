#require 'pp' # Pretty Printer
require './base'
require './lexer'
require './parser'

#text = File.read "test.lua"
text = "...;...123456\"hola\";truefalse true nil...\"mundo\""
st = ParseState.new text

tokens = tokenize text
puts tokens
ast = parse tokens
puts ast