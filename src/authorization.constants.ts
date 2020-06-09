export namespace constants {

  export enum action {

    create = 0,
    count = 1,
    find = 2,
    updateAll = 3,
    findById = 4,
    updateById = 5,
    replaceById = 6,
    deleteById = 7,
    Himself = 0,
    Clientes = 1,
    Admin = 2,
    AccessAuthFeature = 0,
  }

  export enum context {
    cliente = 0,
    articulo = 1,
    factura = 2,
    historial = 3,
    receta = 4,
    categoria = 5,
    manage = 6,
    AccessAuthFeature = 7,
  };

  export const ArrayPermissions: string[][] = [
    ['createTbCliente', 'countTbCliente', 'findTbCliente', 'updateAllTbCliente', 'findByIdTbCliente', 'updateByIdTbCliente', 'replaceByIdTbCliente', 'deleteByIdTbCliente'],
    ['createTbArticulo', 'countTbArticulo', 'findTbArticulo', 'updateAllTbArticulo', 'findByIdTbArticulo', 'updateByIdTbArticulo', 'replaceByIdTbArticulo', 'deleteByIdTbArticulo'],
    ['createTbFactura', 'countTbFactura',
      'findTbFactura',
      'updateAllTbFactura',
      'findByIdTbFactura',
      'updateByIdTbFactura',
      'replaceByIdTbFactura',
      'deleteByIdTbFactura'
    ],
    ['createTbHistorial',
      'countTbHistorial',
      'findTbHistorial',
      'updateAllTbHistorial',
      'findByIdTbHistorial',
      'updateByIdTbHistorial',
      'replaceByIdTbHistorial',
      'deleteByIdTbHistorial'
    ],
    ['createTbReceta',
      'countTbReceta',
      'findTbReceta',
      'updateAllTbReceta',
      'findByIdTbReceta',
      'updateByIdTbReceta',
      'replaceByIdTbReceta',
      'deleteByIdTbReceta'
    ],
    ['createTbCategoria',
      'countTbCategoria',
      'findTbCategoria',
      'updateAllTbCategoria',
      'findByIdTbCategoria',
      'updateByIdTbCategoria',
      'replaceByIdTbCategoria',
      'deleteByIdTbCategoria'
    ],
    ['manageHimself',
      'manageClientes',
      'manageAdmin'
    ],
    ['AccessAuthFeature']
  ];

}
