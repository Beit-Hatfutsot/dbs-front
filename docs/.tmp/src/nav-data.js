angular.module('docApp').value('DOCS_NAVIGATION', {
  "guide": {
    "id": "guide",
    "name": "Guide",
    "navGroups": [
      {
        "name": "Guide",
        "type": "groups",
        "href": "guide",
        "navItems": [
          {
            "name": "howToUse",
            "type": "",
            "href": "guide/howToUse"
          }
        ]
      }
    ]
  },
  "api": {
    "id": "api",
    "name": "API",
    "navGroups": [
      {
        "name": "apiClient",
        "type": "groups",
        "href": "api/apiClient",
        "navItems": [
          {
            "name": "service",
            "type": "section",
            "href": "api/apiClient/service"
          },
          {
            "name": "apiClient",
            "type": "service",
            "href": "api/apiClient/service/apiClient"
          }
        ]
      },
      {
        "name": "auth",
        "type": "groups",
        "href": "api/auth",
        "navItems": [
          {
            "name": "object",
            "type": "section",
            "href": "api/auth/object"
          },
          {
            "name": "auth.controller:AuthCtrl",
            "type": "object",
            "href": "api/auth/object/auth.controller:AuthCtrl"
          },
          {
            "name": "auth.controller:AuthPrivateController",
            "type": "object",
            "href": "api/auth/object/auth.controller:AuthPrivateController"
          },
          {
            "name": "directive",
            "type": "section",
            "href": "api/auth/directive"
          },
          {
            "name": "authPrivate",
            "type": "directive",
            "href": "api/auth/directive/authPrivate"
          },
          {
            "name": "service",
            "type": "section",
            "href": "api/auth/service"
          },
          {
            "name": "auth",
            "type": "service",
            "href": "api/auth/service/auth"
          },
          {
            "name": "authInterceptor",
            "type": "service",
            "href": "api/auth/service/authInterceptor"
          },
          {
            "name": "user",
            "type": "service",
            "href": "api/auth/service/user"
          },
          {
            "name": "function",
            "type": "section",
            "href": "api/auth/function"
          },
          {
            "name": "is_api_url",
            "type": "function",
            "href": "api/auth/function/is_api_url"
          }
        ]
      },
      {
        "name": "cache",
        "type": "groups",
        "href": "api/cache",
        "navItems": [
          {
            "name": "object",
            "type": "section",
            "href": "api/cache/object"
          },
          {
            "name": "cached_items",
            "type": "object",
            "href": "api/cache/object/cached_items"
          },
          {
            "name": "service",
            "type": "section",
            "href": "api/cache/service"
          },
          {
            "name": "cache",
            "type": "service",
            "href": "api/cache/service/cache"
          }
        ]
      },
      {
        "name": "gedcomParser",
        "type": "groups",
        "href": "api/gedcomParser",
        "navItems": [
          {
            "name": "service",
            "type": "section",
            "href": "api/gedcomParser/service"
          },
          {
            "name": "gedcomParser",
            "type": "service",
            "href": "api/gedcomParser/service/gedcomParser"
          }
        ]
      },
      {
        "name": "lang",
        "type": "groups",
        "href": "api/lang",
        "navItems": [
          {
            "name": "directive",
            "type": "section",
            "href": "api/lang/directive"
          },
          {
            "name": "en",
            "type": "directive",
            "href": "api/lang/directive/en"
          },
          {
            "name": "he",
            "type": "directive",
            "href": "api/lang/directive/he"
          },
          {
            "name": "service",
            "type": "section",
            "href": "api/lang/service"
          },
          {
            "name": "langManager",
            "type": "service",
            "href": "api/lang/service/langManager"
          }
        ]
      },
      {
        "name": "main",
        "type": "groups",
        "href": "api/main",
        "navItems": [
          {
            "name": "object",
            "type": "section",
            "href": "api/main/object"
          },
          {
            "name": "main.controller:StartController",
            "type": "object",
            "href": "api/main/object/main.controller:StartController"
          },
          {
            "name": "main.controller:WizardFormCtrl",
            "type": "object",
            "href": "api/main/object/main.controller:WizardFormCtrl"
          },
          {
            "name": "directive",
            "type": "section",
            "href": "api/main/directive"
          },
          {
            "name": "icon",
            "type": "directive",
            "href": "api/main/directive/icon"
          },
          {
            "name": "service",
            "type": "section",
            "href": "api/main/service"
          },
          {
            "name": "suggest",
            "type": "service",
            "href": "api/main/service/suggest"
          },
          {
            "name": "wizard",
            "type": "service",
            "href": "api/main/service/wizard"
          }
        ]
      },
      {
        "name": "rc_submit",
        "type": "groups",
        "href": "api/rc_submit",
        "navItems": [
          {
            "name": "directive",
            "type": "section",
            "href": "api/rc_submit/directive"
          },
          {
            "name": "ng.directive:rcSubmit",
            "type": "directive",
            "href": "api/rc_submit/directive/ng.directive:rcSubmit"
          }
        ]
      },
      {
        "name": "config",
        "type": "groups",
        "href": "api/config",
        "navItems": [
          {
            "name": "service",
            "type": "section",
            "href": "api/config/service"
          },
          {
            "name": "apiConfig",
            "type": "service",
            "href": "api/config/service/apiConfig"
          }
        ]
      }
    ]
  }
});
