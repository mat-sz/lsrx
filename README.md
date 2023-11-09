# lsrx

Local Storage helper.

## Usage

```ts
import lsrx from 'lsrx';

const ls = lsrx();
const item = ls.use('ls_key');

console.log(item.current);
item.current = 'test';

item.subscribe((oldValue, newValue) => console.log(oldValue, newValue));
```
