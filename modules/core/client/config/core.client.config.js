'use strict';

angular.module('core').run(['Menus',
  function (Menus) {
    Menus.addMenuItem('topbar', {
      title: 'Websites',
      state: 'websites',
      roles: ['*']
    });
  }
]);
