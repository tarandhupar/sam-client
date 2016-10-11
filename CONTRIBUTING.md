## Design

Each module is written in a [self-documenting](https://en.wikipedia.org/wiki/Self-documenting_code) fashion as much as possible. This means sometimes extracting the logic of a conditional to a method to increase human readability.


```
if (this.hasSelected(config)) {
  
}

hasSelected = function(config) {
  return (config.selected !== undefined && config.selected.length > 0);
}
```

Instead of:

```
if (config.selected !== undefined && config.selected.length > 0) {
  
}
```

## Coding standards

|Name                |Style                          |Example           |
|:-------------------|:-----------------------------:|:----------------:|
|Class names         |TitleCased                     |Select = {}       |
|Function definitions|camelCased                     |isRequired(config)|
|Variable names      |camelCased and self documenting|isRequired = true; <br> NOT i = true;|
|Configuration JSON member names|camelCased and self documenting|srOnly: true <br> NOT sr-only: true <br> NOT s: true|
|Tabs & spaces       |Follow the provided linter and provided .editorconfig|n/a |

## Doc-blocks

...

## Test coverage

...