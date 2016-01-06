# Prueba de python para probar como funciona el lenguaje...

class Objeto:
  pass # Objeto Vacío. Lo uso porque no se puede usar la clase "object".

class Vehiculo:
  def __init__(self, vel = 1):
    self.velocidad = vel
  def andar(self):
    print("Vehículo anda a " + self.nvel())
  def nvel(self): return str(self.velocidad) + " Km/s"
  def contar(self): return self.nvel()
  def saludar(self): return "Hola, soy un Vehiculo que anda!"

class Rodable:
  def __init__(self, rds):
    self.ruedas = rds
  def rodar(self):
    print("Rodando con " + self.nrds())
  def nrds(self): return str(self.ruedas) + " ruedas"
  def contar(self): return self.nrds()
  def saludar(self): return "Hola, soy un Rodable que rueda!"

class Carro (Vehiculo, Rodable):
  def __init__(self):
    Vehiculo.__init__(self)
    Rodable.__init__(self, 4)
    self.ventanas = 6
  def saludar(self): return "Hola, soy un Carro que anda con ruedas"

current_test = None
all_tests = dict()

def TEST (name):
  current_test = name
  print("Testing " + name + ":")

T = TEST

def test (val):
  all_tests[current_test] = val
  if val: print("Passed Test.")
  else: print("FAILED TEST!")
  print()

def testn (val):
  test(not val)

def testeq (a, b):
  print(repr(a) + " == " + repr(b))
  test(a == b)

def testneq (a, b):
  print(repr(a) + " != " + repr(b))
  test(a != b)

carro = Carro()

T("Clase Carro")
test( type(carro) == Carro )

T("Set dict, access attr")
carro.__dict__["ventanas"] = 5
test( carro.ventanas == 5 )

T("Set attr, access dict")
carro.ventanas = 8
test( carro.__dict__["ventanas"] == 8 )

T("Direct Method Call")
testeq( carro.saludar() , Carro.saludar(carro))

T("Method not in Dict")
testn( "saludar" in carro.__dict__ )

T("Override method with Dict")
nmethod = lambda: "!"
carro.__dict__["saludar"] = nmethod
testeq( nmethod() , carro.saludar() )

T("Override method not Original")
testneq( carro.saludar() , Carro.saludar(carro) )

# Volver a la normalidad
del carro.__dict__["saludar"]

T("Call Parent from Class")
testeq( carro.nvel() , Carro.nvel(carro) )

T("Parent Polyformism")
carro.__class__ = Vehiculo
testeq( type(carro), Vehiculo)

T("Parent Polyformism not call original")
testneq( carro.saludar() , Carro.saludar(carro) )
T("Parent Polyformism call new Class")
testeq( carro.saludar() , Vehiculo.saludar(carro) )


