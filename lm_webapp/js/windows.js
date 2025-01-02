/*	file:windows.js
	Makes elements of class 'window' movable and resizable
    classes: 'title-bar' close-btn' 'resizer'
    Methods assigned in registerWindow()
    toggleWindowState() minimize/restore window size
//document.addEventListener("DOMContentLoaded", jWindows.windows_init);
*/ 
const useRight=true

function WindowsFunctions(){
    let highestZIndex = 1;
    let activeWindow=null;
    function windows_init() {
        const dropdown = document.getElementById('idWindowSelector');
        const windows = document.querySelectorAll('.clsWindow'); // Define windows before use

        windows.forEach((thisWindow, index) => {
            FormatWindow(thisWindow);
            registerWindow(thisWindow);
            var title = thisWindow.querySelector('.title-bar').textContent;
            thisWindow.title = title.trim();
            thisWindow.minimized=function(){
                return thisWindow.classList.contains('minimized')
            }

            const option = document.createElement('option');
            option.value = index;
            option.textContent = title;
            if (dropdown) AddWindowSelector(dropdown,option)
        });
        function AddWindowSelector(dropdown,option){
        // Function to handle dropdown change event
            dropdown.appendChild(option);
            dropdown.onclick=function(event){
                // Get the selected index
                const selectedIndex = event.target.value;
                // Focus the selected window if a valid option is selected
                if (selectedIndex !== "") {
                    top.w=windows[selectedIndex]
                    jWindows.makeWindowActive(w)
                    w.classList.remove('minimized')
                    delete w.passive
                }
            }
        }
    }
    function makeWindowActive(window) {
        if (window.offsetTop < 0) window.style.top = "0px";
        highestZIndex = Number(highestZIndex) + 1;
        window.style.zIndex = highestZIndex;
        window.scrollIntoView({ behavior: "smooth", block: "center" });
        activeWindow = window;
         event.stopPropagation();   //Make sure it does not bubble up to other windows
    }
    return {
        activeWindow:activeWindow,
        windows_init:windows_init,
        makeWindowActive:makeWindowActive,
        getActiveWindow:function(){return activeWindow}
    }
}
jWindows=WindowsFunctions();






function registerWindow(window) {
	PersistPosition(window,'clsWindow');
    enableArrowKeyMovement(window)
            window.addEventListener('mousedown', () => jWindows.makeWindowActive(window));
            window.addEventListener('touchstart', () => jWindows.makeWindowActive(window));

            const titleBar = window.querySelector('.title-bar');
            if(titleBar){            
	            titleBar.addEventListener('mousedown', mMoveWindow);
	            titleBar.addEventListener('touchstart', dragTouchStart);
            }

            const resizer = window.querySelector('.resizer');
            if(resizer){
            	resizer.addEventListener('mousedown', initResize);
            	resizer.addEventListener('touchstart', initResizeTouch);
            }

            function mMoveWindow(e) { //Moves the window
                e.preventDefault();
                e.stopPropagation();
                document.activeElement.blur();

                let pos3 = e.clientX;
                let pos4 = e.clientY;

                document.onmouseup = closeDragElement;
                document.onmousemove = elementDrag;

                function elementDrag(e) {
 
                    e.preventDefault();
                                        e.stopPropagation();

                    const pos1 = pos3 - e.clientX;
                    const pos2 = pos4 - e.clientY;
                    pos3 = e.clientX;
                    pos4 = e.clientY;

                    window.style.top = (window.offsetTop - pos2) + "px";
                    window.style.left = (window.offsetLeft - pos1) + "px";
                }

                function closeDragElement() {
                    document.onmouseup = null;
                    document.onmousemove = null;
                }
            }

            function dragTouchStart(e) {
                document.activeElement.blur();
                const touch = e.touches[0];
                let pos3 = touch.clientX;
                let pos4 = touch.clientY;

                document.ontouchend = closeDragElement;
                document.ontouchmove = elementDrag;

                function elementDrag(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    const touch = e.touches[0];
                    const pos1 = pos3 - touch.clientX;
                    const pos2 = pos4 - touch.clientY;
                    pos3 = touch.clientX;
                    pos4 = touch.clientY;

                    window.style.top = (window.offsetTop - pos2) + "px";
                    window.style.left = (window.offsetLeft - pos1) + "px";
                }

                function closeDragElement() {
                    document.ontouchend = null;
                    document.ontouchmove = null;
                }
            }

            function initResize(e) {
                e.preventDefault();
                e.stopPropagation();
    
                document.onmousemove = doResize;
                document.onmouseup = stopResize;

                function doResize(e) {
                    e.preventDefault();
                                e.stopPropagation();
    
                    WindowPlace (window,null,null,e.clientX,e.clientY)
//                    window.style.width = (e.clientX - window.offsetLeft) + 'px';
 //                   window.style.height = (e.clientY - window.offsetTop) + 'px';
                }

                function stopResize() {
                    document.onmousemove = null;
                    document.onmouseup = null;
                }
            }

            function initResizeTouch(e) {
                e.preventDefault();
                            e.stopPropagation();
    
                const touch = e.touches[0];
                document.ontouchmove = doResizeTouch;
                document.ontouchend = stopResizeTouch;

                function doResizeTouch(e) {
                    e.preventDefault();
                                e.stopPropagation();
    
                    const touch = e.touches[0];
                    WindowPlace (window,null,null,touch.clientX,touch.clientY)
//                    window.style.width = (touch.clientX - window.offsetLeft) + 'px';
//                    window.style.height = (touch.clientY - window.offsetTop) + 'px';
                }

                function stopResizeTouch() {
                    document.ontouchmove = null;
                    document.ontouchend = null;
                }
            }
    return titleBar
}

function FormatWindow(element) {
    // Check if the element has the class 'window'
    if (!element.classList.contains('clsWindow')) {
        console.error('The provided element does not have the class "clsWindow".');
        return;
    }
    
    // Function to ensure element with className exists, otherwise create it
    function ensureElement(className, textContent = '',type) {
        let existingEl = element.getElementsByClassName(className)[0];
        if (existingEl) return existingEl;
        if (!type) type='div'
        let newEl = document.createElement(type);
        newEl.className = className;
        newEl.textContent = textContent;
        return newEl;
    }

    // Create the title bar
    let titleBar = ensureElement('title-bar');
    element.prepend(titleBar);

    let title = ensureElement('title', 'Some Window Title' );
    titleBar.prepend(title);

    //let closeBtn = ensureElement('close-btn', '🗗'); // Using the correct multiplication sign for close button
    let closeBtn = ensureElement('close-btn', '','button'); // Using the correct multiplication sign for close button
    closeBtn.onclick = function() {
        toggleWindowState(this);
    };
    titleBar.append(closeBtn);

    // Create the resizer
    let resizer = ensureElement('resizer');
    element.append(resizer);
}

    function tileWindows() {
            const windows = Array.from(document.querySelectorAll('.clsWindow')).filter(window => window.checkVisibility());

            const numWindows = windows.length;
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;
            const cols = Math.ceil(Math.sqrt(numWindows));
            const rows = Math.ceil(numWindows / cols);
            const windowWidth = screenWidth / cols;
            const windowHeight = screenHeight / rows;

            let index = 0;
            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    if (index >= numWindows) break;
                    const window = windows[index];
                    window.style.width = windowWidth + 'px';
                    window.style.height = windowHeight + 'px';
                    window.style.top = (100+row * windowHeight) + 'px';
                    window.style.left = (col * windowWidth) + 'px';
                    index++;
                }
            }
        }

      function stackWindows() {
                const windows = Array.from(document.querySelectorAll('.clsWindow')).filter(window => window.checkVisibility());

            const windowWidth = 300; // Adjust as needed
            const windowHeight = 200; // Adjust as needed
            let topOffset = 40;
            let leftOffset = 0;

            windows.forEach((window, index) => {
                window.style.width = windowWidth + 'px';
                window.style.height = windowHeight + 'px';
                window.style.top = topOffset + 'px';
                window.style.left = leftOffset + 'px';
                topOffset += 30; // Adjust the vertical stacking offset
                leftOffset += 30; // Adjust the horizontal stacking offset
            });
        }

       function copyWindow(button) {
            const window = button.closest('.clsWindow');
            const copy = window.cloneNode(true);
            window.before(copy);
            registerWindow(copy);
        }

        function toggleWindowState(button,action) {
            const window = button.closest('.clsWindow');
             window.classList.toggle('minimized');
             window.passive=window.className.includes('minimized')

        }

var KeyCounter = 0;    //Counter increasing by one on each use
function PersistPosition(element,KeyPrefix) {
    /*
        Load/Saves the last position of a window
    */
    KeyPrefix=KeyPrefix||"details"
    if(!element.id ) element.id="id"+KeyCounter
    var storagekey = KeyPrefix + element.id + "_style";
    KeyCounter = KeyCounter + 1;
    const parentElement = document.body;
 
    {
        const storedStyle = localStorage.getItem(storagekey);
        // Restore position, height, and width if stored
        if (storedStyle) {
            const style = JSON.parse(storedStyle);
            //element.style.position = style.position;
            if(style.className.includes('minimized')) element.classList.add('minimized')
            element.passive=element.className.includes('minimized')
            element.style.top = style.top
            element.style.width =  style.width
            element.style.height =  style.height
            element.style.left = style.left
            element.style.top = style.top
        }
    }
    function PersistPositionOnClose(element,storagekey) {
        return function() {
            const style = {
               // position: element.style.position,
                className:element.className
                ,left: element.style.left,
                top: element.style.top,
                width: element.style.width,
                height: element.style.height
            };
            localStorage.setItem(storagekey, JSON.stringify(style));
        }
    }
    window.addEventListener('blur', PersistPositionOnClose(element,storagekey));
    window.addEventListener('beforeunload', PersistPositionOnClose(element,storagekey));
}

function jLimit(a,x,b){
    if (Number.parseFloat(a)>Number.parseFloat(x))return a
    if (Number.parseFloat(b)<Number.parseFloat(x))return b
    return x;
}

function enableArrowKeyMovement(thisWindow) {
    const moveWindow = function(event) {
        // Check if the focus is not on an editable element
        const focusNotOnEditable = document.activeElement === document.body;
        if(!focusNotOnEditable) return

        // Check if Alt key is pressed
        const isAltPressed = event.altKey;

        if (thisWindow && !thisWindow.minimized() 
            && jWindows.getActiveWindow() === thisWindow 
            && focusNotOnEditable) {
            let moveTop = 0;
            let moveLeft = 0;
            let adjustWidth = 0;
            let adjustHeight = 0;
            switch (event.key) {
                case 'ArrowUp':
                    moveTop = -1;
                    event.preventDefault(); // Prevent default scroll behavior
                    event.stopPropagation();
                    break;
                case 'ArrowDown':
                    moveTop = 1;
                    event.preventDefault(); // Prevent default scroll behavior
                    event.stopPropagation();
                    break;
                case 'ArrowLeft':
                    moveLeft = -1;
                    event.preventDefault(); // Prevent default scroll behavior
                    event.stopPropagation();
                    break;
                case 'ArrowRight':
                    moveLeft = 1;
                    event.preventDefault(); // Prevent default scroll behavior
                    event.stopPropagation();
                    break;
                default:
                    return; // Exit if any other key is pressed
            }

            // Check for Alt key modifier to adjust width and height RESIZE
            if (isAltPressed) {
                switch (event.key) {
                    case 'ArrowUp':
                    case 'ArrowDown':
                        adjustHeight = moveTop;
                        moveTop=0
                        break;
                    case 'ArrowLeft':
                    case 'ArrowRight':
                        adjustWidth = moveLeft;
                        moveLeft=0
                        break;
                }
            }

            // Apply grid snapping using WindowGrid function
            WindowGrid(thisWindow, moveTop, moveLeft, adjustHeight, adjustWidth);
        }
    };

    // Add the keydown event listener only once per window
    if (!thisWindow._arrowKeyMovementInitialized) {
        document.addEventListener('keydown', moveWindow);
        thisWindow._arrowKeyMovementInitialized = true;
    }
}
 
function WindowPlace(thisWindow,x1,y1,x2,y2) {//Migration in progress for controlling overflow etc.
        const bySize=true; 
    if (bySize){
        thisWindow.style.width = (x2 - thisWindow.offsetLeft) + 'px';
        thisWindow.style.height = (y2 - thisWindow.offsetTop) + 'px';
    } else {
        thisWindow.style.left = (x2 ) + 'px';
        thisWindow.style.bottom = (y2 ) + 'px';
    }

}

function WindowGrid(thisWindow, moveTop = 0, moveLeft = 0, moveHeight = 0, moveWidth = 0) {
    const gridPoints = 100; // Grid step size
    const parentElement = thisWindow.parentElement;

    // Calculate grid resolution based on parent element dimensions
    const gridResolutionX = Math.ceil(parentElement.offsetWidth / gridPoints);
    const gridResolutionY = Math.ceil(parentElement.offsetHeight / gridPoints);

    // Parse current style values or fallback to default client dimensions
    let newTop = parseInt(thisWindow.style.top) || thisWindow.offsetTop;
    let newLeft = parseInt(thisWindow.style.left) || thisWindow.offsetLeft;
    let newWidth = parseInt(thisWindow.style.width) || thisWindow.clientWidth;
    let newHeight = parseInt(thisWindow.style.height) || thisWindow.clientHeight;

    // Calculate new positions based on movement increments
    newTop += moveTop * gridResolutionY;
    newLeft += moveLeft * gridResolutionX;
    newWidth += moveWidth * gridResolutionX;
    newHeight += moveHeight * gridResolutionY;

    // Round newTop, newLeft, newWidth, and newHeight to nearest multiple of grid points
    newTop = Math.round(newTop / gridResolutionY) * gridResolutionY;
    newLeft = Math.round(newLeft / gridResolutionX) * gridResolutionX;
    newWidth = Math.round(newWidth / gridResolutionX) * gridResolutionX;
    newHeight = Math.round(newHeight / gridResolutionY) * gridResolutionY;

    // Update thisWindow style properties
    thisWindow.style.top = newTop + 'px';
    thisWindow.style.left = newLeft + 'px';
    thisWindow.style.width = newWidth + 'px';
    thisWindow.style.height = newHeight + 'px';
}
function AutoselectOnFocus(element) {
    element.querySelectorAll('input').forEach(inputElement => {
        inputElement.addEventListener('focus', function() {
            this.select();
        });
    });
}


function WindowActiveElementListener(){
    window.ActiveElement = {
        Previous: null // To store the previously focused element
    };
    // Event listener to track focus on elements of interest
    document.addEventListener('focus', function(event) {
        // Store the previously focused element
        ActiveElement.Previous = event.relatedTarget;

        // Update ActiveElement with the current focused element
        const el = event.target;
        const nodeName = el.nodeName;
        ActiveElement[nodeName] = el;
    }, true);
}