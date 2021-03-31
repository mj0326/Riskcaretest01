export class SelectValue<T = any> {

  public label: string;
  public value: T;
  public checked: boolean;

  constructor(label: string, value: T, checked: boolean) {
    this.label = label;
    this.value = value;
    this.checked = checked;
  }
}


export class SelectCategoryValue<T = any> extends SelectValue{
  public category: string;

  constructor(category: string, label: string, value: T, checked: boolean = false) {
    super(label, value, checked)
    this.category = category;
  }
}


