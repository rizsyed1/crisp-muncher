describe('The up arrow key', () => {
    it('moves the face up', () => {
        cy.get('body')
        .trigger('keydown', {keycode: 38})
        .trigger('keydown', {keycode: 38})
        .trigger('keydown', {keycode: 38})
        .trigger('keydown', {keycode: 38})
    })
})