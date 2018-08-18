# valory-adaptor-claudia
**Provide claudia-api-builder support for Valory**
## Usage
```bash
npm i valory-apaptor-claudia
```
Instantiate FastifyAdaptor and pass it to Valory
```typescript
import {ClaudiaAdaptor} from "valory-adaptor-claudia";
import {Valory} from "valory-runtime";

const app = Valory.createInstance({
    info: {title: "some api"},
    server: new ClaudiaAdaptor(),
})

// make sure to export the server for claudia
export = app.start();
```