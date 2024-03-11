import { UnixTimestampPipe } from './unix-timestamp.pipe';

describe('UnixTimestampPipe', () => {
  it('create an instance', () => {
    const pipe = new UnixTimestampPipe();
    expect(pipe).toBeTruthy();
  });
});
