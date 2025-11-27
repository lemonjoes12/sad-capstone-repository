window.addEventListener('DOMContentLoaded', () => {
    console.log('🔄 Display QR Code page loaded');

    const params = new URLSearchParams(window.location.search);
    const data = params.get('data');

    if (!data) {
        console.log('❌ No data parameter found in URL');
        showErrorMessage('No project data found in URL');
        return;
    }

    try {
        const receivedData = JSON.parse(decodeURIComponent(data));
        console.log('✅ Raw data received:', receivedData);

        // ✅ CHECK IF DATA IS COMPRESSED OR FULL FORMAT
        let project;
        
        if (receivedData.t !== undefined) {
            // COMPRESSED DATA - convert to full format
            console.log('🔍 Detected COMPRESSED data format');
            project = {
                id: receivedData.id,
                title: receivedData.t || 'No title provided',
                professor: receivedData.p || 'No professor specified',
                year: receivedData.y || 'No year specified',
                abstract: receivedData.a || 'No abstract provided',
                members: receivedData.m || [],
                submissionDate: receivedData.sd || new Date().toISOString().split('T')[0],
                timestamp: receivedData.ts || new Date().toLocaleString()
            };
        } else {
            // FULL DATA - use as is
            console.log('🔍 Detected FULL data format');
            project = receivedData;
        }

        console.log('✅ Processed Project Data:', project);

        // ✅ FILL ALL FIELDS WITH PROJECT DATA
        document.getElementById('projectTitle').textContent = project.title || 'No title provided';
        document.getElementById('profName').textContent = project.professor || 'No professor specified';
        document.getElementById('academicYear').textContent = project.year || 'No year specified';
        document.getElementById('projectId').textContent = project.id || 'Not specified';
        
        // Abstract
        const abstractElement = document.getElementById('projectAbstract');
        if (abstractElement) {
            abstractElement.textContent = project.abstract || 'No abstract provided';
        }
        
        // Abstract length
        const abstractLength = document.getElementById('abstractLength');
        if (abstractLength) {
            abstractLength.textContent = `${project.abstract?.length || 0} characters`;
        }

        // ✅ TEAM MEMBERS - FIXED
        const tbody = document.getElementById('teamMembersTable');
        if (tbody) {
            tbody.innerHTML = '';
            
            console.log('👥 Team Members data:', project.members);
            
            if (project.members && project.members.length > 0) {
                project.members.forEach((member, index) => {
                    console.log(`👤 Member ${index + 1}:`, member);
                    
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${index + 1}</td>
                        <td>${member.fullName || member.name || `Member ${index + 1}`}</td>
                        <td>${member.section || 'Not specified'}</td>
                        <td>${member.email || 'Not specified'}</td>
                    `;
                    tbody.appendChild(row);
                });
                
                // Update team count
                const teamCount = document.getElementById('teamCount');
                if (teamCount) {
                    teamCount.textContent = `${project.members.length} team member${project.members.length !== 1 ? 's' : ''}`;
                }
            } else {
                console.log('⚠️ No team members found in data');
                tbody.innerHTML = `
                    <tr class="no-members">
                        <td colspan="4">
                            <i class="fas fa-users"></i>
                            <p>No team members added</p>
                        </td>
                    </tr>
                `;
            }
        }

        // ✅ SUBMISSION INFO
        const submissionDate = document.getElementById('submissionDate');
        const lastUpdated = document.getElementById('lastUpdated');
        const projectStatus = document.getElementById('projectStatus');
        
        if (submissionDate) {
            submissionDate.textContent = project.submissionDate || new Date().toLocaleDateString();
        }
        if (lastUpdated) {
            lastUpdated.textContent = project.timestamp || new Date().toLocaleString();
        }
        if (projectStatus) {
            projectStatus.textContent = 'Submitted';
        }

        console.log('✅ All data displayed successfully');

    } catch (error) {
        console.error('❌ Error parsing project data:', error);
        showErrorMessage('There was an error displaying the project information. Please try scanning the QR code again.');
    }
});

function showErrorMessage(message) {
    const container = document.querySelector('.container');
    if (container) {
        container.innerHTML = `
            <div style="text-align: center; padding: 50px;">
                <h2 style="color: #e74c3c;">
                    <i class="fas fa-exclamation-triangle"></i>
                    Error Loading Project Data
                </h2>
                <p style="margin: 20px 0; font-size: 16px;">${message}</p>
                <button onclick="window.history.back()" 
                        style="padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    <i class="fas fa-arrow-left"></i>
                    Go Back
                </button>
            </div>
        `;
    }
}