angular.module('config', []).
    constant('apiConfig', {
        baseUrl:        '@@baseUrl',
        auth:           '@@auth',
        user:           '@@user', 
        mjs:            '@@mjs', 
        wizard_search:  '@@wizard_search',
        item:           '@@item',
        suggest:        '@@suggest',
        ftrees_search:  '@@ftrees_search',
        ftrees_get:     '@@ftrees_get',
        upload:         '@@upload'
    });
