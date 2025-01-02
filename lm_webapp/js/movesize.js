/*	File:move_size.js
	A library for resizing and moving elements having 
    A title element (for moving)
    Optionally a Sizehandleelement
    use:
        SizeAndMove(ParentElement, MoveHandleElement,SizeHandleElement);

    HTML example
        <div id="ParentElement"  >
            <div  id="MoveHandleElement">Dialog Title</div>
            <div id="dialogContent">
                <p>This is a resizable and movable dialog.</p>
                <button id="closeBtn1">Close</button>
            </div>
            <div id="SizeHandleElement">///</div>
        </div>


*/
var KeyCounter = 0;    //Counter increasing by one on each use

function PersistPosition(element) {
    /*
        Load/Saves the last position of a window
    */
    var storagekey = "details" + KeyCounter + "_style";
    KeyCounter = KeyCounter + 1;
    const parentElement = document.body;
    if(parentElement.clientWidth>10) 
    if(parentElement.clientHeight>10) 
    if (element.open) {
        const storedStyle = localStorage.getItem(storagekey);
        // Restore position, height, and width if stored
        if (storedStyle) {
            const style = JSON.parse(storedStyle);
            if(style.left)
            if(style.top)
            if (style.position === 'absolute') {
                element.style.position = style.position;
            // Constrain 'width' value
            element.style.width = parseInt(jLimit('100', style.width, parentElement.clientWidth)) + 'px';
            // Constrain 'height' value
            element.style.height = parseInt(jLimit('100', style.height, parentElement.clientHeight-10)) + 'px';           }
             // Constrain 'left' value
            element.style.left = parseInt(jLimit('10', style.left, parentElement.clientWidth - element.clientWidth/2)) + 'px';
            // Constrain 'top' value
            element.style.top = parseInt(jLimit('10', style.top, parentElement.clientHeight - element.clientHeight/2)) + 'px';
        }
    }

    function PersistPositionOnClose(element,storagekey) {
        return function() {
            // Store position, height, and width if position is 'absolute'
            if (element.style.position === 'absolute') {
                const style = {
                    position: element.style.position,
                    left: element.style.left,
                    top: element.style.top,
                    width: element.style.width,
                    height: element.style.height
                };
                localStorage.setItem(storagekey, JSON.stringify(style));
            }
        }
    }
    window.addEventListener('blur', PersistPositionOnClose(element,storagekey));
    //window.addEventListener('beforeunload', PersistPositionOnClose(storagekey));
}


 


function SizeAndMove(ParentElement, MoveHandleElement, SizeHandleElement) {
    const HasCloseButton=false
  let startX = 0;
  let startY = 0;
  let isMouseDown = false;
  let MouseElement = null;

  // Create a div with '///' on the bottom right of the ParentElement if SizeHandleElement is not provided
  if (!SizeHandleElement) {
    SizeHandleElement = document.createElement('div');
    SizeHandleElement.classList.add('SizeHandle')
    SizeHandleElement.innerHTML = '///';
    ParentElement.appendChild(SizeHandleElement);
  }
    SizeHandleElement.addEventListener('mousedown', StartMoving, { passive: true });
    SizeHandleElement.addEventListener('touchstart', StartMoving, { passive: true });
    SizeHandleElement.style.cursor = 'se-resize';

if (!MoveHandleElement) {
    const moveCover = document.createElement('div');
    moveCover.classList.add('moveHandle')
    ParentElement.appendChild(moveCover);
 ;
    MoveHandleElement = moveCover;

    MoveHandleElement.addEventListener('mousedown', StartMoving, { passive: true });
    MoveHandleElement.addEventListener('touchstart', StartMoving, { passive: true });
    MoveHandleElement.style.cursor = 'move';

    // Create the close button
    if(HasCloseButton){
        const closeButton = document.createElement('div');
        closeButton.classList.add('closeButton')
        closeButton.innerHTML = 'X';
        // Append the close button to the parent element
        ParentElement.appendChild(closeButton);
        // Add the click event listener to the close button to remove the parent element
        closeButton.addEventListener('click', function () {
            ParentElement.hidden=true;
        });
    }
  }

  ParentElement.style.resize = 'both';

  if (['relative', 'absolute'].indexOf(window.getComputedStyle(ParentElement).position) < 0) {
    ParentElement.style.position = 'absolute';
  }

  function applyAction(event, elem) {
    var endX = event.clientX || event.touches[0].clientX;
    var endY = event.clientY || event.touches[0].clientY;

    var dX = endX - startX;
    startX = endX;
    var dY = endY - startY;
    startY = endY;

if (elem == MoveHandleElement) {
  event.preventDefault();
  var X = Number.parseFloat(window.getComputedStyle(ParentElement).left) || ParentElement.offsetLeft;
  var Y = Number.parseFloat(window.getComputedStyle(ParentElement).top) || ParentElement.offsetTop;
  ParentElement.style.left = (X + dX) +'px';
  ParentElement.style.top =  (Y + dY) +'px';
  /*
  ParentElement.style.left = parseInt(jLimit('0', (X + dX) , ParentElement.parentElement.clientWidth )) + 'px';
  ParentElement.style.top = parseInt(jLimit('0', (Y + dY) , ParentElement.parentElement.clientHeight )) + 'px';

  */
} else if (elem == SizeHandleElement) {
  ParentElement.style.width =  (endX -ParentElement.getBoundingClientRect().left)  + 'px';
  ParentElement.style.height = (endY -ParentElement.getBoundingClientRect().top ) + 'px';
  /*
  ParentElement.style.width = parseInt(jLimit('0', (endX - ParentElement.getBoundingClientRect().left) , ParentElement.parentElement.clientWidth)) + 'px';
  ParentElement.style.height = parseInt(jLimit('0', (endY - ParentElement.getBoundingClientRect().top) , ParentElement.parentElement.clientHeight)) + 'px';
  */
}

  }

  function StartMoving(event) {
    event.preventDefault();
    isMouseDown = true;
    MouseElement = event.target;
    startX = event.clientX || event.touches[0].clientX;
    startY = event.clientY || event.touches[0].clientY;

    if (event.type.includes('touch')) {
      window.addEventListener('touchmove', handleMouseMove, { passive: true });
      window.addEventListener('touchend', StopMoving, { passive: true });
    } else {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      window.addEventListener('mouseup', StopMoving, { passive: true });
    }
  }

  function handleMouseMove(event) {
    if (isMouseDown && MouseElement) {
      applyAction(event, MouseElement);
    }
  }

  function StopMoving(event) {
    event.preventDefault();
    isMouseDown = false;
    MouseElement = null;
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', StopMoving);
    window.removeEventListener('touchmove', handleMouseMove);
    window.removeEventListener('touchend', StopMoving);
  }
}





function jLimit(a,x,b){
    if (Number.parseFloat(a)>Number.parseFloat(x))return a
    if (Number.parseFloat(b)<Number.parseFloat(x))return b
    return x;
}


// add a CSS class for consistent styling

function addStyleSheet(){
var style = document.createElement('style');
style.innerHTML = `
    .moveHandle {
        position: absolute;
        top: 0px;
        left: 50%;
        height: 1.1em;
        right: 0px;
        cursor: move;
        background: transparent;
    }

.closeButton {
    position: absolute;
    top: 0px;
    right: 0px;
    width: 2em;
    height: 2em;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    background-color: red;
    color: white;
    font-weight: bold;
}
.SizeHandle {
    position: absolute;
    bottom: 0px;
    right: 0px;
    cursor: se-resize;
}

`;
document.head.appendChild(style);

}
addStyleSheet();
