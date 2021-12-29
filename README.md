# Preview In Place
A simple plain JS library for building an 'in-place preview'. With inspiration from [Typora](https://typora.io) (the wonderfully minimalistic markdown editor).

**Demo:** [morcreate.net/github/PreviewInPlace/](https://morcreate.net/github/PreviewInPlace/)

## Installation
To install, you can either copy the *previewinplace.js* or *previewinplace.min.js* files into your project or use a cdn:

```html
<script src="dist/previewinplace.min.js"></script>
```

or

```html
<script src="https://cdn.jsdelivr.net/gh/JackChilds/Preview-In-Place@main/dist/previewinplace.min.js"></script>
```



## Usage

The HTML for the in place preview should look something like this:

```html
<div id="idOfElement" class="block">
  <textarea class="edit">Some Text Here</textarea>
  <div class="preview"></div>
</div>
```

A div container with class 'block', with 2 child elements with class names 'edit' and 'preview'. **Note:** if you are using class prefixes you will need to change the class names.

### Basic Setup

For a complete file, see the *demo/index.html*.

```js
// get element:
var el = document.querySelector('#idOfElement')
// function to process the user's data, e.g. you could convert markdown to HTML here:
function processData(data) {
  return data.toUpperCase() // do something with the data here
}
// initialise the class:
var example = new PreviewInPlace(el, {
  // options
  previewGenerator: processData // reference to the function that processes the data
})
```

### Options

| Property           | Info                                                         |
| ------------------ | ------------------------------------------------------------ |
| *previewGenerator* | **Required:** function reference that processes the data and returns the HTML content for the preview element. **Note:** if *sanitisePreview* is `false`, return value is not sanitised and is injected as HTML. |
| *defaultIsPreview* | **Optional:** if true then the 'preview' mode is the default, if false then the 'edit' mode is the default. **Default**: `true` |
| *classPrefix*      | **Optional:** the prefix that is added in front of class references. **Default:**`''` (no prefix) |
| *editValue*        | **Optional:** function reference that gets the value of the user's input and returns a string. If not specified (or false) then the `.value` property of the element with the class 'edit' is used (which works with textareas and input tags). **Default:** `false` |
| *loadDefaultCSS*   | **Optional:** if true then the default CSS will be injected into the `<head>` tag of the page. The default CSS file ensures that the *edit* and *preview* elements are aligned on top of each other, for more details, see the default css below this table. **Default:** `true` |
| *sanitisePreview*  | **Optional:** if true then data returned from the previewGenerator function will be sanitised through the use of *DOMElement.textContent* instead of *DOMElement.innerHTML*. **Default:** `true` (recommended to prevent HTML injection attacks) |
| *events.onPreview* | **Optional:** function reference that gets called when the *block* enters preview mode. **Default:**`undefined` |
| *events.onEdit*    | **Optional:** function reference that gets called when the *block* enters edit mode. **Default:**`undefined` |

#### Default CSS

A tiny bit of CSS that is injected into the `<head>` tag of the page to ensure that the *block* displays correctly with the *edit* and *preview* elements on top of each other. **Note:** the CSS is automatically changed when you are using class prefixes.

```css
.block {
    position: relative;
    display: grid
}

.block .edit,
.block .preview {
    grid-column: 1;
    grid-row: 1
}
```

### Class Methods

| Method                  | Info                                                         |
| ----------------------- | ------------------------------------------------------------ |
| init (element, options) | The same method as the constructor, useful if you want to re-initialise the class with different settings at a later point. |
| mode                    | *Get* : the current *mode* the element is in. Either `preview`or `edit`. <br>*Set* :  the mode the element is in. Use either `preview `  or `edit`. |
| toggleMode()            | Toggles the *block* between `preview` and `edit`.            |
| editVal                 | *Get* :  the value of the edit element.                      |
| previewVal              | *Get* :  the value of the preview element as a HTML string.  |
| el                      | *Get* :  the *block* element, *edit* element and *preview* element as a dictionary. <br> `{block : blockElement, edit : editElement, preview: previewElement}` |

### Examples

#### Class Prefixes

HTML:

```html
<div class="prefix-block">
  <textarea class="prefix-edit">Some Text</textarea>
  <div class="prefix-preview"></div>
</div>
```

JS:

```js
...
new PreviewInPlace (el, {
  previewGenerator: processData,
  classPrefix: 'prefix-'
})
...
```

#### Getting the value of the editor manually

HTML:

```html
<div class="block">
  <textarea class="edit" id="editor-id">Some Text</textarea>
  <div class="preview"></div>
</div>
```

JS:

```js
...
function getEditValue() {
  return document.querySelector('#editor-id').value
}

new PreviewInPlace(el, {
  previewGenerator: processInput,
  editValue: getEditValue
})
...
```

#### Events

HTML:

```html
<div class="block">
  <textarea class="edit">Some Text Here</textarea>
  <div class="preview"></div>
</div>
```

JS:

```js
...
function previewMode() {
  console.log("Preview mode")
}
function editMode() {
  console.log("Edit mode")
}

new PreviewInPlace(el, {
  previewGenerator: processInput,
  events: {
    onPreview: previewMode,
    onEdit: editMode
  }
})
...
```

#### Toggle Mode

HTML:

```html
<div class="block">
  <textarea class="edit">Some Text Here</textarea>
  <div class="preview"></div>
</div>
<button onclick="toggleMode()">Toggle Mode</button>
```

JS:

```js
...
var example = new PreviewInPlace(el, {
  previewGenerator: processInput,
})

function toggleMode() {
  example.toggleMode()
}
...
```

### Styling

You can style the *block* differently in CSS depending on which mode it is in by using the `state-preview` and `state-edit` classes that are added to the *block* when in the preview mode and edit mode, respectively. **Note:** if using class prefixes then you will have to change class names in your css.

An example of some basic CSS used to style the *block* depending on which mode it is in (taken from the demo file):

```css
/* Some basic styling of the 'block' and the 'edit' and 'preview' elements  */
.block {
  width: 200px;
}
.block .edit {
  border: none;
  outline: none;
  border-radius: 0;
  resize: none;
}
.block .edit, .block .preview {
  padding: 8px;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 16px;
}

/* Make the 'block' have a red background when in edit mode */
.block.state-edit .edit {
  background-color: rgba(131, 0, 0, 0.3);
}
/* Make the 'block' have a green background when in preview mode */
.block.state-preview .preview {
  background-color: rgba(9, 174, 0, 0.3);
}
```

