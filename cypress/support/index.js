// Import commands.js using ES2015 syntax:
import './commands';

// Opens start-game page
beforeEach( () => {
    cy.log('start-game page is loaded before every test')
    cy.visit('/')
    // cy.wait(2500)

    cy.log('Game is launched from start-game page before every test')
    cy.get('.starting-screen > .play-button').click()
    
});


