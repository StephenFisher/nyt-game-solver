/**
 * Spelling Bee Solver
 * Finds all valid words using the given letters, where each word
 * must contain the center (required) letter.
 *
 * Rules:
 * - Words must be at least 4 letters long
 * - Words must contain the center letter
 * - Words can only use the 7 given letters
 * - Letters can be reused
 */

const SpellingBeeSolver = {
    init() {
        this.render();
    },

    render() {
        const area = document.getElementById('solver-area');
        area.innerHTML = `
            <div class="bee-solver">
                <h2>Spelling Bee Solver</h2>
                <div class="instructions">
                    <strong>How to use:</strong> Enter the <strong>center letter</strong>
                    (required in every word) and the <strong>6 outer letters</strong> from
                    today's puzzle. Click <strong>Find Words</strong> to see all valid words.
                </div>

                <div class="bee-input-group">
                    <label>Center letter (required):</label>
                    <input type="text" id="center-letter" class="bee-input bee-center"
                           maxlength="1" placeholder="A"
                           oninput="this.value = this.value.toUpperCase()">
                </div>

                <div class="bee-input-group">
                    <label>Outer letters (6):</label>
                    <div class="outer-letters-row">
                        ${[1,2,3,4,5,6].map(i => `
                            <input type="text" class="bee-input bee-outer" id="outer-${i}"
                                   maxlength="1" placeholder="${i}"
                                   oninput="this.value = this.value.toUpperCase()">
                        `).join('')}
                    </div>
                </div>

                <div class="solver-controls">
                    <button class="btn btn-primary" onclick="SpellingBeeSolver.solve()">Find Words</button>
                    <button class="btn btn-secondary" onclick="SpellingBeeSolver.reset()">Reset</button>
                </div>

                <div id="results"></div>
            </div>
        `;

        // Auto-advance to next input on typing
        area.querySelectorAll('.bee-input').forEach((input, idx, all) => {
            input.addEventListener('input', () => {
                if (input.value && idx < all.length - 1) {
                    all[idx + 1].focus();
                }
            });
        });
    },

    solve() {
        const center = document.getElementById('center-letter').value.toLowerCase();
        const outers = Array.from(document.querySelectorAll('.bee-outer'))
            .map(el => el.value.toLowerCase())
            .filter(v => v);

        if (!center) {
            this.showError('Please enter the center letter.');
            return;
        }
        if (outers.length < 6) {
            this.showError('Please enter all 6 outer letters.');
            return;
        }

        const validLetters = new Set([center, ...outers]);

        const matches = WORD_LIST.filter(word => {
            // Must be at least 4 letters
            if (word.length < 4) return false;

            // Must contain the center letter
            if (!word.includes(center)) return false;

            // Every letter in the word must be one of the 7 valid letters
            for (const ch of word) {
                if (!validLetters.has(ch)) return false;
            }

            return true;
        });

        // Sort by length (longest first), then alphabetically
        matches.sort((a, b) => b.length - a.length || a.localeCompare(b));

        // Check for pangrams (words using all 7 letters)
        const pangrams = matches.filter(word => {
            const letters = new Set(word);
            return validLetters.size === letters.size &&
                   [...validLetters].every(l => letters.has(l));
        });

        this.showResults(matches, pangrams);
    },

    showResults(words, pangrams) {
        const results = document.getElementById('results');

        if (words.length === 0) {
            results.innerHTML = '<h3>No words found</h3><p>Double-check your letters.</p>';
            return;
        }

        results.innerHTML = `
            <h3>${words.length} word${words.length !== 1 ? 's' : ''} found</h3>
            ${pangrams.length > 0 ? `
                <div class="pangram-section">
                    <h4>Pangrams (use all 7 letters):</h4>
                    <div id="word-list">
                        ${pangrams.map(w => `<span class="word pangram">${w}</span>`).join('')}
                    </div>
                </div>
            ` : ''}
            <div id="word-list" style="margin-top: 1rem;">
                ${words.map(w => `<span class="word${pangrams.includes(w) ? ' pangram' : ''}">${w}</span>`).join('')}
            </div>
        `;
    },

    showError(msg) {
        document.getElementById('results').innerHTML = `<h3 style="color:#b59f3b;">${msg}</h3>`;
    },

    reset() {
        this.init();
    }
};
