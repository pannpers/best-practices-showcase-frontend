export class StringifyValueConverter {
  toView(value): string {
    return JSON.stringify(value)
  }
}
