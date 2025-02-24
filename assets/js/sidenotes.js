function getAbsoluteTop(element) {
    let top = 0;
    while (element) {
        top += element.offsetTop;
        element = element.offsetParent;
    }
    return top;
}

function positionNotes() {
    const footnotes = document.querySelectorAll("#sidenotes li");
    const buffer = 12;
    const sidenoteContainer = document.getElementById("sidenotes");
    const containerRect = sidenoteContainer.getBoundingClientRect();
    let usedSpace = new Map(); // Track vertical space usage

    // Reset and prepare notes
    footnotes.forEach(note => {
        note.style.position = 'absolute';
        note.style.left = '0';
        note.style.right = '0';
        note.style.transform = 'none';
    });

    // Position each note
    Array.from(footnotes).forEach(note => {
        const ref = note.id.replace('fn:', '#fn:');
        const reference = document.querySelector(`[href="${ref}"]`);
        
        if (reference) {
            const refRect = reference.getBoundingClientRect();
            const noteHeight = note.offsetHeight;
            let targetY = refRect.top - containerRect.top;

            // Find first available vertical space
            while (Array.from(usedSpace.entries()).some(([y, height]) => 
                Math.abs(y - targetY) < height + buffer)) {
                targetY += buffer;
            }

            note.style.top = `${targetY}px`;
            usedSpace.set(targetY, noteHeight);
        }
    });
}

function makeSideNotes() {
    const footnoteContainer = document.getElementsByClassName("footnotes")[0];
    if (!footnoteContainer) return;

    const footnotes = document.querySelectorAll("[role=doc-endnotes] li");
    const sidenoteContainer = document.getElementById("sidenotes");
    
    footnotes.forEach(note => sidenoteContainer.appendChild(note));

    window.addEventListener('load', positionNotes);
    window.addEventListener('resize', positionNotes);
    // Initial positioning
    requestAnimationFrame(positionNotes);
}

document.addEventListener("DOMContentLoaded", makeSideNotes);