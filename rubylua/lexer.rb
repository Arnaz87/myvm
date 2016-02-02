require_relative 'base'

class Token
  attr_reader :type, :macth, :pos
  def initialize type, match = nil
    @type = type
    @match = match
  end
  def set_pos pos
    @pos = pos
  end
  def length
    @match.length
  end
  def to_s
    "<Token-#{@type}: #{@match}>"
  end
end

class Match
  def initialize text
    @text = text
  end
end

def try_match patt, type, str
  case patt
  when Array
    matched = nil
    patt.each do |p|
      if str.start_with? p and
        (matched.nil? or
        p.length > matched.length)
      then matched = p end
    end
    return nil if matched.nil?
    return Token.new type, matched
  when Regexp
    result = patt.match str
    if result.nil? or
      result.length == 0 or
      result.begin(0) > 0 or
      result[0].length == 0
    then return nil end
    return Token.new type, result[0]
  end
end

def consume_space str
  result = /\s*/.match str
  unless result.nil?
    len = result[0].length
    return str[len .. -1]
  end
  return str
end

def tokenize input
  text = if input.class == String
    then input else input.text end
  tokens = []

  ### Constantes para comparar
  numrgx = /[0-9]+(\.[0-9]+)?([eE][-+]?[0-9]+)?/
  varrgx = /[a-z][a-zA-Z0-9]*/
  strrgx = /\"([^\\^\"]|\\.)*\"/
  kws = ["do", "elseif","else", "end", "for", "function", "if", "in",
         "repeat", "then", "until", "while", "local", "break", "return"]
  cons = ["true", "false", "nil", "..."]
  ops = ["+", "-", "*", "/", "%", "^", "==", "<=", ">=", "<", ">", "~=",
         "and", "or", "not", "..", "#"]
  grammar = [";", "[", "]", "{", "}", "(", ")", ".", ",", "="]

  ### Procedimiento
  while text.length > 0
    text = consume_space text
    match = Match.new text
    token = nil
    [ try_match(kws, "kw", text),
      try_match(ops, "op", text),
      try_match(cons, "const", text),
      try_match(numrgx, "num", text),
      try_match(varrgx, "var", text),
      try_match(strrgx, "str", text),
      try_match(grammar, "gmr", text)
    ].each do |tok|
      if (not tok.nil?) and (token.nil? or
        tok.length > token.length) then
        token = tok
      end
    end
    raise "Unrecognized token. #{text}" if token.nil?
    tokens.push token
    text = text[token.length .. -1]
  end
  return tokens
end