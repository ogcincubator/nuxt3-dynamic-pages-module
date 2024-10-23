export interface TocItem {
  label: string,
  id: string,
  element: Element,
  children?: Array<TocItem>,
}
