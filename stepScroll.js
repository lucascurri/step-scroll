const stepScroll = ({tolerance, targetClass, forceNext, containerId } = {
    tolerance: 50,
    targetClass: "step-scroll",
    forceNext: false, 
    containerId: null
}) => {
    const targets = containerId 
        ? document.querySelectorAll(`#${containerId} .${targetClass}`) 
        : document.getElementsByClassName(targetClass) || [];
    const targetsOffset = [...targets].map(x => x.offsetTop);

    var currentIndex = 0;
    var timeOutId = null;
    var pageOffset = window.pageYOffset;

    const attach = ()=>{
        if(!hasTargets()){
            return;
        }

        setTolerance();
        window.addEventListener('scroll',() => { 
            if(timeOutId != null)
                clearTimeout(timeOutId);

            if(inContainer() == false)
                return true;

            timeOutId = setTimeout(()=>{
                setTarget();  
            },300);
        });
    };

    const hasTargets = () =>{
        
        if(targets.length === 0){
            console.warn(`stepScroll: No elements with class '${targetClass}' were found.`);
            return false;
        }

        return true;
    }

    const setTarget = () =>{

        if(!hasTargets()){
            return;
        }

        pageOffset = window.pageYOffset;
        const currentTarget = targets[currentIndex];
        const nextClosestTarget = getClosestOffset();
        const windowHeight = window.innerHeight;

        if(!currentTarget)
            return;

        const scrollDelta = currentTarget.offsetTop -pageOffset;
  
        if(Math.abs(scrollDelta) < tolerance)
            return;

        //Huge scroll
        if(Math.abs(scrollDelta) > windowHeight){
            //If closest element weren't found, scroll to previous target.
            currentIndex = nextClosestTarget == -1 
                    ? currentIndex-1 
                    : nextClosestTarget;  

        }else{
            currentIndex += scrollDelta < tolerance
                ? 1
                : -1;
        }

        scrollToTarget()
        
    };

    const getClosestOffset = () => {
        const nextIndex = targetsOffset.findIndex(x => (x - pageOffset) > 0);

        if(forceNext == true)
            return nextIndex;

        if(nextIndex == -1)
            return -1;

        if(nextIndex == 0){
            return 0;
        }

        const nextOffset = targetsOffset[nextIndex];
        const previousOffset  = targetsOffset[nextIndex - 1] ;

        return Math.abs(previousOffset - pageOffset) <= Math.abs(nextOffset - pageOffset)
            ? nextIndex - 1
            : nextIndex;

    }
    
    const inContainer = () => {
        const container = document.getElementById(containerId);

        if(!container)
            return true;
        
        return window.pageYOffset >= container.offsetTop && window.pageYOffset <= targetsOffset[targetsOffset.length-1];
    }

    const scrollToTarget = () => {
        
        if(currentIndex < 0)
            currentIndex = 0;

        if(!targets[currentIndex]){
            currentIndex = targets.length-2;
        }

        var offset = window.pageYOffset;
        var currentPosition = targets[currentIndex].offsetTop;
        var start = null;
        const time = 150;

        window.requestAnimationFrame(function step(currentTime) {
            start = !start ? currentTime : start;
            var progress = currentTime - start;
            if (offset < currentPosition) {
                window.scrollTo(0, ((currentPosition - offset) * progress / time) + offset);
            } else {
                window.scrollTo(0, offset - ((offset - currentPosition) * progress / time));
            }
            if (progress < time) {
                window.requestAnimationFrame(step);
            } else {
                window.scrollTo(0, currentPosition);
            }
        });

    }

    const setTolerance = () => {
        if(
            tolerance &&
            Number.isInteger(tolerance) && 
            parseInt(tolerance) > 0
        ){
            return;
        }

        console.warn(`stepScroll: tolerance must be numeric and greater than 0`);
        tolerance = 50;
    }

    attach();
}