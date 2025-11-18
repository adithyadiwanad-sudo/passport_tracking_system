// Passport Tracking System JavaScript

// Sample data from the provided JSON
const sampleData = {
    users: [
        {
            id: "user1",
            firstName: "Rajesh",
            lastName: "Kumar",
            email: "rajesh.kumar@email.com",
            phone: "9876543210",
            dateOfBirth: "1990-05-15",
            password: "password123",
            address: {
                street: "123 MG Road",
                city: "Bangalore",
                state: "Karnataka",
                pincode: "560001",
                country: "India"
            }
        },
        {
            id: "user2",
            firstName: "Priya",
            lastName: "Sharma",
            email: "priya.sharma@email.com",
            phone: "9876543211",
            dateOfBirth: "1985-08-22",
            password: "password123",
            address: {
                street: "456 Park Street",
                city: "Mumbai",
                state: "Maharashtra",
                pincode: "400001",
                country: "India"
            }
        }
    ],
    applications: [
        {
            applicationId: "PSP-2024-AB123456",
            userId: "user1",
            applicantName: "Rajesh Kumar",
            status: "Police Verification Completed",
            submittedDate: "2024-01-15",
            appointmentDate: "2024-01-25",
            expectedDelivery: "2024-02-15",
            passportType: "Fresh",
            serviceType: "Normal",
            dateOfBirth: "1990-05-15",
            statusHistory: [
                {
                    status: "Application Submitted",
                    date: "2024-01-15",
                    time: "10:30 AM"
                },
                {
                    status: "Under Review",
                    date: "2024-01-16",
                    time: "02:15 PM"
                },
                {
                    status: "Documents Verified",
                    date: "2024-01-20",
                    time: "11:00 AM"
                },
                {
                    status: "Police Verification Initiated",
                    date: "2024-01-22",
                    time: "09:30 AM"
                },
                {
                    status: "Police Verification Completed",
                    date: "2024-01-28",
                    time: "04:00 PM"
                }
            ]
        },
        {
            applicationId: "PSP-2024-CD789012",
            userId: "user2",
            applicantName: "Priya Sharma",
            status: "Passport Printed",
            submittedDate: "2024-01-10",
            appointmentDate: "2024-01-20",
            expectedDelivery: "2024-02-05",
            passportType: "Renewal",
            serviceType: "Tatkaal",
            dateOfBirth: "1985-08-22",
            statusHistory: [
                {
                    status: "Application Submitted",
                    date: "2024-01-10",
                    time: "09:00 AM"
                },
                {
                    status: "Under Review",
                    date: "2024-01-11",
                    time: "10:30 AM"
                },
                {
                    status: "Documents Verified",
                    date: "2024-01-12",
                    time: "02:00 PM"
                },
                {
                    status: "Approved",
                    date: "2024-01-15",
                    time: "11:30 AM"
                },
                {
                    status: "Passport Printed",
                    date: "2024-01-25",
                    time: "03:45 PM"
                }
            ]
        }
    ],
    admins: [
        {
            id: "admin1",
            name: "Admin User",
            email: "admin@passport.gov.in",
            password: "admin123",
            role: "Admin",
            department: "Passport Office"
        }
    ],
    statusOptions: [
        "Application Submitted",
        "Under Review",
        "Documents Verified",
        "Police Verification Initiated",
        "Police Verification Completed",
        "Approved",
        "Rejected",
        "Passport Printed",
        "Dispatched",
        "Delivered",
        "On Hold"
    ],
    states: [
        "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
        "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
        "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
        "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
        "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
    ]
};

// Global state
let currentUser = null;
let currentAdmin = null;
let currentStep = 1;
let applicationData = {};

// Utility Functions
function generateApplicationId() {
    const year = new Date().getFullYear();
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    let id = `PSP-${year}-`;
    
    // Add 2 random letters
    for (let i = 0; i < 2; i++) {
        id += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    
    // Add 6 random numbers
    for (let i = 0; i < 6; i++) {
        id += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }
    
    return id;
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
}

function getStatusClass(status) {
    const statusMap = {
        'Application Submitted': 'status--submitted',
        'Under Review': 'status--under-review',
        'Documents Verified': 'status--verified',
        'Police Verification Initiated': 'status--under-review',
        'Police Verification Completed': 'status--verified',
        'Approved': 'status--approved',
        'Rejected': 'status--rejected',
        'Passport Printed': 'status--completed',
        'Dispatched': 'status--completed',
        'Delivered': 'status--completed',
        'On Hold': 'status--on-hold'
    };
    return statusMap[status] || 'status--info';
}

// Enhanced form validation
function isValidDate(dateString) {
    if (!dateString) return false;
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date) && dateString.match(/^\d{4}-\d{2}-\d{2}$/);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
}

function isValidPincode(pincode) {
    const pincodeRegex = /^\d{6}$/;
    return pincodeRegex.test(pincode);
}

// Page Navigation
function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show selected page
    const targetPage = document.getElementById(pageId + '-page');
    if (targetPage) {
        targetPage.classList.add('active');
        
        // Load page-specific data
        switch(pageId) {
            case 'dashboard':
                loadUserDashboard();
                break;
            case 'admin':
                loadAdminDashboard();
                break;
            case 'apply':
                initializeApplicationForm();
                break;
        }
    }
}

// Initialize Data
function initializeData() {
    // Initialize localStorage with sample data if not exists
    if (!localStorage.getItem('passportUsers')) {
        localStorage.setItem('passportUsers', JSON.stringify(sampleData.users));
    }
    if (!localStorage.getItem('passportApplications')) {
        localStorage.setItem('passportApplications', JSON.stringify(sampleData.applications));
    }
    if (!localStorage.getItem('passportAdmins')) {
        localStorage.setItem('passportAdmins', JSON.stringify(sampleData.admins));
    }
    
    // Populate state dropdowns
    const stateSelects = document.querySelectorAll('#reg-state, #app-state');
    stateSelects.forEach(select => {
        sampleData.states.forEach(state => {
            const option = document.createElement('option');
            option.value = state;
            option.textContent = state;
            select.appendChild(option);
        });
    });
    
    // Populate status dropdown for admin
    const statusSelect = document.getElementById('status-update');
    const adminFilter = document.getElementById('admin-filter');
    
    if (statusSelect) {
        sampleData.statusOptions.forEach(status => {
            const option = document.createElement('option');
            option.value = status;
            option.textContent = status;
            statusSelect.appendChild(option);
        });
    }
    
    if (adminFilter) {
        sampleData.statusOptions.forEach(status => {
            const option = document.createElement('option');
            option.value = status;
            option.textContent = status;
            adminFilter.appendChild(option);
        });
    }
}

// Authentication Functions
function login(email, password) {
    const users = JSON.parse(localStorage.getItem('passportUsers') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = user;
        updateNavForUser();
        showPage('dashboard');
        return true;
    }
    return false;
}

function adminLogin(email, password) {
    const admins = JSON.parse(localStorage.getItem('passportAdmins') || '[]');
    const admin = admins.find(a => a.email === email && a.password === password);
    
    if (admin) {
        currentAdmin = admin;
        updateNavForAdmin();
        showPage('admin');
        return true;
    }
    return false;
}

function logout() {
    currentUser = null;
    currentAdmin = null;
    updateNavForGuest();
    showPage('home');
}

function register(userData) {
    const users = JSON.parse(localStorage.getItem('passportUsers') || '[]');
    
    // Check if user already exists
    if (users.find(u => u.email === userData.email)) {
        return { success: false, message: 'User already exists with this email' };
    }
    
    // Validate required fields
    if (!userData.firstName || !userData.lastName || !userData.email || !userData.phone || !userData.dateOfBirth) {
        return { success: false, message: 'Please fill all required fields' };
    }
    
    // Validate email format
    if (!isValidEmail(userData.email)) {
        return { success: false, message: 'Please enter a valid email address' };
    }
    
    // Validate phone format
    if (!isValidPhone(userData.phone)) {
        return { success: false, message: 'Please enter a valid 10-digit mobile number' };
    }
    
    // Validate date of birth
    if (!isValidDate(userData.dateOfBirth)) {
        return { success: false, message: 'Please enter a valid date of birth' };
    }
    
    // Generate user ID
    userData.id = 'user' + (users.length + 1);
    
    users.push(userData);
    localStorage.setItem('passportUsers', JSON.stringify(users));
    
    return { success: true, message: 'Registration successful' };
}

function updateNavForUser() {
    document.getElementById('nav-menu').style.display = 'none';
    document.getElementById('nav-user').style.display = 'flex';
    document.getElementById('user-name').textContent = `${currentUser.firstName} ${currentUser.lastName}`;
}

function updateNavForAdmin() {
    document.getElementById('nav-menu').style.display = 'none';
    document.getElementById('nav-user').style.display = 'flex';
    document.getElementById('user-name').textContent = `Admin: ${currentAdmin.name}`;
}

function updateNavForGuest() {
    document.getElementById('nav-menu').style.display = 'block';
    document.getElementById('nav-user').style.display = 'none';
}

// Application Tracking
function trackApplication(applicationId, dateOfBirth) {
    const applications = JSON.parse(localStorage.getItem('passportApplications') || '[]');
    const application = applications.find(app => 
        app.applicationId === applicationId && 
        app.dateOfBirth === dateOfBirth
    );
    
    if (application) {
        displayTrackingResults(application);
        return true;
    }
    return false;
}

function displayTrackingResults(application) {
    const resultsDiv = document.getElementById('track-results');
    
    // Fill application details
    document.getElementById('result-app-id').textContent = application.applicationId;
    document.getElementById('result-name').textContent = application.applicantName;
    document.getElementById('result-type').textContent = application.passportType;
    document.getElementById('result-service').textContent = application.serviceType;
    document.getElementById('result-submitted').textContent = formatDate(application.submittedDate);
    document.getElementById('result-delivery').textContent = formatDate(application.expectedDelivery);
    
    // Current status
    const statusBadge = document.getElementById('current-status');
    statusBadge.textContent = application.status;
    statusBadge.className = `status-badge ${getStatusClass(application.status)}`;
    
    // Status history
    const historyDiv = document.getElementById('status-history');
    historyDiv.innerHTML = '<div class="timeline">' +
        application.statusHistory.map(item => `
            <div class="timeline-item">
                <div class="timeline-content">
                    <div class="timeline-status">${item.status}</div>
                    <div class="timeline-date">${formatDate(item.date)} at ${item.time}</div>
                </div>
            </div>
        `).join('') + '</div>';
    
    resultsDiv.style.display = 'block';
}

// User Dashboard
function loadUserDashboard() {
    if (!currentUser) return;
    
    document.getElementById('dashboard-username').textContent = `${currentUser.firstName} ${currentUser.lastName}`;
    
    const applications = JSON.parse(localStorage.getItem('passportApplications') || '[]');
    const userApplications = applications.filter(app => app.userId === currentUser.id);
    
    // Update statistics
    const submitted = userApplications.length;
    const inProgress = userApplications.filter(app => 
        !['Delivered', 'Rejected'].includes(app.status)
    ).length;
    const completed = userApplications.filter(app => 
        app.status === 'Delivered'
    ).length;
    
    document.getElementById('stat-submitted').textContent = submitted;
    document.getElementById('stat-progress').textContent = inProgress;
    document.getElementById('stat-completed').textContent = completed;
    
    // Load applications table
    const tbody = document.getElementById('user-applications');
    tbody.innerHTML = userApplications.map(app => `
        <tr>
            <td>${app.applicationId}</td>
            <td>${app.passportType}</td>
            <td><span class="status ${getStatusClass(app.status)}">${app.status}</span></td>
            <td>${formatDate(app.submittedDate)}</td>
            <td>
                <div class="table-actions">
                    <button class="btn btn--sm btn--outline" onclick="viewApplication('${app.applicationId}')">View</button>
                    <button class="btn btn--sm btn--primary" onclick="printReceipt('${app.applicationId}')">Print</button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Admin Dashboard
function loadAdminDashboard() {
    if (!currentAdmin) return;
    
    const applications = JSON.parse(localStorage.getItem('passportApplications') || '[]');
    
    // Update statistics
    const total = applications.length;
    const pending = applications.filter(app => 
        ['Application Submitted', 'Under Review', 'Documents Verified'].includes(app.status)
    ).length;
    const completedToday = applications.filter(app => {
        const today = new Date().toISOString().split('T')[0];
        return app.status === 'Delivered' && app.submittedDate === today;
    }).length;
    
    document.getElementById('admin-total').textContent = total;
    document.getElementById('admin-pending').textContent = pending;
    document.getElementById('admin-completed').textContent = completedToday;
    
    // Load applications table
    loadAdminApplicationsTable(applications);
}

function loadAdminApplicationsTable(applications = null) {
    if (!applications) {
        applications = JSON.parse(localStorage.getItem('passportApplications') || '[]');
    }
    
    const tbody = document.getElementById('admin-applications');
    tbody.innerHTML = applications.map(app => `
        <tr>
            <td>${app.applicationId}</td>
            <td>${app.applicantName}</td>
            <td>${app.passportType}</td>
            <td><span class="status ${getStatusClass(app.status)}">${app.status}</span></td>
            <td>${formatDate(app.submittedDate)}</td>
            <td>
                <div class="table-actions">
                    <button class="btn btn--sm btn--outline" onclick="viewApplicationDetails('${app.applicationId}')">View</button>
                    <button class="btn btn--sm btn--primary" onclick="updateApplicationStatus('${app.applicationId}')">Update</button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Application Form
function initializeApplicationForm() {
    currentStep = 1;
    applicationData = {};
    
    // Pre-fill user data if logged in
    if (currentUser) {
        document.getElementById('app-firstname').value = currentUser.firstName;
        document.getElementById('app-lastname').value = currentUser.lastName;
        document.getElementById('app-email').value = currentUser.email;
        document.getElementById('app-mobile').value = currentUser.phone;
        document.getElementById('app-dob').value = currentUser.dateOfBirth;
        document.getElementById('app-address').value = currentUser.address.street;
        document.getElementById('app-city').value = currentUser.address.city;
        document.getElementById('app-state').value = currentUser.address.state;
        document.getElementById('app-pincode').value = currentUser.address.pincode;
        document.getElementById('app-country').value = currentUser.address.country;
    }
    
    updateFormStep();
}

function nextStep() {
    if (validateCurrentStep()) {
        saveCurrentStepData();
        if (currentStep < 5) {
            currentStep++;
            updateFormStep();
        }
    }
}

function previousStep() {
    if (currentStep > 1) {
        currentStep--;
        updateFormStep();
    }
}

function updateFormStep() {
    // Update progress bar
    document.querySelectorAll('.progress-step').forEach((step, index) => {
        step.classList.remove('active', 'completed');
        if (index + 1 === currentStep) {
            step.classList.add('active');
        } else if (index + 1 < currentStep) {
            step.classList.add('completed');
        }
    });
    
    // Show/hide form steps
    document.querySelectorAll('.form-step').forEach((step, index) => {
        step.classList.remove('active');
        if (index + 1 === currentStep) {
            step.classList.add('active');
        }
    });
    
    // Update navigation buttons
    const prevBtn = document.getElementById('prev-step');
    const nextBtn = document.getElementById('next-step');
    const submitBtn = document.getElementById('submit-application');
    
    prevBtn.style.display = currentStep === 1 ? 'none' : 'block';
    nextBtn.style.display = currentStep === 5 ? 'none' : 'block';
    submitBtn.style.display = currentStep === 5 ? 'block' : 'none';
    
    // Load review data for step 5
    if (currentStep === 5) {
        loadApplicationReview();
    }
}

function validateCurrentStep() {
    const currentStepDiv = document.querySelector(`.form-step[data-step="${currentStep}"]`);
    const requiredFields = currentStepDiv.querySelectorAll('[required]');
    
    let isValid = true;
    let errorMessages = [];
    
    requiredFields.forEach(field => {
        field.classList.remove('error');
        
        if (!field.value.trim()) {
            field.classList.add('error');
            errorMessages.push(`${field.previousElementSibling.textContent} is required`);
            isValid = false;
        } else {
            // Additional validation based on field type
            if (field.type === 'email' && !isValidEmail(field.value)) {
                field.classList.add('error');
                errorMessages.push('Please enter a valid email address');
                isValid = false;
            }
            
            if (field.type === 'tel' && !isValidPhone(field.value)) {
                field.classList.add('error');
                errorMessages.push('Please enter a valid 10-digit mobile number');
                isValid = false;
            }
            
            if (field.type === 'date' && !isValidDate(field.value)) {
                field.classList.add('error');
                errorMessages.push('Please enter a valid date');
                isValid = false;
            }
            
            if (field.id && field.id.includes('pincode') && !isValidPincode(field.value)) {
                field.classList.add('error');
                errorMessages.push('Please enter a valid 6-digit pincode');
                isValid = false;
            }
        }
    });
    
    if (!isValid) {
        showErrorMessage(errorMessages[0] || 'Please fill all required fields correctly.');
    }
    
    return isValid;
}

function saveCurrentStepData() {
    const stepData = {};
    const currentStepDiv = document.querySelector(`.form-step[data-step="${currentStep}"]`);
    const inputs = currentStepDiv.querySelectorAll('input, select');
    
    inputs.forEach(input => {
        stepData[input.id] = input.value;
    });
    
    Object.assign(applicationData, stepData);
}

function loadApplicationReview() {
    const reviewDiv = document.getElementById('application-review');
    reviewDiv.innerHTML = `
        <div class="review-section">
            <h4>Personal Information</h4>
            <p><strong>Name:</strong> ${applicationData['app-firstname']} ${applicationData['app-lastname']}</p>
            <p><strong>Date of Birth:</strong> ${formatDate(applicationData['app-dob'])}</p>
            <p><strong>Gender:</strong> ${applicationData['app-gender']}</p>
            <p><strong>Place of Birth:</strong> ${applicationData['app-pob']}</p>
        </div>
        <div class="review-section">
            <h4>Contact Details</h4>
            <p><strong>Email:</strong> ${applicationData['app-email']}</p>
            <p><strong>Mobile:</strong> ${applicationData['app-mobile']}</p>
            <p><strong>Address:</strong> ${applicationData['app-address']}, ${applicationData['app-city']}, ${applicationData['app-state']} - ${applicationData['app-pincode']}</p>
        </div>
        <div class="review-section">
            <h4>Passport Details</h4>
            <p><strong>Type:</strong> ${applicationData['app-passport-type']}</p>
            <p><strong>Service:</strong> ${applicationData['app-service-type']}</p>
            <p><strong>Reason:</strong> ${applicationData['app-reason']}</p>
        </div>
    `;
}

function submitApplication() {
    if (!document.getElementById('terms-accept').checked) {
        showErrorMessage('Please accept the terms and conditions.');
        return;
    }
    
    const applications = JSON.parse(localStorage.getItem('passportApplications') || '[]');
    
    const newApplication = {
        applicationId: generateApplicationId(),
        userId: currentUser ? currentUser.id : 'guest',
        applicantName: `${applicationData['app-firstname']} ${applicationData['app-lastname']}`,
        status: 'Application Submitted',
        submittedDate: new Date().toISOString().split('T')[0],
        appointmentDate: null,
        expectedDelivery: calculateExpectedDelivery(applicationData['app-service-type']),
        passportType: applicationData['app-passport-type'],
        serviceType: applicationData['app-service-type'],
        dateOfBirth: applicationData['app-dob'],
        statusHistory: [{
            status: 'Application Submitted',
            date: new Date().toISOString().split('T')[0],
            time: new Date().toLocaleTimeString('en-IN', {hour: '2-digit', minute: '2-digit'})
        }],
        applicationData: applicationData
    };
    
    applications.push(newApplication);
    localStorage.setItem('passportApplications', JSON.stringify(applications));
    
    showSuccessMessage(`Application submitted successfully! Your Application ID is: ${newApplication.applicationId}`);
    
    setTimeout(() => {
        if (currentUser) {
            showPage('dashboard');
        } else {
            showPage('home');
        }
    }, 3000);
}

function calculateExpectedDelivery(serviceType) {
    const today = new Date();
    const deliveryDays = serviceType === 'Tatkaal' ? 7 : 30;
    today.setDate(today.getDate() + deliveryDays);
    return today.toISOString().split('T')[0];
}

// Modal Functions
function showModal(modalId) {
    document.getElementById(modalId).classList.remove('hidden');
}

function hideModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
}

function showSuccessMessage(message) {
    document.getElementById('success-message').textContent = message;
    showModal('success-modal');
}

function showErrorMessage(message) {
    alert(message); // Simple error display
}

// Application Management
function viewApplication(applicationId) {
    const applications = JSON.parse(localStorage.getItem('passportApplications') || '[]');
    const application = applications.find(app => app.applicationId === applicationId);
    
    if (application) {
        displayTrackingResults(application);
        showPage('track');
    }
}

function viewApplicationDetails(applicationId) {
    const applications = JSON.parse(localStorage.getItem('passportApplications') || '[]');
    const application = applications.find(app => app.applicationId === applicationId);
    
    if (application) {
        const modalBody = document.getElementById('modal-body');
        modalBody.innerHTML = `
            <div class="application-details">
                <h4>Application Information</h4>
                <p><strong>Application ID:</strong> ${application.applicationId}</p>
                <p><strong>Applicant Name:</strong> ${application.applicantName}</p>
                <p><strong>Type:</strong> ${application.passportType}</p>
                <p><strong>Service:</strong> ${application.serviceType}</p>
                <p><strong>Submitted:</strong> ${formatDate(application.submittedDate)}</p>
                <p><strong>Current Status:</strong> <span class="status ${getStatusClass(application.status)}">${application.status}</span></p>
                
                <h4>Status History</h4>
                <div class="timeline">
                    ${application.statusHistory.map(item => `
                        <div class="timeline-item">
                            <div class="timeline-content">
                                <div class="timeline-status">${item.status}</div>
                                <div class="timeline-date">${formatDate(item.date)} at ${item.time}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        document.getElementById('status-update').setAttribute('data-app-id', applicationId);
        showModal('application-modal');
    }
}

function updateApplicationStatus(applicationId) {
    viewApplicationDetails(applicationId);
}

function updateStatus() {
    const applicationId = document.getElementById('status-update').getAttribute('data-app-id');
    const newStatus = document.getElementById('status-update').value;
    
    if (!newStatus) {
        showErrorMessage('Please select a status to update.');
        return;
    }
    
    const applications = JSON.parse(localStorage.getItem('passportApplications') || '[]');
    const appIndex = applications.findIndex(app => app.applicationId === applicationId);
    
    if (appIndex !== -1) {
        applications[appIndex].status = newStatus;
        applications[appIndex].statusHistory.push({
            status: newStatus,
            date: new Date().toISOString().split('T')[0],
            time: new Date().toLocaleTimeString('en-IN', {hour: '2-digit', minute: '2-digit'})
        });
        
        localStorage.setItem('passportApplications', JSON.stringify(applications));
        
        hideModal('application-modal');
        loadAdminDashboard();
        showSuccessMessage('Application status updated successfully!');
    }
}

function printReceipt(applicationId) {
    const applications = JSON.parse(localStorage.getItem('passportApplications') || '[]');
    const application = applications.find(app => app.applicationId === applicationId);
    
    if (application) {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Application Receipt - ${application.applicationId}</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; }
                        .details { margin: 20px 0; }
                        .row { display: flex; justify-content: space-between; margin: 5px 0; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h2>Passport Seva - Government of India</h2>
                        <h3>Application Receipt</h3>
                    </div>
                    <div class="details">
                        <div class="row"><strong>Application ID:</strong> ${application.applicationId}</div>
                        <div class="row"><strong>Applicant Name:</strong> ${application.applicantName}</div>
                        <div class="row"><strong>Passport Type:</strong> ${application.passportType}</div>
                        <div class="row"><strong>Service Type:</strong> ${application.serviceType}</div>
                        <div class="row"><strong>Submitted Date:</strong> ${formatDate(application.submittedDate)}</div>
                        <div class="row"><strong>Current Status:</strong> ${application.status}</div>
                        <div class="row"><strong>Expected Delivery:</strong> ${formatDate(application.expectedDelivery)}</div>
                    </div>
                    <p style="text-align: center; margin-top: 30px;">
                        <small>Keep this receipt for your records. You can track your application online using the Application ID.</small>
                    </p>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    }
}

// Search and Filter Functions
function filterAdminApplications() {
    const searchTerm = document.getElementById('admin-search').value.toLowerCase();
    const statusFilter = document.getElementById('admin-filter').value;
    
    let applications = JSON.parse(localStorage.getItem('passportApplications') || '[]');
    
    if (searchTerm) {
        applications = applications.filter(app => 
            app.applicationId.toLowerCase().includes(searchTerm) ||
            app.applicantName.toLowerCase().includes(searchTerm)
        );
    }
    
    if (statusFilter) {
        applications = applications.filter(app => app.status === statusFilter);
    }
    
    loadAdminApplicationsTable(applications);
}

// Enhanced form validation with better error handling
function validateFormField(field) {
    field.classList.remove('error');
    
    if (field.hasAttribute('required') && !field.value.trim()) {
        field.classList.add('error');
        return false;
    }
    
    // Specific validations
    if (field.type === 'email' && field.value && !isValidEmail(field.value)) {
        field.classList.add('error');
        return false;
    }
    
    if (field.type === 'tel' && field.value && !isValidPhone(field.value)) {
        field.classList.add('error');
        return false;
    }
    
    if (field.type === 'date' && field.value && !isValidDate(field.value)) {
        field.classList.add('error');
        return false;
    }
    
    if (field.id && field.id.includes('pincode') && field.value && !isValidPincode(field.value)) {
        field.classList.add('error');
        return false;
    }
    
    return true;
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    initializeData();
    
    // Navigation event listeners
    document.addEventListener('click', function(e) {
        if (e.target.hasAttribute('data-page')) {
            e.preventDefault();
            const page = e.target.getAttribute('data-page');
            
            // Check authentication for protected pages
            if (['dashboard', 'apply'].includes(page) && !currentUser) {
                showErrorMessage('Please login to access this page.');
                showPage('login');
                return;
            }
            
            if (page === 'admin' && !currentAdmin) {
                showErrorMessage('Please login as admin to access this page.');
                showPage('admin-login');
                return;
            }
            
            showPage(page);
        }
    });
    
    // Login form
    document.getElementById('login-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        if (login(email, password)) {
            showSuccessMessage('Login successful!');
        } else {
            showErrorMessage('Invalid email or password.');
        }
    });
    
    // Registration form with enhanced validation
    document.getElementById('register-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const password = document.getElementById('reg-password').value;
        const confirmPassword = document.getElementById('reg-confirm-password').value;
        
        if (password !== confirmPassword) {
            showErrorMessage('Passwords do not match.');
            return;
        }
        
        if (password.length < 6) {
            showErrorMessage('Password must be at least 6 characters long.');
            return;
        }
        
        const userData = {
            firstName: document.getElementById('reg-firstname').value,
            lastName: document.getElementById('reg-lastname').value,
            email: document.getElementById('reg-email').value,
            phone: document.getElementById('reg-phone').value,
            dateOfBirth: document.getElementById('reg-dob').value,
            password: password,
            address: {
                street: document.getElementById('reg-address').value,
                city: document.getElementById('reg-city').value,
                state: document.getElementById('reg-state').value,
                pincode: document.getElementById('reg-pincode').value,
                country: document.getElementById('reg-country').value
            }
        };
        
        const result = register(userData);
        if (result.success) {
            showSuccessMessage('Registration successful! Please login with your credentials.');
            setTimeout(() => showPage('login'), 2000);
        } else {
            showErrorMessage(result.message);
        }
    });
    
    // Track application form with proper validation
    document.getElementById('track-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const applicationId = document.getElementById('track-id').value.trim();
        const dateOfBirth = document.getElementById('track-dob').value;
        
        if (!applicationId) {
            showErrorMessage('Please enter your Application ID.');
            return;
        }
        
        if (!dateOfBirth || !isValidDate(dateOfBirth)) {
            showErrorMessage('Please enter a valid date of birth.');
            return;
        }
        
        if (trackApplication(applicationId, dateOfBirth)) {
            // Results will be displayed by trackApplication function
        } else {
            showErrorMessage('Application not found. Please check your Application ID and Date of Birth.');
        }
    });
    
    // Admin login form
    document.getElementById('admin-login-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('admin-email').value;
        const password = document.getElementById('admin-password').value;
        
        if (adminLogin(email, password)) {
            showSuccessMessage('Admin login successful!');
        } else {
            showErrorMessage('Invalid admin credentials.');
        }
    });
    
    // Passport application form
    document.getElementById('passport-application-form').addEventListener('submit', function(e) {
        e.preventDefault();
        saveCurrentStepData();
        submitApplication();
    });
    
    // Form navigation buttons
    document.getElementById('next-step').addEventListener('click', nextStep);
    document.getElementById('prev-step').addEventListener('click', previousStep);
    
    // Logout button
    document.getElementById('logout-btn').addEventListener('click', logout);
    
    // Modal close buttons
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = btn.closest('.modal');
            modal.classList.add('hidden');
        });
    });
    
    // Update status button
    document.getElementById('update-status-btn').addEventListener('click', updateStatus);
    
    // Admin search and filter
    document.getElementById('admin-search').addEventListener('input', filterAdminApplications);
    document.getElementById('admin-filter').addEventListener('change', filterAdminApplications);
    
    // Modal background click to close
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.add('hidden');
            }
        });
    });
    
    // Real-time form validation
    document.addEventListener('input', function(e) {
        if (e.target.classList.contains('form-control')) {
            validateFormField(e.target);
        }
    });
    
    // Clear results when track form is modified
    document.getElementById('track-id').addEventListener('input', function() {
        document.getElementById('track-results').style.display = 'none';
    });
    
    document.getElementById('track-dob').addEventListener('input', function() {
        document.getElementById('track-results').style.display = 'none';
    });
});

// CSS for error styling
const errorStyles = `
    .form-control.error {
        border-color: var(--color-error) !important;
        box-shadow: 0 0 0 3px rgba(var(--color-error-rgb), 0.1) !important;
    }
    
    .review-section {
        margin-bottom: 20px;
        padding: 16px;
        background: var(--color-bg-1);
        border-radius: var(--radius-base);
    }
    
    .review-section h4 {
        margin-bottom: 12px;
        color: var(--color-text);
        border-bottom: 1px solid var(--color-border);
        padding-bottom: 8px;
    }
    
    .review-section p {
        margin: 8px 0;
        color: var(--color-text-secondary);
    }
`;

// Add error styles to head
const styleSheet = document.createElement('style');
styleSheet.textContent = errorStyles;
document.head.appendChild(styleSheet);