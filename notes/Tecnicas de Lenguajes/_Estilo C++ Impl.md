# Implementación Estilo C++

Nota: Nada de el siguiente código es completamente legal. El código C++ de
muestra es una sintaxis modificada para poder escribirlo más fácil. Las
abstracciones las traduciré a un C++ más simple sin dichas abstracciones.

## Clases simples

Una clase C++ básica, y sus instancias:

    Class Carro {
      int ruedas;
      void andar ();
      Carro (int nr) {
        this.ruedas = nr;
      };
    }
    Carro carro;
    Carro *pcarro = new Carro(4);
    carro.andar()
    pcarro->andar()
    print(carro.ruedas);
    print(pcarro->ruedas);

traduce a:

    struct Carro {
      int ruedas;
    }
    void carro_andar (Carro *c);
    void carro_init (Carro *c, int nr) {
      (*c).ruedas = nr;
    }
    // Sin constructor:
    Carro carro; // Solo reserva espacio en el stack
    // Usando new:
    Carro *pcarro = malloc( sizeof(Carro) ); // Reservar espacio en el Heap
    carro_init(pcarro, 4); // Constructor
    // Invocar métodos:
    carro_andar(&carro);
    carro_andar(pcarro);
    // Acceder a variables:
    print(carro.ruedas);
    print((*carro).ruedas);

## Herencia simple

Una Clase con un padre:

    Class Vehiculo {
      int ruedas;
      void andar ();
      Vehiculo (int nr) {
        this.ruedas = nr;
      }
    }
    Class Carro : public Vehiculo {
      int ventanas;
      Carro (int nr) : Vehiculo(4)) {
        this.ventanas = 6;
      }
    }
    Carro *carro = new Carro()
    carro->andar();
    x = carro->ruedas;
    x = carro->ventanas;
    Vehiculo *veh = carro; // Casting
    veh->andar();
    x = veh->ruedas;

traduce a:

    struct Vehiculo { int ruedas; }
    struct Carro {
      Vehiculo vehiculo;
      int ventanas;
    }
    void vehiculo_andar (Vehiculo *v);
    void vehiculo_init (Vehiculo *v, int nr) {
      v->ruedas = nr
    }
    void carro_init (Carro *c) {
      vehiculo_init(&(c->vehiculo), 4);
      c->ventanas = 6;
    }
    Carro *carro = malloc(Carro);
    carro_init(carro);
    vehiculo_andar(&(carro->vehiculo));
    x = carro->vehiculo.ruedas;
    x = carro->ventanas;
    Vehiculo *veh = &(carro->vehiculo); // Casting
    vehiculo_andar(veh);
    x = veh->ruedas;

## Casting

No estoy seguro. Buscar como está implementado:
`static_cast<T>(void*)` y `dynamyc_cast<T>(void*)`.

## Herencia Múltiple

Clases que tienen varios padres (No ancestros, eso es herencia simple).

