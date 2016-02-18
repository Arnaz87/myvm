## [2016-02-18 11:42] Ejemplo

Un ejemplo simple de uso de genéricos que la máquina debe soportar. Aquí hay un genérico simple, y una interfaz genérica de la que la clase extiende, y main debe saber como trabajar con todos estos tipos. Já, está pelúo! Eso que ni siquiera me estoy metiendo con tipos superiores porque java no los soporta.

```java
interface Container <T> {
  T get ();
  void set (T);
  int count ();
}
class Box<T> implements Container<T> {
  T value;
  Box () { this.set(null); }
  Box (T nval) { this.set(nval); }
  @override
  T get () { return this.value; }
  @override
  void set (T nval) { this.value = nval; }
  @override
  int count () { return (this.value == null)? 0 : 1; }

  static void main (String[] args) {
    Box<String> bx = new Box<String>()
    Container cont = bx; // Cast estático
    Container<String> stcont = cont; // Cast dinámico
    bx.set("Hola");
    bx.set(4); // Cast estático, no compila.
    cont.set("Chao");
    cont.set(5); // Cast dinámico, Compila pero da Error en Ejecución.
    stcont.set(6); // Cast estático, no compila.
  }
}
```

## [2016-02-18 12:04]

```
module Box
Box (GenericClass) {
  types (T)
  instance (GenericStructure) {
    types (T)
    value :: T
  }
  set (GenericFunction) {
    types (T)
    parameters (nval :: T)
  }
}
BoxString (InstancedClass) { Box, String }
main (Function) {
  parameters ()
  bx :: BoxString = new BoxString
  _temp_str :: String = "Hola"
  _temp_num :: Integer = 4
  BoxString.set(bx, _temp_str)
  BoxString.set(bx, _temp_num) // Compile Error
}
```

## [2016-02-19 09:42] Ejemplo con restricción de tipo

```java
class Maths {
  Num nsum (Num a, Num b) {
    return (Float) a + b;
    // Float es Num, y la función devuelve Num.
    //return magiaNegra(a,b);
  }
  <T extends Num> T gsum (T a, T b) {
    return (Float) a + b; // Compile Error.
    // Float es Num, pero no sabemos si es T.
    //return magiaNegra(a,b);
    return a+b; // Para que la función no falle por completo
  }
  static void main (String[] args) {
    Int a = 1;
    Int b = 2;
    Int nresult = (Int) nsum(a,b); // Runtime Error
    // Sabemos que nsum devuelve un Float, pero el typechecker no lo sabe.
    Int gresult = gsum<Int>(a,b);
    // Sabemos que gsum devuelve lo que le digamos, y le dijimos Int.
  }
}
```

```
module Maths
nsum (Function) {
  parameters (a :: Num, b :: Num)
  returns (:: Num)
  _temp_1 :: Num = Num.Add(a,b)
  _temp_2 :: Float = cast _temp_1 Float
  _temp_3 :: Num = _temp_2
  return _temp_3
}
gsum (GenericFunction) {
  types (T :: Num)
  parameters (a :: T, b :: B)
  returns (:: T)
  _temp_1 :: T = T.Add(a,b) // Hmmm
  // Normalmente no sabemos los métodos de T
  // pero esta vez sí porque sabemos que es Num
  _temp_2 :: Float = cast _temp_1 Float
  _temp_3 :: Num = _temp_2
  return _temp_2 // Falla, no sabemos si T es Float
  return _temp_3 // Falla, devuelve Num, pero no queremos Num, queremos T
  return _temp_1 // Funciona!
}
_gsum_Int (InstancedFunction) { gsum, Int }
main (Function) {
  a :: Int = 1
  b :: Int = 2
  _temp_1 :: Num = nsum(a,b)
  nresult :: Int = cast _temp_1 Int // downcasting, puede fallar...
  // de hecho, este falla!
  gresult :: Int = _gsum_Int(a,b) // Whee!!
}
```