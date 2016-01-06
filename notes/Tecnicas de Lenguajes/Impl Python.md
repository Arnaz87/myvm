# Implementación Python

    // Simplemente un array asociativo.
    class Object {
      struct {string key; Object *value} *data; // un array externo
      Object *get (string q) {/* Implementación mágica... */};
      void set (string nk, Object *val) {/* Implementación mágica... */};
    }