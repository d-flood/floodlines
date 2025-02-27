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
    const sidenoteContainer = document.getElementById("sidenotes");
    if (!sidenoteContainer) return;

    const footnoteContainer = document.getElementsByClassName("footnotes")[0];
    const sidenotesSection = document.getElementById("sidenotes-section");
    
    if (!footnoteContainer) {
        sidenotesSection.classList.remove("xl:block");
        return;
    }

    const footnotes = document.querySelectorAll("[role=doc-endnotes] li");
    
    footnotes.forEach(note => {
        const clonedNote = note.cloneNode(true);
        sidenoteContainer.appendChild(clonedNote);
    });

    // Create observer for width changes
    const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
            if (entry.contentRect.width !== entry.target.previousWidth) {
                entry.target.previousWidth = entry.contentRect.width;
                positionNotes();
            }
        }
    });

    // Start observing sidenotes container
    resizeObserver.observe(sidenoteContainer);

    window.addEventListener('load', positionNotes);
    window.addEventListener('resize', positionNotes);
    // Initial positioning
    requestAnimationFrame(positionNotes);
}

document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("sidenotes")) {
        makeSideNotes();
    }
});