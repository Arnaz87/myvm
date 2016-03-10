## [2016-03-07 16:48] Una Clase
```java 
final class MyClass {}
static void main () {
  MyClass o = new MyClass();
}
```

Compilado:
```
MyClass (Class) {
  Java.Object super
}
// Field es un tipo de función especial autogenerada.
MyClass_super (Field) = MyClass.super
main (Function) {
  o: MyClass = $new MyClass
}
```

## [2016-03-10 10:02] Clase Método Atributo
```java
final class MyClass {
  public int foo;
  final void bar () {}
  // si no uso final, el método sería virtual, y eso es más complicado
}
static void main () {
  MyClass o = new MyClass();
  o.bar();
}
```

Compilado:
```
MyClass (Class) {
  Java.Object super
  Int foo
}
MyClass_super (Field) = MyClass.super
MyClass_bar (Function) {
  _param: MyClass
}
main (Function) {
  o: MyClass = $new MyClass
  _arg = o
  $call MyClass_bar
}
```

## [2016-03-10 10:02] Clase Subtipo Simple
```java
class MyObject {}
final class MyClass extends MyObject {}
static void main () {
  MyClass c = new MyClass();
  MyObject o = c;
}
```

Compilado:
```
MyObject (Class) {
  Java.Object_Trait original
  Java.Object super
}
MyObject_super (Field) = MyObject.super
MyClass (Class) {
  MyObject super
}
MyClass_new (Function) {
  mc: MyClass = $new MyClass
  mo: MyObject = $new MyObject
  mo.original = mc
  mc.super = mo
  _return: MyClass = mc
}
MyClass_super (Field) = MyClass.super
main (Function) {
  c: MyClass = new MyClass
  o: MyObject = MyClass.super
}
```

## [2016-03-10 14:40] Herencia y Sobreescritura
```java
class MyObject {
  void f () {};
}
final class MyClass extends MyObject {
  @override
  void f () {}
}
static void main () {
  MyClass c = new MyClass();
  MyObject o = c;
  o.f();
}
```

Compilado:
```
MyObject (Struct) {
  Java.Object_Trait original
  Java.Object super
  MyObject_vtable vtable
}
MyObject_vtable (Struct) {
  Function<Void, Void> f
}
MyObject_f (Function<Void, Void>) {}
MyObject_MyObject_impl (MyObject_vtable) {
  f = MyObject_f
}
MyObject_new (Function) {
  mo: MyObject = $new MyObject
  mo.vtable = MyObject_MyObject_impl
  mo.original = mo
  mo.super = Java.Object
  _return: MyObject = mc
}

MyClass (Struct) {
  MyObject super
}
MyClass_f (Function<Void,Void>) {}
MyClass_MyObject_impl (MyObject_vtable) {
  f = MyClass_f
}
MyClass_new (Function) {
  mc: MyClass = $new MyClass
  mo: MyObject = MyObject_new
  mo.vtable = MyClass_MyObject_impl
  mo.original = mc
  mc.super = mo
  _return: MyClass = mc
}

main (Function) {
  c: MyClass = new MyClass
  o: MyObject = MyClass.super
  ovt: MyObject_vtable = o.vtable
  ovtf: Function = ovt.f
  f()
}
```

No me gusta que _MyObject_ esté cargando con sigo la vtable, esa es la clase de trabajo que la máquina virtual debería hacer.

Creo que la máquina tiene la capacidad de hacer algo así usando traits, voy a probar...

```
FunctionVV (Instance) = Function, Void, Void
MyObject_trait (Trait) {
  $params Class
  FunctionVV f
}
MyObject_struct (Struct) {}
MyObject_f (FunctionVV) {}
MyObject_MyObject_impl (Impl) {
  $trait MyObject
  $args MyObject_struct
  f = MyObject_f
}

MyClass_struct (Struct) {}
MyClass_f (FunctionVV) {}
MyClass_MyObject_impl (Impl) {
  $trait MyObject
  $args MyClass
  f = MyClass_f
}

main (Function) {
  c : MyClass = new MyClass_struct
  otrt : MyObject = $trait MyObject(c)
  of : FunctionVV = otrt.f
  of()
}
```

Esto es mucho más corto y le da más control a la máquina. Con este método, todas las clases de Java (excepto las finales) son traits, con una implementación por defecto (excepto para las abstractas).

## [2016-03-11 10:44] Clase común de Java

```java
class MyClass extends Object {
  public int attr;
  private int prva;
  final int fina;
  static int stca;
  void f () {};
  private void prvf () {};
  final void finf () {};
  static void stcf () {};
}
```

```
// Esto no lo tienen las clases abstractas
MyClass_struct (Struct) {
  Int attr
  Int prva
  Int fina
}

// Esto no lo tienen las clases finales
MyClass_trait (Trait) {
  Function<Void,Int> _get_attr
  Function<Int,Void> _set_attr
  Function<MyClass, Void> f
}

MyClass_f (Function<MyClass_trait, Void>) {}
MyClass_get_attr (Function<MyClass_trait, Void>) {
  _return = _arg.x
}
MyClass_set_attr (Function<MyClass_trait, Void>) {
  _arg.x = _return
}

// Las variables de un módulo son constantes, así que no se puede poner un
// Int puro porque no se podría cambiar. Si se pone una caja, no se puede
// cambiar qué caja se está usando, pero si es mutable, se puede cambiar el
// interior de la caja y lo que contiene.
MyClass_w (Box<Int>) = Box(0)
MyClass_prvf (Function<MyClass_trait, Void>) {}
MyClass_finf (Function<MyClass_trait, Void>) {}
MyClass_stcf (Function<Void, Void>) {}

// Esto no lo tienen las clases abstractas
MyClass_MyClass_impl (Impl) {
  $trait MyClass_trait
  $args MyClass_struct
  _get_attr = MyClass_get_attr
  _set_attr = MyClass_set_attr
  f = MyClass_f
}
```

El problema aquí es que están _MyClass\_struct_, _MyClass\_trait_ y _MyClass_, son tres objetos diferentes para algo que en java es el mismo concepto y el mismo nombre. Y como diferentes lenguajes tienen diferentes esquemas, esto podría ser problemático porque cada lenguaje entonces usaría una convención diferente de nombres.