class Instruction
  def initialize iname, *iargs
    @name = iname
    @args = iargs
  end

  def length
    @args.length
  end

  def [] index
    @args[index]
  end

  def name
    @name
  end

  def to_s
    "<Inst #{@name}: #{@args}>"
  end
end
