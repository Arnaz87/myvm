require_relative 'base'

class Token
  attr_reader :type, :match, :pos
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

class LexerState
  attr_reader :text, :token, :tokens, :pos
  def initialize text
    @text = text
    @token = nil
    @tokens = []
    @pos = 0
  end
  def consume len
    @pos += len
    @text = @text[len .. -1]
  end
  def consume_space
    result = /\s*/.match @text
    consume result[0].length if result
  end
  def try_match patt, type
    match = nil
    case patt
    when Array
      longest = nil
      patt.each do |p|
        if @text.start_with? p then
          longest = p if is_longer? p, longest
        end
      end
      match = Token.new type, longest if longest
    when Regexp
      result = patt.match @text
      if result.nil? or
        result.length == 0 or
        result.begin(0) > 0 or
        result[0].length == 0
      then return end
      match = Token.new type, result[0]
    end
    @token = match if is_longer? match, @token
  end
  def use_token
    raise "Match is Nil!" if @token.nil?
    @token.set_pos @pos
    @tokens.push @token
    consume @token.length
    @token = nil
  end

  ## Helpers
  private
  def is_longer? newer, older
    (not newer.nil?) and (older.nil? or newer.length > older.length)
  end
end

def tokenize input
  text = if input.class == String
    then input else input.text end
  state = LexerState.new text

  ### Constantes para comparar
  numrgx = /[0-9]+(\.[0-9]+)?([eE][-+]?[0-9]+)?/
  varrgx = /[a-z][a-zA-Z0-9]*/
  strrgx = /\"([^\\^\"]|\\.)*\"/
  kws = %w(do elseif else end for function if in repeat then until while local break return)
  cons = %w(true false nil ...)
  ops = %w(+ - * / % ^ == <= >= < > ~= and or not .. #)
  grammar = %w(; [ ] { } ( ) . , =)
  # %w es sintaxis especial para arrays de palabras

  ### Procedimiento
  while state.text.length > 0
    state.consume_space
    state.try_match(kws, :kw)
    state.try_match(ops, :op)
    state.try_match(cons, :const)
    state.try_match(numrgx, :num)
    state.try_match(varrgx, :var)
    state.try_match(strrgx, :str)
    state.try_match(grammar, :gmr)
    raise "Unrecognized token. #{text}" if state.token.nil?
    state.use_token
  end
  return state.tokens
end