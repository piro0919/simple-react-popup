# simple-react-popup

simple-react-popup makes it easy to pop up the react component.

## Example

[CodeSandbox](https://codesandbox.io/s/w67j900w8l)

## Description

```bash
import React from 'react';
import SimpleReactPopup from 'simple-react-popup';

class Sample extends React.Component {
  render() {
    const popupContents = (
      <div>
        hello world!
      </div>
    );

    return (
      <SimpleReactPopup contents={popupContents}>
        popup target
      </SimpleReactPopup>
    );
  }
}

export default Sample;
```

## Options

```bash
interface Props {
  // Popup Target
  children: React.ReactNode;
  // Add Parent Dom Of Popup Target
  className?: string;
  // Popup Contents
  contents: JSX.Element;
  // Transition Duration (defined in milliseconds)
  transition?: number;
}
```

## Remaining Task

- Can apply styles from options.
- Not use jquery.

## Author

[piro](https://github.com/piro0919)
