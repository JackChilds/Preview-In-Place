class PreviewInPlace {
    constructor(block, options) {
        this.init(block, options);
    }

    init(block, options) {
        let opts = {
            previewGenerator: undefined, // required: the function callback that processes the data and returns the preview HTML. Note: return value is not sanitised in any way and is injected as HTML
            defaultIsPreview: true, // optional: sets default mode
            classPrefix: '', // optional: prefix that is added before class names such as 'edit'
            editValue: false, // optional: this._edit.value is used by default, unless a function reference is specified
            loadDefaultCSS: true, // optional: minimal css file that places the .edit and .preview elements on top of each other. Recommended to leave as true
            events: { // optional:
                onPreview: undefined, // this function is called when the element is in preview mode
                onEdit: undefined // this function is called when the element is in edit mode
            }
        }

        for (const [key, value] of Object.entries(opts)) {
            options[key] = options[key] === undefined ? value : options[key];
        }

        this._defaultIsPreview = options.defaultIsPreview;
        this._previewGeneratorCallback = options.previewGenerator;
        this._classPrefix = options.classPrefix;
        this._editValue = options.editValue;
        this._loadDefaultCSS = options.loadDefaultCSS;
        this._events = options.events;

        this._defaultCSS = '.' + this._classPrefix + 'block{position:relative;display:grid}.' + this._classPrefix + 'block .' + this._classPrefix + 'edit,.' + this._classPrefix + 'block .' + this._classPrefix + 'preview{grid-column:1;grid-row:1}';
        this._injectDefaultCSS();

        this._block = block;
        this._edit = block.querySelector('.' + this._classPrefix + 'edit');
        this._preview = block.querySelector('.' + this._classPrefix + 'preview');

        if (this._defaultIsPreview) {
            this._editBlurred();
        } else {
            this._blockClicked();
        }

        this._block.addEventListener("click", (event) => {
            this._blockClicked(event)
        })

        this._edit.addEventListener("blur", () => {
            this._editBlurred()
        })

    }

    _injectDefaultCSS() {
        if (this._loadDefaultCSS) {
            // check if css has already been injected by a previous class instance
            var styleTag = document.head.querySelector('[data-fdsjkekwwriuehiucnjkdseje]'); // the attribute that is added to the style tag containing the default css when it is created with no relevance to anything but an attribute that won't get in the way of the application
            if (styleTag == null) {
                var s = document.createElement('style');
                s.textContent = this._defaultCSS;
                s.setAttribute('data-fdsjkekwwriuehiucnjkdseje', '')
                var firstChild = document.head.firstChild;
                document.head.insertBefore(s, firstChild); // insert the style tag as first element to ensure that the default styles can be overwritten without the use of !important
            }
        }
    }

    _blockClicked(event = undefined) {
        if (event !== undefined) {
            event.stopPropagation();
        }
        if (this._events.onEdit !== undefined) {
            this._events.onEdit();
        }
        this._block.classList.add(this._classPrefix + 'state-edit');
        this._block.classList.remove(this._classPrefix + 'state-preview');
        this._edit.style.display = 'block';
        this._edit.focus();
        this._preview.style.display = 'none';
        this._isInPreview = false;
    }
    _editBlurred() {
        if (this._events.onPreview !== undefined) {
            this._events.onPreview();
        }
        this._block.classList.remove(this._classPrefix + 'state-edit');
        this._block.classList.add(this._classPrefix + 'state-preview');
        this._edit.style.display = 'none';
        this._preview.innerHTML = this._previewGeneratorCallback(this._getEditValue())
        this._preview.style.display = 'block';
        this._isInPreview = true;
    }
    _getEditValue() {
        if (this._editValue === false || this._editValue === undefined) {
            return this._edit.value;
        } else {
            return this._editValue()
        }
    }

    set mode(mode) {
        if (mode.toLowerCase() === 'edit') {
            this._blockClicked();
        } else {
            this._editBlurred();
        }
    }

    get mode() {
        if (this._isInPreview) {
            return 'preview';
        } else {
            return 'edit';
        }
    }

    toggleMode() {
        if (this.mode == 'preview') {
            this.mode = 'edit';
        } else {
            this.mode = 'preview';
        }
    }

    get editVal() {
        return this._getEditValue()
    }

    get previewVal() {
        return this._preview.innerHTML;
    }

    get el() {
        return {
            block: this._block,
            edit: this._edit,
            preview: this._preview
        }
    }
}