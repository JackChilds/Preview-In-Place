class PreviewInPlace {
    constructor (block, options) {
        this.init(block, options);
    }

    init (block, options) {
        // useful to re-initialise the class after it has been reset
        this._block = block;
        this._edit = block.querySelector('.edit');
        this._preview = block.querySelector('.preview');
        this._defaultIsPreview = options.defaultIsPreview;
        this.previewGeneratorCallback = options.previewGeneratorCallback; // function reference that returns the html code for the preview
        if (this._defaultIsPreview) {
            this._block.classList.remove('state-edit');
            this._block.classList.add('state-preview');
            this._isInPreview = true;
            this._edit.style.display = 'none'
            this._preview.style.display = 'block'
            this._preview.innerHTML = this.previewGeneratorCallback(this._edit.value)
        } else {
            this._block.classList.add('state-edit');
            this._block.classList.remove('state-preview');
            this._isInPreview = true;
            this._edit.style.display = 'block'
            this._edit.focus();
            this._preview.style.display = 'none'
        }

        this._block.addEventListener("click", (event) => {
            this._blockClicked(event)
        })

        this._edit.addEventListener("blur", () => {
            this._editBlurred()
        })

    }

    _blockClicked(event) {
        event.stopPropagation();
        this._block.classList.add('state-edit');
        this._block.classList.remove('state-preview');
        this._edit.style.display = 'block';
        this._edit.focus();
        this._preview.style.display = 'none';
        this._isInPreview = false;
    }
    _editBlurred() {
        this._block.classList.remove('state-edit');
        this._block.classList.add('state-preview');
        this._edit.style.display = 'none';
        this._preview.innerHTML = this.previewGeneratorCallback(this._edit.value)
        this._preview.style.display = 'block';
        this._isInPreview = true;
    }
    reset() {
        // after the class has been reset, it must be initialised again throught the init() function
        this._block.removeEventListener('click', this._blockClicked)
        this._edit.removeEventListener('blur', this._editBlurred)
        this._block.classList.remove('state-edit');
        this._block.classList.remove('state-preview');
        this._isInPreview = undefined;
        this._edit.style.display = 'block'
        this._preview.style.display = 'block'

        this._block = undefined;
        this._edit = undefined;
        this._preview = undefined;
    }

    get el() {
        return {
            block: this._block,
            edit: this._edit,
            preview: this._preview
        }
    }
    
}