import { CapitalizeCamelCasePipe } from './capitalize-camel-case.pipe';

describe('CapitalizeCamelCasePipe', () => {
  it('create an instance', () => {
    const pipe = new CapitalizeCamelCasePipe();
    expect(pipe).toBeTruthy();
  });
});
