# Implementación Python

Solo vamos a hablar de instancias y clases, vamos a obviar los otros tipos
básicos como números, arrays, diccionarios, etc.

    class Base // Objeto base de python.
      Class class
      Dict fields
      bool instanceof (Class cls)
        return class.descends?(cls)
      var get (string key)
        switch key
          case "__class__": return class
          case "__dict__": return fields
        return fields[key] || class.instanceget(key)
    class Class (Base)
      Class superclass
      string name
      init (name)
      bool descends? (Class cls)
        (this == cls) || superclass.descends?(cls)
      var instanceget(key)
        var got = fields[key]
        if (got)
          if (got.instanceof(functionClass))
            return boundMethod(got)
          return got
        return superclass.instanceget(key)
    class Instance (Base)
      init (class)



