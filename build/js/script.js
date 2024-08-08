'use strict'
;(function(){
    const checkWEBPInit = () => {
        const isSupportWebp = () => {
            const elem = document.createElement('canvas');
        
            if (!!(elem.getContext && elem.getContext('2d'))) {
                return elem.toDataURL('image/webp').indexOf('data:image/webp') == 0;
            } else {
                return false;
            }
        }
        
        document.documentElement.classList.add(isSupportWebp() ? 'webp' : 'no-webp');
    };

    checkWEBPInit();
})();