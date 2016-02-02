require_relative 'machine'

module Interpreter
  # Una pequeña clase que funciona como azúcar sintáctico para acceder
  # a los registros de la máquina.
  class Reg
    attr_reader :jumped, :debuged
    def initialize inst
      @inst = inst
      @jumped = false
      @debuged = false
    end
    def [] index
      Machine.state.regs[@inst[index]]
    end
    def []= index, value
      Machine.state.regs[@inst[index]] = value
    end
    def jump index
      Machine.state.pc = Machine.state.labels[@inst[index]]
      @jumped = true
    end
    def debug str
      str = str.clone
      str.gsub! "$0", self[0].to_s
      str.gsub! "$1", self[1].to_s
      str.gsub! "$2", self[2].to_s
      str.gsub! "%0", @inst[0].to_s
      str.gsub! "%1", @inst[1].to_s
      str.gsub! "%2", @inst[2].to_s
      Machine.debug str
      @debuged = true
    end
  end

  # Método principal
  def self.exec inst
    r = Reg.new inst
    advance = true
    fun = nil

    case inst.name.to_sym
    when :mov; r[0] = r[1]; r.debug "%0 = $1"
    when :neg; r[0] = 0 - r[0]; r.debug "%0 = 0 - $1"
    when :inc; r[0] = r[0] + 1; r.debug "%0++"
    when :dec; r[0] = r[0] - 1; r.debug "%0--"
    when :add; r[0] = r[1] + r[2]; r.debug "%0 = $1 + $2"
    when :sub; r[0] = r[1] - r[2]; r.debug "%0 = $1 - $2"
    when :mul; r[0] = r[1] * r[2]; r.debug "%0 = $1 * $2"
    when :div; r[0] = r[1] / r[2]; r.debug "%0 = $1 / $2"
    when :gtz; r[0] = r[1] > 0   ; r.debug "%0 = $1 > 0"
    when :eq;  r[0] = r[1] == r[2]; r.debug "%0 = $1 == $2"
    when :neq; r[0] = r[1] != r[2]; r.debug "%0 = $1 != $2"
    when :lt;  r[0] = r[1] <  r[2]; r.debug "%0 = $1 < $2"
    when :lte; r[0] = r[1] <= r[2]; r.debug "%0 = $1 <= $2"

    when :setarg; Machine.args[inst[1]] = r[0]; r.debug "A-%1 = $0"
    when :getarg; r[0] = Machine.args[inst[1]]; r.debug "%0 = A-%1"

    when :loadval; r[0] = inst[1]; r.debug "%0 = %1"
    when :print; puts r[0]
    when :module; r[0] = Machine.modules[inst[1]][inst[2]]; r.debug "%0 = %1.%2"
    when :call; fun = r[0]; r.debug "CALL %0"
    when :label; # No hacer nada, pero la instrucción es válida.
    when :jump; r.jump 0; r.debug "JUMP %0"
    when :jumpif; r.jump 0 if r[1]; r.debug "JUMP %0: $1"
    when :jumpifn; r.jump 0 if not r[1]; r.debug "JUMP %0: not $1"
    when :end
      end_fun = true
      advance=false
    else; raise "Unrecognized instruction #{inst}"
    end

    if Machine.debug? and r.debuged
      sleep Machine.debug/100.0
    end

    # El orden de esto importa
    Machine.state.pc += 1 if advance and not r.jumped
    Machine.load_function fun if fun
    Machine.end_function if end_fun
  end

  def self.execute
    main = Machine.modules[:Main][:main]
    Machine.load_function main

    while Machine.run?
      self.exec Machine.state.inst
    end
  end
end