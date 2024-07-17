## react-read-text
Audibly reads the text content of the given parent dom and its child nodes. Here's an example, open and click on "Start reading": [https://react-read-text.vercel.app/](https://react-read-text.vercel.app/)

## Feature highlight
<video autoplay loop style="height: auto; position:absolute; z-index: -1;" src="https://github.com/user-attachments/assets/00ee1266-5e74-4f69-9aee-fc733c5005a0"></video>

## How to use it
#### Install
```bash
yarn add react-read-text
```
#### Then
```javascript
  const {
    reading,
    readingId,
    handleReading,
    handleStopReading,
    available,
  } = useTextReading({
    excludeChildIds: ["code-block"],
  });
```
| prop | Type | Meanining |
| --- | --- | --- |
| reading | Boolean | If it's currently reading a text |
| readingId | String | Document id which you passed |
| handleReading | (id: String) => void | Pass the Document id you want to read |
| handleStopReading | () => void | Stop reading |
| available | Boolean | Reading is supported or not in the device |

#### Style
You can customize the style of reading word by css classname `reading-word`. Add it to your style sheet and add custom styles to it.

## Example
View the example code inside `/example` folder.
