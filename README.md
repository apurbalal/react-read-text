## react-read-text
Reads the text content of the given document id. Here's an example, open and click on "Start reading": [https://react-read-text.vercel.app/](https://react-read-text.vercel.app/)

## Feature highlight
<video autoplay loop style="height: auto; position:absolute; z-index: -1;" src="https://github.com/apurbalal/react-read-text/assets/9425881/08787e93-12a7-4b3f-99d5-7a083f7dd011"></video>

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
    excludeChildIds: ["qset-code-block"],
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
You can customize the style of reading word by css classname `reading-word`. Add it to your style sheet and add styles to it.

## Example
View the example code inside `/example` folder.
