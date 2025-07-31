// Proper file handling ke liye
document.getElementById('pdf-upload').addEventListener('change', async function(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    // File type check
    if (file.type !== 'application/pdf') {
        alert('Kripya sirf PDF file upload karein');
        return;
    }
    
    // File size check (e.g., 5MB limit)
    if (file.size > 5 * 1024 * 1024) {
        alert('File ka size 5MB se kam hona chahiye');
        return;
    }
    
    window.protectedPdfFile = file;
    document.getElementById('password-input').style.display = 'block';
});
// Mobile Menu Toggle
document.querySelector('.mobile-menu').addEventListener('click', function() {
    const nav = document.querySelector('nav ul');
    nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
});

// Search Functionality
document.querySelector('.search-box button').addEventListener('click', function() {
    const searchTerm = document.querySelector('.search-box input').value.toLowerCase();
    if (searchTerm) {
        alert(`Searching for: ${searchTerm}\nThis would redirect to search results in a full implementation.`);
    }
});

// Tool Card Click Events
document.querySelectorAll('.tool-card').forEach(card => {
    card.addEventListener('click', function() {
        const toolName = this.querySelector('h4').textContent;
        alert(`You clicked on ${toolName}\nThis would redirect to the tool page in a full implementation.`);
    });
});

// Smooth Scrolling for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
// Open Tool Modal
function openTool(toolId) {
    const modal = document.getElementById(`${toolId}-tool`);
    if (modal) {
        modal.style.display = 'flex';
    } else {
        alert('This tool is not yet implemented in this demo.');
    }
}

// Close Tool Modal
function closeTool() {
    document.querySelectorAll('.tool-modal').forEach(modal => {
        modal.style.display = 'none';
    });
}

// Close modal when clicking outside content
window.addEventListener('click', function(event) {
    if (event.target.classList.contains('tool-modal')) {
        closeTool();
    }
});
// PDF Password Remover Functionality
document.getElementById('pdf-upload').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
        document.getElementById('password-input').style.display = 'block';
        
        // Store the file for later processing
        window.protectedPdfFile = file;
    } else {
        alert('Please select a valid PDF file');
    }
});

document.getElementById('unlock-btn').addEventListener('click', async function() {
    const password = document.getElementById('pdf-password').value;
    const file = window.protectedPdfFile;
    
    if (!password) {
        alert('Please enter the PDF password');
        return;
    }
    
    // Using pdf-lib library (must be included in your project)
    try {
        const { PDFDocument } = PDFLib;
        const pdfBytes = await file.arrayBuffer();
        
        // Try to load with password
        const pdfDoc = await PDFDocument.load(pdfBytes, {
            password: password
        });
        
        // Save without password
        const unlockedPdf = await pdfDoc.save();
        
        // Create download link
        const blob = new Blob([unlockedPdf], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        
        document.getElementById('download-unlocked').href = url;
        document.getElementById('download-unlocked').download = 'unlocked_' + file.name;
        document.getElementById('unlock-result').style.display = 'block';
        document.getElementById('password-input').style.display = 'none';
        
    } catch (error) {
        alert('Failed to unlock PDF. Wrong password?');
        console.error(error);
    }
});
// DOCX to PDF Converter
document.getElementById('docx-upload').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file && (file.name.endsWith('.docx') || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
        document.getElementById('conversion-options').style.display = 'block';
        window.docxFile = file;
    } else {
        alert('Please select a valid DOCX file');
    }
});

document.getElementById('convert-btn').addEventListener('click', async function() {
    const file = window.docxFile;
    const preserveLayout = document.getElementById('preserve-layout').checked;
    
    // Show loading state
    const convertBtn = document.getElementById('convert-btn');
    convertBtn.disabled = true;
    convertBtn.textContent = 'Converting...';
    
    try {
        // Convert DOCX to HTML first
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        
        // Create PDF from HTML content
        const { PDFDocument, rgb } = PDFLib;
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([600, 800]);
        
        // Simple text rendering (for demo)
        // In production, you'd use a more sophisticated HTML to PDF converter
        page.drawText(result.value, {
            x: 50,
            y: 750,
            size: 12,
            color: rgb(0, 0, 0),
        });
        
        const pdfBytes = await pdfDoc.save();
        
        // Create download link
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        
        document.getElementById('download-pdf').href = url;
        document.getElementById('download-pdf').download = file.name.replace('.docx', '.pdf');
        document.getElementById('conversion-result').style.display = 'block';
        document.getElementById('conversion-options').style.display = 'none';
        
    } catch (error) {
        alert('Conversion failed. Please try again.');
        console.error(error);
    } finally {
        convertBtn.disabled = false;
        convertBtn.textContent = 'Convert to PDF';
    }
});