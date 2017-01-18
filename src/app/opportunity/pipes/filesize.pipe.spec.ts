import { FilesizePipe } from './filesize.pipe';

describe('FilesizePipe', () => {
  let pipe = new FilesizePipe();

  // Follow SI prefixes with decimal filesizes (1000 B = 1 kB)
  it('follows SI prefixes', () => {
    expect(pipe.transform(1000)).toBe('1 kB'); //10^3 -> k (lowercase)
    expect(pipe.transform(1000000)).toBe('1 MB'); //10^6 -> M
    expect(pipe.transform(999000000)).toBe('999 MB');
    expect(pipe.transform(1000000000)).toBe('1 GB'); //10^9 -> G
    expect(pipe.transform(1000000000000)).toBe('1 TB'); //10^12 -> T
  });

  // Any size under 1 kB should show as <1 kB
  it('shows <1 kB if under 1 kB', () => {
    expect(pipe.transform(-100)).toBe('<1 kB'); //negative and 0 filesizes included
    expect(pipe.transform(0)).toBe('<1 kB');
    expect(pipe.transform(1)).toBe('<1 kB');
    expect(pipe.transform(387)).toBe('<1 kB');
    expect(pipe.transform(501)).toBe('<1 kB');
    expect(pipe.transform(999.99999)).toBe('<1 kB'); //filesizes <1 kB should never get rounded up to 1 kB
  });

  it('rounds correctly', () => {
    expect(pipe.transform(2499)).toBe('2 kB'); //only round to the one's digit
    expect(pipe.transform(2500)).toBe('3 kB'); //round 5+ up
    expect(pipe.transform(2800)).toBe('3 kB');
    expect(pipe.transform(2400)).toBe('2 kB'); //round 4- down
    expect(pipe.transform(2100)).toBe('2 kB');
  });
});
