class ParseState
  class Section
  end

  attr_reader :text, :lexer
  def initialize text
    @text = text
    @lexer = Section.new
  end
end