# step-scroll

A simple auto-scroll between elements

##Usage

###Default

``` javascript
stepScroll();
```

###Custom options
``` javascript
const options = {
  targetClass: 'custom-class' //Element's class. (Default: step-scroll)
  containerId: 'custom-container' //Applies auto-scroll only to a container, othewise to the entire document. (Defualt: null)
  forceNext: true //Set true if in large scrolls always must go to the next element, otherwise it would scroll to the closest one. (Default: false),
  tolerance: 100 //Tolerance in pixel to don't trigger auto-scroll. (Default: 50)
}
stepScroll();
```
