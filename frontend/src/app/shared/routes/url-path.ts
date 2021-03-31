export namespace UrlPath {

  export class APP {
    public static ROUTE = {
      ROOT: ''
    };
    public static ROOT = '';
  }
  export class HOME {
    public static ROUTE = {
      ROOT: 'home',
      INTEREST_ADD: 'interest/add',
      INTEREST_EDIT: 'interest/edit',
    };
    public static INTEREST_ADD = '/' + APP.ROUTE.ROOT + '/' + HOME.ROUTE.ROOT + '/' + HOME.ROUTE.INTEREST_ADD;
    public static INTEREST_EDIT = '/' + APP.ROUTE.ROOT + '/' + HOME.ROUTE.ROOT + '/' + HOME.ROUTE.INTEREST_EDIT;
    public Home = `${HOME.ROUTE.ROOT}`;
  }
  export class WELCOME {
    public static ROUTE = {
      ROOT: 'welcome'
    };
    public Welcome = `${WELCOME.ROUTE.ROOT}`;
  }
  export class RISK {
    public static ROUTE = {
      RISK_DEGREE_DETAIL: 'risk-degree/:id'
    }
  }
  export class SERVICE_INTRODUCE {
    public static ROUTE = {
      ROOT: 'service-introduce'
    }
  }
  export class NOTICE {
    public static ROUTE = {
      ROOT: 'notice'
    }
  }
  export class MAP {
    public static ROUTE = {
      ROOT: 'map'
    }
  }
}
