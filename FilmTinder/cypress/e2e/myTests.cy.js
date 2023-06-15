// https://docs.cypress.io/api/introduction/api.html

describe('My First Test', () => {
    it('visits the app root url', () => {
      cy.visit('/')
      cy.contains('h1', 'You did it!')
    })
  });
  describe('Login Page', () => {
    beforeEach(() => {
      cy.visit('/login'); // Replace '/login' with the actual URL of the login page
    });
  
    it('should display an error message for invalid login', () => {
      cy.get('input[type="email"]').type('invalid@examplecom'); 
      cy.get('input[type="password"]').type('incorrectpassword'); 
      cy.contains('Sign In').click(); 
      cy.contains('Invalid Email').should('be.visible'); 
    });
  
    it('should login successfully with valid credentials', () => {
      cy.intercept('POST', '**/signInWithEmailAndPassword', {
        fixture: 'login-success.json'
      }).as('loginRequest');
      cy.get('input[type="email"]').type('valid@example.com'); 
      cy.get('input[type="password"]').type('correctpassword'); 
      cy.contains('Sign In').click();
      cy.wait('@loginRequest');
      cy.url().should('include', '/feed'); 
    });
  
    it('should display an error message for disabled user', () => {
      cy.intercept('POST', '**/signInWithEmailAndPassword', {
        fixture: 'disabled-user-error.json' 
      }).as('loginRequest');
    });
  });