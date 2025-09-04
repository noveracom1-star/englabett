// Cloudinary Upload Widget Configuration
const cloudinaryWidgetOptions = {
    cloudName: 'YOUR_CLOUD_NAME',
    uploadPreset: 'YOUR_UPLOAD_PRESET',
    sources: ['local', 'url', 'camera'],
    multiple: false,
    clientAllowedFormats: ['jpg', 'png', 'jpeg', 'gif', 'pdf'],
    maxFileSize: 5000000, // 5MB
    theme: 'minimal',
    styles: {
        palette: {
            window: '#2C3E50',
            windowBorder: '#3498DB',
            tabIcon: '#ECF0F1',
            menuIcons: '#ECF0F1',
            textDark: '#2C3E50',
            textLight: '#ECF0F1',
            link: '#3498DB',
            action: '#E74C3C',
            inactiveTabIcon: '#BDC3C7',
            error: '#E74C3C',
            inProgress: '#3498DB',
            complete: '#27AE60',
            sourceBg: '#ECF0F1'
        },
        fonts: {
            default: null,
            "'Poppins', sans-serif": {
                url: "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap",
                active: true
            }
        }
    }
};

// Initialize Cloudinary Widget
function initializeCloudinaryWidget(buttonId, previewId, urlFieldId, fileType = 'image') {
    const widget = cloudinary.createUploadWidget(
        cloudinaryWidgetOptions,
        (error, result) => {
            if (!error && result && result.event === "success") {
                const fileUrl = result.info.secure_url;
                document.getElementById(urlFieldId).value = fileUrl;
                
                if (fileType === 'image') {
                    const previewElement = document.getElementById(previewId);
                    previewElement.innerHTML = `<img src="${fileUrl}" alt="Uploaded ${fileType}">`;
                } else {
                    const previewElement = document.getElementById(previewId);
                    previewElement.innerHTML = `
                        <a href="${fileUrl}" target="_blank">View Uploaded Document</a>
                        <p>File: ${result.info.original_filename}.${result.info.format}</p>
                    `;
                }
            }
        }
    );

    document.getElementById(buttonId).addEventListener('click', (e) => {
        e.preventDefault();
        widget.open();
    });
}

// Initialize all upload widgets when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Image uploads
    initializeCloudinaryWidget('uploadLogoBtn', 'logoPreview', 'businessLogoUrl');
    initializeCloudinaryWidget('uploadBannerBtn', 'bannerPreview', 'storeBannerUrl');
    initializeCloudinaryWidget('uploadPhotoBtn', 'photoPreview', 'ownerPhotoUrl');
    
    // Document uploads
    initializeCloudinaryWidget('uploadLicenseBtn', 'licensePreview', 'businessLicenseUrl', 'document');
    initializeCloudinaryWidget('uploadCertBtn', 'certPreview', 'incorporationCertUrl', 'document');
    initializeCloudinaryWidget('uploadIdDocBtn', 'idDocPreview', 'ownerIdDocumentUrl', 'document');
});