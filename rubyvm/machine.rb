module Machine
  class State
    attr_accessor :code, :pc
    attr_reader :regs, :labels
    def initialize code
      @code = code
      @pc = 0
      @regs = {}
      @run = true
      @debug = 0
      init_labels
    end
    def inst
      @code[@pc]
    end
    def run?
      @run
    end
    def stop
      @run = false
    end
    private
    def init_labels
      @labels = {}
      @code.each_with_index do |inst, i|
        @labels[inst[0]] = i if inst.name == :label
      end
    end
  end

  # Fields
  @stack = []  # Stack de estados
  @args = []
  @modules = {}
  @debug = 0
  def self.state() @stack.last end
  def self.args() @args end
  def self.modules() @modules end

  def self.run?
    @stack.length > 0 and state.run?
  end

  # Function methods
  def self.load_function f
    if f.class == Proc
      f.call
    end
    @stack.push State.new f
    self.debug "  [Entering Stack Level: #{@stack.length}]"
  end

  def self.end_function
    self.debug "  [Exiting Stack Level: #{@stack.length}]"
    @stack.pop
  end

  def self.debug?
    @debug > 0
  end
  def self.debug= val
    @debug = val
  end
  def self.debug str = nil
    if str.nil?
      return @debug
    end
    if debug?
      puts "  #{str}"
    end
  end
end