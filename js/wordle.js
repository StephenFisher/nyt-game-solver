/**
 * Wordle Solver
 * Filters possible words based on guesses and color feedback.
 */

const WordleSolver = {
    MAX_GUESSES: 6,
    WORD_LENGTH: 5,
    guesses: [],

    /** Color cycle: gray -> yellow -> green -> gray */
    COLORS: ['gray', 'yellow', 'green'],

    init() {
        this.guesses = [];
        this.render();
    },

    render() {
        const area = document.getElementById('solver-area');
        area.innerHTML = `
            <div class="wordle-solver">
                <h2>Wordle Solver</h2>
                <div class="instructions">
                    <strong>How to use:</strong> Enter your Wordle guess, then click each
                    letter to set its color to match the feedback you got.
                    <strong>Gray</strong> = not in word,
                    <strong>Yellow</strong> = wrong position,
                    <strong>Green</strong> = correct position.
                    Then click <strong>Find Words</strong>.
                </div>
                <div id="guess-rows"></div>
                <div class="solver-controls">
                    <button class="btn btn-secondary" onclick="WordleSolver.addRow()">Add Guess</button>
                    <button class="btn btn-primary" onclick="WordleSolver.solve()">Find Words</button>
                    <button class="btn btn-secondary" onclick="WordleSolver.reset()">Reset</button>
                </div>
                <div id="results"></div>
            </div>
        `;
        this.addRow();
    },

    addRow() {
        if (this.guesses.length >= this.MAX_GUESSES) return;

        const rowIndex = this.guesses.length;
        this.guesses.push({ letters: ['', '', '', '', ''], colors: [0, 0, 0, 0, 0] });

        const container = document.getElementById('guess-rows');
        const row = document.createElement('div');
        row.className = 'guess-row';
        row.id = `row-${rowIndex}`;

        for (let i = 0; i < this.WORD_LENGTH; i++) {
            const btn = document.createElement('button');
            btn.className = 'color-btn gray';
            btn.textContent = '';
            btn.dataset.row = rowIndex;
            btn.dataset.col = i;
            btn.onclick = () => this.cycleColor(rowIndex, i);

            // Allow typing directly on buttons
            btn.addEventListener('keydown', (e) => this.handleKey(e, rowIndex, i));
            btn.tabIndex = 0;

            row.appendChild(btn);
        }

        container.appendChild(row);
        // Focus first cell of new row
        row.children[0].focus();
    },

    handleKey(e, row, col) {
        const letter = e.key.toLowerCase();

        if (letter === 'backspace') {
            e.preventDefault();
            this.guesses[row].letters[col] = '';
            this.updateCell(row, col);
            if (col > 0) {
                document.querySelector(`#row-${row} .color-btn:nth-child(${col})`).focus();
            }
            return;
        }

        if (letter.length === 1 && letter >= 'a' && letter <= 'z') {
            e.preventDefault();
            this.guesses[row].letters[col] = letter;
            this.updateCell(row, col);
            // Move to next cell
            if (col < this.WORD_LENGTH - 1) {
                document.querySelector(`#row-${row} .color-btn:nth-child(${col + 2})`).focus();
            }
        }
    },

    updateCell(row, col) {
        const btn = document.querySelector(`#row-${row} .color-btn:nth-child(${col + 1})`);
        btn.textContent = this.guesses[row].letters[col].toUpperCase();
    },

    cycleColor(row, col) {
        const guess = this.guesses[row];
        guess.colors[col] = (guess.colors[col] + 1) % 3;
        const btn = document.querySelector(`#row-${row} .color-btn:nth-child(${col + 1})`);
        btn.className = 'color-btn ' + this.COLORS[guess.colors[col]];
    },

    solve() {
        // Gather constraints from all guesses
        const greenPositions = {};   // position -> letter (must be this letter here)
        const yellowLetters = [];    // { letter, position } (letter exists but not here)
        const grayLetters = new Set(); // letters not in the word at all

        for (const guess of this.guesses) {
            const word = guess.letters.join('');
            if (word.length !== this.WORD_LENGTH || word.includes('')) continue;

            for (let i = 0; i < this.WORD_LENGTH; i++) {
                const letter = guess.letters[i];
                const color = guess.colors[i]; // 0=gray, 1=yellow, 2=green

                if (color === 2) {
                    greenPositions[i] = letter;
                } else if (color === 1) {
                    yellowLetters.push({ letter, position: i });
                } else {
                    grayLetters.add(letter);
                }
            }
        }

        // Remove gray letters that also appear as yellow/green (Wordle quirk)
        for (const { letter } of yellowLetters) grayLetters.delete(letter);
        for (const pos in greenPositions) grayLetters.delete(greenPositions[pos]);

        // Letters that must be in the word (from yellow clues)
        const mustContain = [...new Set(yellowLetters.map(y => y.letter))];

        // Filter the word list
        const matches = WORD_LIST.filter(word => {
            // Check green positions
            for (const pos in greenPositions) {
                if (word[pos] !== greenPositions[pos]) return false;
            }

            // Check yellow: letter must be in word but NOT at that position
            for (const { letter, position } of yellowLetters) {
                if (word[position] === letter) return false;
                if (!word.includes(letter)) return false;
            }

            // Check gray: letter must not be in word
            for (const letter of grayLetters) {
                if (word.includes(letter)) return false;
            }

            return true;
        });

        this.showResults(matches);
    },

    showResults(words) {
        const results = document.getElementById('results');

        if (words.length === 0) {
            results.innerHTML = '<h3>No matching words found</h3><p>Double-check your colors and letters.</p>';
            return;
        }

        const display = words.slice(0, 50);
        results.innerHTML = `
            <h3>${words.length} possible word${words.length !== 1 ? 's' : ''}</h3>
            <div id="word-list">
                ${display.map(w => `<span class="word">${w}</span>`).join('')}
            </div>
            ${words.length > 50 ? `<p style="margin-top:0.75rem;color:#818384;">Showing first 50 of ${words.length}</p>` : ''}
        `;
    },

    reset() {
        this.guesses = [];
        this.render();
    }
};
