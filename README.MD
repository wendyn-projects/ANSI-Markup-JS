#ANSI Markup
## Instalation
```bash
npm install ansi-text
```
## Usage
```js
import { ANSI } from 'ansi-text'

console.log(ANSI('<fg:gray>#Hello World!</fg>'));
```
Result:
```diff
#Hello World!
```
## Markup Examples
```xml
<fg:green>Server is <bold>ready</bold></fg>
```
```xml
<fg:yellow><bold>User</bold>:</fg:yellow> some message from the user
```
