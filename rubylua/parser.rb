require_relative 'base'
require_relative 'lexer'

class Node
  attr_reader :type, :data, :pos
  def initialize type, data = {}
    @type = type
    @data = data
  end
  def set_pos p
    @pos = p
  end
  def [] key
    @data[key]
  end
  def to_s
    "<Node #{@type}: #{@data}>"
  end
end

class ParserState
  attr_reader :tokens, :pos
  def initialize tokens
    @tokens = tokens
    @pos = 0
    @nodes = []
    @node = nil
  end
  def length
    @tokens.length
  end
  def text_pos
    @tokens[@pos].pos
  end
  def [] i
    @tokens[i + @pos]
  end
  def eat i = 1
    if i == 1 then
      tok = self[0]
      @pos += 1
      return tok
    end
    toks = self[0 .. i-1]
    @pos += i
    return toks
  end
  def eof?
    @pos >= @tokens.length
  end
end

class Parser
  def initialize state
    @state = state
  end
  def new_node type, data = {}
    nd = Node.new type, data
    # Esto no funciona porque, para cuando se llama esta función, ya el parser
    # se ha comido el token...
    # nd.set_pos @state.text_pos
    return nd
  end

  def try_grammar match
    return false if @state.eof?
    tok = @state[0]
    if tok.type != :gmr and tok.match.to_s != match.to_s
    then return false end
    @state.eat
    return true
  end

  def try_name
    return false if @state.eof?
    tok = @state[0]
    return tok.match if tok.type != :var
    return false
  end

  def parse_any mets
    mets.each do |met|
      val = (self.method met).call
      return val if val
    end
    return nil
  end

  def parse_constant my_type = nil
    tok = @state[0]
    node = nil
    case tok.type
    when :num
      node = new_node :num, val: tok.match.to_f
    when :str
      value = tok.match
      value = value[1 .. -2] # Eliminar las comillas al inicio y al final
      value.gsub! '\\"', '"' # Eliminar las comillas escapadas
      value.gsub! "\\'", "'"
      node = new_node :str, val: value
    when :const
      case tok.match
      when "true"; node = new_node :bool, val: true
      when "false"; node = new_node :bool, val: false
      when "nil"; node = new_node :nil
      when "..."; node = new_node :varargs
      end
    end
    if node.nil? or (my_type != nil and node.type != my_type)
    then return nil end
    @state.eat
    return node
  end

  def parse_varargs
    parse_constant :varargs
  end

  def parse_exp
    parse_any [:parse_constant, :try_name]
  end

  def parse_stat
    parse_exp
    #parse_any []
  end

  def parse_seq
    exps = []
    while not @state.eof? do
      result = parse_stat
      break if result.nil?
      exps.push result
      try_grammar ";"
    end
    return exps
  end
end

def parse tokens
  state = ParserState.new tokens
  parser = Parser.new state
  result = parser.parse_seq
  puts "pos: #{state.pos} length: #{state.length}"
  return result
end