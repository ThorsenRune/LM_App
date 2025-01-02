/*	File: slider.js
	This is a class of sliders using styled input elements
*/
"use strict";
document.addEventListener("DOMContentLoaded", () => {
    initAndSetupTheSliders();
});

class Slider {
    static instances = []; // Static property to hold all instances
    bUserInput=false
    /*  CALLBACKS */
    onInput(callback) {     //User has edited
        this.Disp2Value = callback;
    }
    onFocus(callback){      //Got focus
        this.OnFocusCallback=callback
    }
    jFocus(input) {
            this.bUserInput=false
            if(this.OnFocusCallback){
                this.OnFocusCallback(input)
            }
        }

    constructor(element) {
        this.input = element;
        this._container=element.parentElement       /*  THE WIDGET BOX*/
        this._label=element.parentElement.querySelector('label')
        this.callback = null;
        this.input.addEventListener('input', () => this.updateSlider(true));
        this.input.addEventListener('change', () => this.updateSlider(true));
        this.input.addEventListener('touchstart', () => this.jFocus(this.input), { passive: true });
        this.input.addEventListener('focus', () => this.jFocus(this.input));
        this.input.value = Slider.instances.length * 10; // Initial value
        this.input.range = [0, 100]; // Default range
        this.input.unit = '%'; // Default unit
        this.input.label = 'name';
        this.updateSlider();
        Slider.instances.push(this); // Add the instance to the static array
    }

    id() {
        return this.input.parentElement.id;
    }

    getValue() {
        return Number(this.input.value);
    }

    setValue(val) {
        if (typeof val !== 'number') debugger;
        if (Number(this.input.value) === val) return; // No change
        this.input.value = val;
        this.updateSlider();
    }

    setRange(range, unit, label) {
        this.input.min = range[0];
        this.input.max = range[1];
        this.input.unit = unit;
        this.input.label = label;
        if(this._label)   this._label.innerHTML=label   //Show a label on the slider
        this.updateSlider();
    }

	updateSlider(bUserInput ) {
		    const elInput = this.input;
		    const min = Number(elInput.min);
		    const max = Number(elInput.max);
		    const value = Number(elInput.value);
		    
		    // Normalize value between 0 and 1
		    const relval = (value - min) / (max - min);
		    
		    if (bUserInput) {
		       // elInput.rawval = relval * (max - min) + min;
                this.bUserInput = true;
		    }
		    
		    const elSlider = elInput.parentElement;
		    const $thumb = elSlider.querySelector('.range-slider__thumb');
		    const $bar = elSlider.querySelector('.range-slider__bar');
		    
		    const pct = relval * 100; // Calculate percentage for the slider value
		    const thumbHeight = $thumb.clientHeight;
		    
		    // Update the thumb position
		    $thumb.style.bottom = `calc(${pct}% - ${thumbHeight / 2}px)`;
		    // Update the bar height
		    $bar.style.height = `${pct}%`;
		    
		    // Update the thumb text content
		    $thumb.textContent = `${elInput.value}${elInput.unit}`;
		    
		    // Call the registered callback if it exists
		    if (bUserInput&&this.onInput) {
		        this.Disp2Value(elInput.value);
		    }
		}


    static getAllSliders() {
        return Slider.instances;
    }
}

function initAndSetupTheSliders() {
    const inputs = [].slice.call(
        document.querySelectorAll('.range-slider input'));
    inputs.forEach(input => {
        new Slider(input);
    });
}

 
