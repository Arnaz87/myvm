# -*- coding: utf-8 -*-
# Esta linea de arriba es porque python2 no acepta unicode e.e
# Por Dios! Son los comentarios! A quién le importa?!
# menos mal lo arreglaron en Python 3...

# Al final, la arquitectura de Python3 es muy diferente a la de Python2,
# muchas de las pruebas de abajo fallan por diferencias en la semántica del
# lenduaje, más que por la sintaxis, así que si quiere probar la arquitectura
# de Python2, hay que hacer pruebas diferentes.

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
  global current_test
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

# Restablecer
del carro.__dict__["saludar"]

T("Call Parent from Class")
testeq( carro.nvel() , Carro.nvel(carro) )

# Esto en otros lenguajes vendría siendo polimorfismo, pero eso no
# existe en Python porque todos los objetos se pueden comportar como
# cualquier cosa. Esto no es buena práctica.
T("Parent Impostor")
carro.__class__ = Vehiculo
testeq( type(carro), Vehiculo)
T("Parent Impostor not call original")
testneq( carro.saludar() , Carro.saludar(carro) )
T("Parent Impostor call new Class")
testeq( carro.saludar() , Vehiculo.saludar(carro) )
T("Parent Impostor keeps attributes")
test( hasattr(carro, "ruedas") )
T("Parent Impostor loses methods")
testn( hasattr(carro, "rodar") )
# Restablecer.
carro.__class__ = Carro

T("Impostor")
o = Objeto() # Uso mi clase Objeto, porque no se puede modificar atributos para objeto.
o.__class__ = Carro
testeq( type(o) , Carro )
T("Fool Impostor")
o.__class__ = Objeto
o.__dict__["class"] = Carro
testneq( type(o) , Carro )
T("Class attr is not in dict")
testneq( o.__class__ , o.__dict__["class"] )
T("Not instances fool Constructors")
del o.__dict__["class"]
Carro.__init__(o)
testeq( o.ventanas , Carro().ventanas )

class MyCall:
  def __call__ (self):
    return "Class Method"

T("Class Call")
c = MyCall()
testeq( c() , "Class Method")
T("Set Instance Call")
nc = MyCall()
nc.__call__ = lambda: "Instance Method"
testneq( nc.__call__ , c.__call__ )
T("Call special attribute")
testneq( nc.__call__() , c.__call__() )
T("Object Call not equal")
testneq( nc() , c() )
# Esto es una cosa de Python, aparentemente ignora el atributo que le puse a
# nc, y salta de una vez al método que definí en la clase.


