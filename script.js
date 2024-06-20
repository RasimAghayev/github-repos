document.addEventListener('DOMContentLoaded', function() {
    const username = 'RasimAghayev';
    const repoContainer = document.getElementById('repo-container');

    async function fetchRepositories() {
        try {
            const response = await fetch(`https://api.github.com/users/${username}/repos`);
            const repos = await response.json();
            displayRepositories(repos);
        } catch (error) {
            console.error('Error fetching repositories:', error);
        }
    }

    function displayRepositories(repos) {
        repos.forEach(repo => {
            const repoElement = document.createElement('div');
            repoElement.classList.add('repo');

            repoElement.innerHTML = `
                <h2>${repo.name}</h2>
                <p>${repo.description || 'No description available'}</p>
                <a href="${repo.html_url}" target="_blank">View Repository</a>
            `;

            repoContainer.appendChild(repoElement);
        });
    }

    fetchRepositories();
});