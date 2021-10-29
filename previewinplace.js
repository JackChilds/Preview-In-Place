class PreviewInPlace {
    constructor(block, options) {
        this.init(block, options);
    }

    init(block, options) {
        let opts = {
            previewGenerator: undefined, // required: the function callback that processes the data and returns the preview HTML. Note: return value is not sanitised in any way and is injected as HTML
            defaultIsPreview: true, // optional: sets 
            classPrefix: '', // optional: prefix that is added before class names such as 'edit'
            editValue: false, // optional: this._edit.value is used by default, unless a function reference is specified
            loadDefaultCSS: true // optional: minimal css file that places the .edit and .preview elements on top of each other. Recommended to leave as true
        }

        for (const [key, value] of Object.entries(opts)) {
            options[key] = options[key] === undefined ? opts[key] : options[key];
        }

        console.log(options);

        this._defaultIsPreview = options.defaultIsPreview;
        this._previewGeneratorCallback = options.previewGenerator;
        this._classPrefix = options.classPrefix;
        this._editValue = options.editValue;
        this._loadDefaultCSS = options.loadDefaultCSS;

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
                console.log("adding css")
                var s = document.createElement('style');
                s.textContent = this._defaultCSS;
                s.setAttribute('data-fdsjkekwwriuehiucnjkdseje', '')
                var firstChild = document.head.firstChild;
                document.head.insertBefore(s, firstChild); // insert the style tag as first element to ensure that the default styles can be overwritten without the use of !important
            }
        }
    }

    _blockClicked(event) {
        event.stopPropagation();
        this._block.classList.add(this._classPrefix + 'state-edit');
        this._block.classList.remove(this._classPrefix + 'state-preview');
        this._edit.style.display = 'block';
        this._edit.focus();
        this._preview.style.display = 'none';
        this._isInPreview = false;
    }
    _editBlurred() {
        this._block.classList.remove(this._classPrefix + 'state-edit');
        this._block.classList.add(this._classPrefix + 'state-preview');
        this._edit.style.display = 'none';
        this._preview.innerHTML = this._previewGeneratorCallback(this._getEditValue())
        this._preview.style.display = 'block';
        this._isInPreview = true;
    }
    _getEditValue() {
        if (this._editValue === false) {
            return this._edit.value;
        } else {
            return this._editValue()
        }
    }

    reset() {
        // after the class has been reset, it must be initialised again throught the init() function
        this._block.removeEventListener('click', this._blockClicked)
        this._edit.removeEventListener('blur', this._editBlurred)
        this._block.classList.remove(this._classPrefix + 'state-edit');
        this._block.classList.remove(this._classPrefix + 'state-preview');
        this._isInPreview = undefined;
        this._edit.style.display = 'block'
        this._preview.style.display = 'block'

        this._block = undefined;
        this._edit = undefined;
        this._preview = undefined;
    }

    get editValue() {
        return this._getEditValue()
    }

    get el() {
        return {
            block: this._block,
            edit: this._edit,
            preview: this._preview
        }
    }

    get options() {
        return {
            previewGenerator: this._previewGeneratorCallback,
            defaultIsPreview: this._defaultIsPreview,
            classPrefix: this._classPrefix,
            editValue: this._editValue,
            loadDefaultCSS: this._loadDefaultCSS
        }
    }

}