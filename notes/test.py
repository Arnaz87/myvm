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

T("Asignar dict, acceder attr")
carro.__dict__["ventanas"] = 5
test( carro.ventanas == 5 )

T("Asignar attr, acceder dict")
carro.ventanas = 8
test( carro.__dict__["ventanas"] == 8 )

T("Usar método de Clase")
testeq( carro.saludar() , Carro.saludar(carro))

T("Dict no tiene el método")
testn( "saludar" in carro.__dict__ )

T("Sobrescribir método con dict")
nmethod = lambda: "!"
carro.__dict__["saludar"] = nmethod
testeq( nmethod() , carro.saludar() )
T("Método sobreescrito")
testneq( carro.saludar() , Carro.saludar(carro) )
T("Reestablecer método sobrescrito")
del carro.__dict__["saludar"]
testeq( carro.saludar() , Carro.saludar(carro))

T("Usar método de la clase padre")
testeq( carro.nvel() , Carro.nvel(carro) )

# Esto en otros lenguajes vendría siendo polimorfismo, pero eso no
# existe en Python porque todos los objetos se pueden comportar como
# cualquier cosa. Esto no es buena práctica.
T("Hacerse pasar por clase padre")
carro.__class__ = Vehiculo
testeq( type(carro), Vehiculo)
T("Impostor no usa sus métodos originales")
testneq( carro.saludar() , Carro.saludar(carro) )
T("Impostor usa métodos de la nueva clase")
testeq( carro.saludar() , Vehiculo.saludar(carro) )
T("Impostor mantiene sus viejos atributos")
test( hasattr(carro, "ruedas") )
T("Pero impostor pierde sus viejos métodos")
testn( hasattr(carro, "rodar") )
# Restablecer.
carro.__class__ = Carro

T("Impostor de clase externa")
o = Objeto() # Uso mi clase Objeto, porque no se puede modificar atributos para objeto.
o.__class__ = Carro
testeq( type(o) , Carro )
T("Impostor tonto que usa dict, no funciona")
o = Objeto()
o.__dict__["class"] = Carro
testneq( type(o) , Carro )
# Aquí se demuestra que python no lee el diccionario para revisar la clase.
T("La clase no se guarda en dict")
testneq( o.__class__ , o.__dict__["class"] )
# La clase de un objeto está en un atributo especial de la instancia,
# no en el diccionario.
T("Constructores pueden inicializar instancias de otras clases")
del o.__dict__["class"]
Carro.__init__(o)
testeq( o.ventanas , Carro().ventanas )
# En Python2 esto no funciona, porque antes revisaba que la instancia fuera
# de la clase que la construye, este ya no es el caso en Python3.

class MyCall:
  def __call__ (self):
    return "Class Method"

T("Método call de la clase")
c = MyCall()
testeq( c() , "Class Method")
T("Asignar call a la instancia")
nc = MyCall()
nc.__call__ = lambda: "Instance Method"
testneq( nc.__call__ , c.__call__ )
T("Llamar el call de la instancia")
testneq( nc.__call__() , c.__call__() )
T("Llamar el objeto como callable, no funciona")
testneq( nc() , c() )
# en Python3 la búsqueda de métodos especiales empieza desde la clase, si una
# instancia define métodos especiales se ignoran. Esto es así porque las clases
# pueden definir métodos especiales, pero estos no son para que ellas las usen,
# son para que las instancias de esa clase los use. Python2 sí considera los
# atributos de la instancia para los métodos especiales.

gatr = object.__getattribute__
carro = Carro()
carro.ventanas == 6 # Comportamiento normal, lo esperado
gatr(carro, "ventanas") == 6 # Usando getattribute de objeto, se comporta igual

Carro.__getattribute__ = lambda self, key: "lol"
carro.ventanas == "lol" # Reemplacé getattribute de la clase, debería pasar.

gatr(carr, "ventanas") # Que debería pasar aquí?
# Al hacer el experimento, me dio 6
# Lo que significa que el getattribute de object es el que busca el valor
# original en una instancia, lo que significa que internamente python sólo busca el primer
# getattribute que el objeto tenga disponible y lo ejecuta, y la mayoría de
# las veces el primero que se encuentra disponible es el de object, y es éste
# método el que hace el resto del trabajo, no es código interno de python.

Carro.__call__ = lambda self: print("hola")
carro.__call__ == "lol" # El getattribute que puse sigue funcionando
carro() # Esto imprime "hola"
# La búsqueda de métodos especiales es interna, por eso getattribute no afecta
gatr(carro, "__call__") # Devuelve bound_method lambda
# gatr sigue funcionando, y devuelve el lambda que le asigné a carro, pero
# no tiene que ver, para los métodos especiales se usa otro mecanismo.  

class Clase:
  def __init__ (self):
    self.x = 42

satr = object.__setattr__

c = Clase()
c.x = 3
c.x == 3

Clase.__setattr__ = lambda self, key, val: object.__setattr__(self, key, val+10)

c.x = 5
c.x == 15

satr(c, "x", 7)
c.x == 7




