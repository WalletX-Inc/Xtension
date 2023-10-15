import React from 'react';
import {createRoot} from 'react-dom/client'

import ContentScript from './contentScript'

function init() {
    const appContainer = document.createElement('div')
    if(!appContainer) {
        throw new Error('Cannot find ppContainer')
    }

    document.body.appendChild(appContainer)
    const root = createRoot(appContainer)
    console.log({appContainer})
    root.render(< ContentScript/>)
}

init();