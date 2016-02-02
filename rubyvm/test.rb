require_relative 'machine'
require_relative 'interpreter'
require_relative 'instruction'

def make_program *args
  args.map { |inst| Instruction.new *inst }
end

mod = {
  main: make_program(
    [:loadval, :str1, "Argumentos:"],
    [:loadval, :str2, "Resultados:"],
    [:loadval, :a, 2],
    [:loadval, :b, 2],
    [:module, :fun, :Main, :pow],

    [:print, :str1],
    [:print, :a],
    [:print, :b],

    [:setarg, :a, 0],
    [:setarg, :b, 1],
    [:call, :fun],
    [:getarg, :r, 0],

    [:print, :str2],
    [:print, :r],

    [:end]
  ),
  add: make_program(
    [:getarg, :x, 0],
    [:getarg, :y, 1],
    [:label, :start],
    [:gtz, :cond, :y],
    [:jumpifn, :end, :cond],
    [:inc, :x],
    [:dec, :y],
    [:jump, :start],
    [:label, :end],
    [:setarg, :x, 0],
    [:end]
  ),
  mult: make_program(
    [:module, :add, :Main, :add],
    [:getarg, :n, 0],
    [:getarg, :m, 1],
    [:loadval, :r, 0],
    [:label, :start],
    [:gtz, :cond, :m],
    [:jumpifn, :end, :cond],
    [:setarg, :n, 1],
    [:setarg, :r, 0],
    [:call, :add],
    [:getarg, :r, 0],
    [:dec, :m],
    [:jump, :start],
    [:label, :end],
    [:setarg, :r, 0],
    [:end]
  ),
  pow: make_program(
    [:module, :mult, :Main, :mult],
    [:getarg, :b, 0],
    [:getarg, :e, 1],
    [:loadval, :r, 1],
    [:label, :start],
    [:gtz, :cond, :e],
    [:jumpifn, :end, :cond],
    [:setarg, :r, 0],
    [:setarg, :b, 1],
    [:call, :mult],
    [:getarg, :r, 0],
    [:dec, :e],
    [:jump, :start],
    [:label, :end],
    [:setarg, :r, 0],
    [:end]
  )
}
Machine.debug = 10
Machine.modules[:Main] = mod
#Machine.load_function Machine.modules[:Main][:main]
Interpreter.execute


def exec *args
  Interpreter.exec Instruction.new *args
end


=begin

n = Args[0]
m = Args[1]
add = Main.add
r = 0
:start
cond = m>0
goto :end if not cond
Args[0] = r
Args[1] = n
add()
r = Args[0]
m--
goto :start
:end
Args[0] = r
return

function mult (n, m):
  add = Main.add
  r = 0
  repeat:
    if not m>0 break
    r = add(r, n)
    m--
  return r
=end