export class Menu {

  public id: string;
  public name: string;
  public path: string;
  public children: Menu[] = [];

  public selected: boolean;

  public static of(id: string, name: string, path: string, children: Menu[] = [], selected: boolean = false) {
    const menu = new Menu();
    menu.id = id;
    menu.name = name;
    menu.path = path;
    menu.children = children;
    menu.selected = selected;
    return menu;
  }
}
