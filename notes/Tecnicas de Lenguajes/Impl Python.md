# Implementación Python

Solo vamos a hablar de instancias y clases, vamos a obviar los otros tipos
básicos como números, arrays, diccionarios, etc.

Hay un objeto base, del que todos los objetos de python descienden, y tienen
que comportarse como él

    class Base
      Type class
      Dict fields # No estoy tan seguro, muchos objetos no tienen
      bool instanceof (Type cls)
        return class.inherits?(cls)
      # Usado para buscar atributos de instancia en las clases
      # También para invocar métodos especiales (un método especial solo
      # puede estar en una de las clases)
      var classget (string key)
        found = class.instanceget(key)
        if found == null return (null, false)
        if found.instanceof(functionType)
          found = boundMethod(found, this)
        return (found, true)
      # Asignar un atributo de la instancia
      void set (string key, var value)
        if statr = classget("__setattr__")
          return statr(key, value)
        switch key
          case "__class__": return class = value
          case "__dict__": return fields = value
        fields[key] = value
      # Acceder a un atributo de la instancia
      var get (string key)
        if gtatr = classget("__getattribute__")
          return gtatr(key)
        # Todo esto lo maneja object.__getattribute__, no es código interno
        # tengo que cambiar eso y mover este código.
        switch key
          case "__class__": return class
          case "__dict__": return fields
        if ( field = fields[key] ) return field
        if ( clsf = classget(key) ) return clsf
        if gtatr = classget("__getattr__")
          return gtatr(key)
        return null

Las clases de python descienden de Type

    class Type (Base)
      Type[] bases
      string name
      Dict fields
      # Por defecto, la clase de una clase es type, y por defecto
      # la superclase es object, y luego de asignar las superclases base,
      # Python tiene que calcular la jerarquía real.
      init (name)
        class ||= typeClass
        bases ||= [objectClass]
        bases = computehierarchy(bases)
      bool inherits? (Type cls)
        if (this == cls) return true
        return bases.map(x -> x.inherits?(cls)).any?
      # Para cuando una instancia busca un atributo. Es diferente a get
      # porque las instancias no buscan atributos en la clase de la clase,
      # solo en las superclases.
      var instanceget (key)
        field, present = fields[key]
        if (present) return field
        return bases.map(x -> x.instanceget(cls)).first
      # Sobreescribir get, porque para un tipo, si no consigue un atributo
      # en sus campos ni en sus clases, tiene que buscar en las superclases
      var get (key)
        found = super.get(key)
        if found /= null return found
        return instanceget(key)

    objectClass = Type(name="object",bases=[])
    typeClass = Type(name="type",bases=[objectClass])
    # Creo que toda esta función está mal, tengo que investigar mejor esto
    typeClass.fields["__call__"] = Type self, ... args ->
      obj = self.get("__new__").call()
      self.get("__init__").call(obj)
      return obj

    class Instance (Base)
      Dict fields
      # La clase de una instancia es obligatoria
      init (class)

Solo está implementado `Instance.get`, el set por ahora lo estoy traduciendo a
`instance.fields["x"]`, pero en realidad está implementado casi igual que get,
la diferencia es que set no sube por las clases base.

También falta implementar call, que es de hecho una parte muy importante del
lenguaje, sobre todo Type.call.

Hay que revisar lo de las metaclases, parece un pelo importante y complicado...

## Traducir Python a Lang

Python:

    class Vehiculo:
      def __init__(self, vel = 1):
        self.velocidad = vel
      def andar(self): print("Vehículo anda a " + self.nvel())
      def nvel(self): return str(self.velocidad) + " Km/s"

    class Rodable:
      def __init__(self, rds):
        self.ruedas = rds
      def rodar(self): print("Rodando con " + self.nrds())
      def nrds(self): return str(self.ruedas) + " ruedas"

    class Carro (Vehiculo, Rodable):
      def __init__(self):
        Vehiculo.__init__(self)
        Rodable.__init__(self, 4)
        self.ventanas = 6

    c = Carro()
    c.rodar()
    c.ruedas
    c.ruedas = 2

Lang:

    Vehiculo = Type(name="Vehiculo")
    Vehiculo.fields["__init__"] = self, vel=1 ->
      self.fields["velocidad"] = vel
    Vehiculo.fields["andar"] = self ->
      print("Vehiculo anda a " + self.classget("nvel")() )
    Vehiculo.fields["nvel"] = self ->
      return str(self.get("velocidad")) + " ruedas"

    Rodable = Type(name="Rodable")
    Rodable.fields["__init__"] = self, rds ->
      self.fields["ruedas"] = rds
    Rodable.fields["rodar"] = self ->
      print("Rodando con " + self.classget("nrds")() )
    Rodable.fields["nrds"] = self ->
      return str(self.get("ruedas")) + " ruedas"

    Carro = Type(name="Carro", bases=[Vehiculo, Rodable])
    Carro.fields["__init__"] = self ->
      Vehiculo.trymethod("__init__", self)
      Rodable.trymethod("__init__", self, 4)
      self.fields["ventanas"] = 6

    # Esta línea debería ser así, pero aún no he implementado call ni Type.call
    # c = Carro.call()
    c = Instance(Carro)
    c.get("rodar").call()
    c.get("ruedas")
    # Aquí debería usar c.set("ruedas", 3), pero no lo he implementado.
    c.fields["ruedas"] = 3


