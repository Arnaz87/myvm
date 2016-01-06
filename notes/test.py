# Prueba de python para probar como funciona el lenguaje...

class Objeto:
  pass # Objeto Vacío. Lo uso porque no se puede usar la clase "object".

class Vehiculo:
  def __init__(self, vel = 1):
    self.velocidad = vel
  def andar(self):
    print("Vehículo anda a " + self.nvel())
  def nvel(self): str(self.velocidad) + " Km/s"
  def contar(self): print(self.nvel())
  def saludar(self): print("Hola, soy un Vehiculo que anda!")

class Rodable:
  def __init__(self, rds):
    self.ruedas = rds
  def rodar(self):
    print("Rodando con " + self.nrds())
  def nrds(self): str(self.ruedas) + " ruedas"
  def contar(self): print(self.nrds())
  def saludar(self): print("Hola, soy un Rodable que rueda!")

class Carro (Vehiculo, Rodable):
  def __init__(self):
    super().__init__()
    
#    super(Vehiculo, self).__init__()
#    super(Rodable, self, 4).__init__()
#    print("super Vehiculo: " + repr(super(Vehiculo, self)) );
    self.ventanas = 6
  def saludar(self): print("Hola, soy un Carro que anda con ruedas")
