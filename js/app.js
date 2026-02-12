/**
 * Main app - handles navigation between solvers.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize with Wordle solver
    WordleSolver.init();

    // Navigation handling
    document.querySelectorAll('.nav-card').forEach(card => {
        card.addEventListener('click', (e) => {
            e.preventDefault();

            // Update active state
            document.querySelectorAll('.nav-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');

            const target = card.getAttribute('href').replace('#', '');
            loadSolver(target);
        });
    });
});

function loadSolver(name) {
    const area = document.getElementById('solver-area');

    switch (name) {
        case 'wordle':
            WordleSolver.init();
            break;
        case 'connections':
            area.innerHTML = `
                <div style="text-align:center;padding:3rem 1rem;">
                    <h2>Connections Solver</h2>
                    <p style="color:#818384;margin-top:1rem;">Coming soon!</p>
                </div>`;
            break;
        case 'spelling-bee':
            area.innerHTML = `
                <div style="text-align:center;padding:3rem 1rem;">
                    <h2>Spelling Bee Solver</h2>
                    <p style="color:#818384;margin-top:1rem;">Coming soon!</p>
                </div>`;
            break;
    }
}
